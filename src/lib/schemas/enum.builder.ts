import { OpenApiClass } from '../core/openapi-class';
import { EnumType } from './types/enum.type';
import { join } from 'path';
import { existsSync } from 'fs';
import { FileNameAdapter } from './utils/convertToImport';
import { FileWriter } from '../core/utils/file-writer/file-writer';
export class EnumBuilder extends OpenApiClass {
  private _enumName: string = '';
  constructor(private enumData: EnumType) {
    super();
    this._enumName = 'E_' + Date.now().toString(16);
  }

  public setName(name: string) {
    this._enumName = name;
    return this;
  }

  private makeEnumBody() {
    const body: string[] = [];
    for (const item of this.enumData) {
      if (!Array.isArray(item)) {
        body.push(`\t${item} = "${item}"`);
        continue;
      }

      const [key, value] = item;
      if (typeof value === 'string') {
        body.push(`\t${key} = "${value}"`);
        continue;
      }
      body.push(`\t${key} = ${value}`);
    }
    return body.join(',\n') + ',\n';
  }

  async save(content: string) {
    this.setGeneratePath(
      join(
        this.generatePath,
        FileNameAdapter.convertTitleToFilename(this._enumName, 'enum'),
      ),
    );
    if (existsSync(this.generatePath)) {
      return Promise.resolve({
        path: this.generatePath,
        moduleName: this._enumName,
      });
    }
    await this.preparePath();
    await FileWriter.writeCode(this.generatePath, content);
    return {
      path: this.generatePath,
      moduleName: this._enumName,
    };
  }

  build() {
    let content = `export const enum ${this._enumName} {\n`;
    content += this.makeEnumBody();
    content += '}';
    return this.save(content);
  }
}
