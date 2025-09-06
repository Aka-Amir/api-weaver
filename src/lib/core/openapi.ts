import { join } from 'path';
import { ApiConfig } from '../paths/@types/api-config';
import { CreatedModuleType } from '../paths/@types/created-module.type';
import { PathList } from '../paths/path-list';
import { SchemaList } from '../schemas/schema-list';
import { ObjectSchemaType } from '../schemas/types/schema.type';
import { BaseBuilder } from './base-builder/base-builder';
import { ClassBuilder } from './utils/class-builder/class-builder';
import { MethodBuilder } from './utils/class-builder/method-builder';
import { PropertyBuilder } from './utils/class-builder/property-builder';
import { FileWriter } from './utils/file-writer/file-writer';

export class OpenApi3 {
  private _paths: PathList;
  private _schemas: SchemaList;
  private _baseBuilder: BaseBuilder;
  private _sdkPath: string;
  private readonly _rootPath: string;

  public readonly version: string;
  constructor(
    out: string,
    openApiObject: Record<string, object | string> | object,
  ) {
    this.version = openApiObject['openapi'] as string;

    const components = openApiObject['components'] as Record<string, object>;
    this._schemas = new SchemaList()
      .setGeneratePath(join(out, '@types'))
      .init(components['schemas'] as Record<string, ObjectSchemaType>);

    this._paths = new PathList(
      openApiObject['paths'] as Record<string, Record<string, ApiConfig>>,
      this._schemas,
    ).setGeneratePath(join(out, 'api'));
    this._paths.init();

    this._sdkPath = join(out, 'app.sdk.ts');
    this._rootPath = out;
    this._baseBuilder = new BaseBuilder().setGeneratePath(join(out, '@base'));
  }

  async build() {
    await this._baseBuilder.build();
    await this._schemas.write();
    const modules = await this._paths.build();
    const sdk = this.createSdk(modules).build();
    await FileWriter.writeCode(this._sdkPath, sdk);
  }

  private createSdk(createdModule: CreatedModuleType[]) {
    const className = 'AppSDK';
    const sdk = new ClassBuilder(className)
      .addProperty(
        new PropertyBuilder('static _instance', className).setAccessModifier(
          'private',
        ),
      )
      .addMethod(
        new MethodBuilder('static init')
          .addInput('baseUrl', 'string', true)
          .addInput('httpModule', 'IHttpClient', true)
          .addOutputType(className)
          .setContent(
            `
          if (!${className}._instance) {
          ${className}._instance = new ${className}(baseUrl, httpModule);
          }
          return ${className}._instance;
        `,
          )
          .setAsync(false),
      );

    const constructorContent: string[] = [];

    for (const item of createdModule) {
      const name = [...item.name.split('')];
      name[0] = name[0].toLowerCase();
      const importStyleArray = item.path
        .replace('.ts', '')
        .replace(this._rootPath, '.');
      const varName = name.join('');
      sdk.addProperty(
        new PropertyBuilder(varName, item.name)
          .setAccessModifier('public')
          .setReadonlyState(true)
          .addDependency(item.name, importStyleArray),
      );

      const registerLine = `this.${varName} = new ${item.name}(baseUrl, httpModule);`;
      constructorContent.push(registerLine);
    }

    const ctorMethod = new MethodBuilder('constructor')
      .setAccessModifier('private')
      .addDependency('IHttpClient', './@base/interfaces/http-client.interface')
      .addInput('baseUrl', 'string', true)
      .addInput('httpModule', 'IHttpClient', true)
      .setContent(constructorContent.join('\n'));
    sdk.addMethod(ctorMethod);

    sdk.addMethod(
      new MethodBuilder('static get services')
        .setAccessModifier('public')
        .addOutputType(className).setContent(`
          if(!this._instance) throw new Error("Module has not been initialized yet !")
          return this._instance;
        `),
    );
    return sdk;
  }
}
