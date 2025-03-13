import { Inject, Injectable } from '@nestjs/common';
import { IExecutable } from 'src/interface/executable.interface';
import { ExecutableResult } from 'src/utils/executable-result.util';
import { IConfig } from '../models/config/config.interface';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

@Injectable()
export class LoadConfigUseCase implements IExecutable<void, IConfig | null> {
  @Inject('CONFIG_PATH') private configPath: string;
  execute(): ExecutableResult<IConfig | null> {
    return new ExecutableResult(() => this.loadConfig());
  }

  private async loadConfig(): Promise<IConfig | null> {
    if (!existsSync(this.configPath)) return null;
    const stringifiedJSON = await readFile(this.configPath);
    return JSON.parse(stringifiedJSON.toString()) as IConfig;
  }
}
