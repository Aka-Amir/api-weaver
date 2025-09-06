import { existsSync, mkdirSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { OpenApiClass } from '../openapi-class';
import { ClassBuilder } from '../utils/class-builder/class-builder';
import { MethodBuilder } from '../utils/class-builder/method-builder';
import { FileWriter } from '../utils/file-writer/file-writer';
export class BaseBuilder extends OpenApiClass {
  async build() {
    if (!existsSync(this.generatePath))
      await mkdir(this.generatePath, {
        recursive: true,
      });

    const sdkClass = new ClassBuilder('SdkModule')
      .addMethod(
        new MethodBuilder('constructor')
          .addInput('private baseUrl', 'string', true)
          .addInput('protected httpModule', 'IHttpClient', true)
          .addDependency('IHttpClient', './interfaces/http-client.interface'),
      )
      .addMethod(
        new MethodBuilder('getRoute')
          .setAccessModifier('protected')
          .setContent(`return this.baseUrl + '/' + route;`)
          .addOutputType('string')
          .addInput('route', 'string', true),
      );

    const httpClientInterface = `export type RequestObjectType<T extends object = object> = {
  method: string;
  headers?: Record<string, string>;
  data?: T;
  query?: object;
};

export interface IHttpClient {
  setBaseURL(baseURL: string): this;
  setDefaultHeader(key: string, value: string): this;
  request<T extends object>(url: string, config: RequestObjectType): Promise<T>;
}
`;

    mkdirSync(join(this.generatePath, 'interfaces'), { recursive: true });
    await FileWriter.writeCode(
      join(this.generatePath, 'interfaces', 'http-client.interface.ts'),
      httpClientInterface,
    );
    await FileWriter.writeCode(
      join(this.generatePath, 'sdk-module.ts'),
      sdkClass.build(),
    );
    // for (const directory of directories) {
    //   if (directory.isDirectory()) continue;
    //   const fileData = await readFile(
    //     join(directory.parentPath, directory.name),
    //   );
    //   const path = join(directory.parentPath.replace(root, ''), directory.name);
    //   const parent = join(this.generatePath, this.getParentPath(path));
    //   if (!existsSync(parent)) await mkdir(parent, { recursive: true });
    //   await FileWriter.writeCode(join(this.generatePath, path), fileData);
    // }
  }
}
