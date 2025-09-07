import { OpenApiClass } from '../core/openapi-class';
import { MethodBuilder } from '../core/utils/class-builder/method-builder';
import { SchemaList } from '../schemas/schema-list';
import { ApiConfig } from './@types/api-config';
import { ClassRegistry } from './class-registry';
import Logger from 'src/app/logger';

export class Endpoint extends OpenApiClass {
  public readonly scope: string;
  private _methodObject!: MethodBuilder;
  private _baseURL: string;
  public readonly method: string;

  constructor(
    public readonly path: string,
    method: string,
    public readonly info: ApiConfig,
  ) {
    super();
    const [scope, methodName, base] = info.operationId.split('_');
    this.scope = scope;
    this._baseURL = base;
    this._methodObject = new MethodBuilder(methodName);
    this.method = method.toLowerCase();
  }

  private prepareMethod(schema: SchemaList) {
    this._methodObject.setAsync(true);
    let path = this.path;
    const query: string[] = [];
    let bodyVar = '';

    if (this.info.requestBody) {
      const ref = schema.getReference(
        this.info.requestBody?.content['application/json'].schema.$ref,
      );
      this._methodObject.addDependency(ref.name, '../@types');
      this._methodObject.addInput('payload', ref.name, true);
      bodyVar = 'payload';
    }
    for (const item of this.info.parameters ?? []) {
      let type: string = 'unknown';
      if ('$ref' in item.schema) {
        type = schema.getReference(item.schema.$ref).name;
        this._methodObject.addDependency(type, '../@types');
      } else {
        type = item.schema.type;
      }
      if (item.in === 'query') query.push(item.name);
      else if (item.in === 'path') {
        path = path.replace(`{${item.name}}`, '${' + item.name + '}');
      } else {
        Logger.log('Could not detect !');
      }
      this._methodObject.addInput(item.name, type, item.required);
    }

    let outType = '';
    try {
      const ref = (this.info.responses[200] ?? this.info.responses[201])
        ?.content['application/json'].schema.$ref;
      if (ref) {
        outType = schema.getReference(ref).name;
        this._methodObject.addDependency(outType, '../@types');
        this._methodObject.addOutputType(outType);
      } else {
        outType = 'unknown';
      }
    } catch {
      Logger.log('Warning !', `Response for ${this.path} is unknown !!`);
      this._methodObject.addOutputType('object');
      outType = 'object';
    }

    this._methodObject.setContent(
      `
      return this.httpModule.request<${outType}>(` +
        '`' +
        path +
        '`' +
        `, {
        method: "${this.method}",${!bodyVar ? '' : 'data: payload,'}${!query.length ? '' : `query: { ${query.join(',\n')} }`}
      })
    `,
    );
  }

  public build(schema: SchemaList) {
    try {
      this.prepareMethod(schema);
      const classObject = ClassRegistry.getInstance().getClass(this.scope);
      classObject
        .setExtends('SdkModule', '../@base/sdk-module')
        .addMethod(this._methodObject);
      ClassRegistry.getInstance().saveClass(classObject);
      return classObject;
    } catch (e) {
      Logger.log(this.info);
      throw e;
    }
  }
}
