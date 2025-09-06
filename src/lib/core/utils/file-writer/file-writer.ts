import { Logger } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { format } from 'prettier';

export class FileWriter {
  static async writeCode(path: string, content: string | Buffer) {
    const fileContent = await format(content.toString('utf-8'), {
      parser: 'typescript',
      endOfLine: 'auto',
      semi: false,
      tabWidth: 2,
      singleQuote: false,
    }).catch(() => {
      Logger.warn('Error while saving ' + path, FileWriter.name);
      return content.toString('utf-8');
    });
    return writeFile(path, fileContent, {
      encoding: 'utf8',
    });
  }
}
