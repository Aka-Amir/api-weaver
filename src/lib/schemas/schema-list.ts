import { join } from 'path';
import { OpenApiClass } from '../core/openapi-class';
import { Schema } from './schema';
import { ObjectSchemaType } from './types/schema.type';
import { FileNameAdapter } from './utils/convertToImport';
import { readdir } from 'fs/promises';
import { FileWriter } from '../core/utils/file-writer/file-writer';

export class SchemaList extends OpenApiClass {
  private _schemasRef: Record<string, number> = {};
  private _schemas: Schema[] = [];
  constructor() {
    super();
  }

  init(schemas: Record<string, ObjectSchemaType>) {
    for (const [title, objectType] of Object.entries(schemas)) {
      const index = this._schemas.length;
      this._schemas.push(
        new Schema(title, objectType, schemas).setGeneratePath(
          join(
            this.generatePath,
            FileNameAdapter.convertTitleToFilename(title),
          ),
        ),
      );
      this._schemasRef[`#/components/schemas/` + title] = index;
    }
    return this;
  }

  getReference(ref: string) {
    return this._schemas[this._schemasRef[ref]];
  }

  async write() {
    for (const schema of this._schemas) await schema.write();

    const lines = (
      await readdir(this.generatePath, {
        recursive: true,
        withFileTypes: true,
      })
    )
      .map((item) => {
        const splittedName = item.name.split('.');
        splittedName.pop(); // remove extension
        const path =
          item.parentPath.replace(this.generatePath, '.') +
          '/' +
          splittedName.join('.');
        if (path === './') return '';
        return `export * from "${path}";`;
      })
      .sort((a, b) => a.length - b.length);

    await FileWriter.writeCode(
      join(this.generatePath, 'index.ts'),
      lines.join('\n'),
    );
  }
}
