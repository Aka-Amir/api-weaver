import { Inject, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { IExecutable } from 'src/interface/executable.interface';
import { ExecutableResult } from 'src/utils/executable-result.util';
import { IConfig } from '../models/config/config.interface';

@Injectable()
export class Create implements IExecutable<IConfig> {
  @Inject('CONFIG_PATH') private configPath: string;

  execute(data: IConfig): ExecutableResult<void> {
    return new ExecutableResult(() => this.create(data));
  }

  private async create(config: IConfig) {
    if (existsSync(this.configPath)) {
      console.log('Config has already been created !');
      return;
    }
    await writeFile(this.configPath, JSON.stringify(config, null, 2));
  }
}
