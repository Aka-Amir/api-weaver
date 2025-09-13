import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { Command, CommandRunner, Option } from 'nest-commander';
import { join } from 'path';
import { ApiWeaver } from '@api-weaver/core';
import Logger from '../logger';
import { GenerationOptions } from '../types/options.type';

@Injectable()
@Command({ name: 'generate', aliases: ['g', 'gen'] })
export class GenerateCommand extends CommandRunner {
  async run(passedParams: string[], options: GenerationOptions): Promise<void> {
    options.outDirectory = join(process.cwd(), options.outDirectory);
    options.openApiFile = join(process.cwd(), options.openApiFile);
    Logger.log(`Reading file ${options.openApiFile} ...`);
    if (!existsSync(options.openApiFile)) {
      Logger.error(
        `OpenAPI file ${options.openApiFile} does not exist. exiting...`,
      );
      throw new Error(`OpenAPI file ${options.openApiFile} does not exist.`);
    }

    let openApiJson: Record<string, object | string>;
    try {
      const result = readFileSync(options.openApiFile).toString('utf-8');
      openApiJson = JSON.parse(result) as Record<string, object | string>;
      if (!openApiJson) throw new Error('Invalid OpenAPI file');
    } catch (e) {
      Logger.error(
        `Error reading or parsing file ${options.openApiFile}. exiting...`,
      );
      throw e;
    }

    Logger.log(`Using output directory ${options.outDirectory} ...`);
    if (existsSync(options.outDirectory)) {
      Logger.warn(
        `Output directory ${options.outDirectory} already exists. It will be overwritten.`,
      );
    } else {
      Logger.log(`Creating output directory ${options.outDirectory} ...`);
      mkdirSync(options.outDirectory, { recursive: true });
    }
    Logger.log(`Generating SDK ${options.sdkName} ...`);
    try {
      await new ApiWeaver(options.outDirectory, openApiJson).build();
    } catch (e) {
      Logger.error(`Error generating SDK ${options.sdkName}. exiting...`);
      throw e;
    }
  }

  @Option({
    flags: '-o, --out [string]',
    name: 'outDirectory',
    description: 'Output directory for the generated files',
    required: true,
  })
  public out(outPath: string) {
    return outPath;
  }

  @Option({
    flags: '-f, --file [string]',
    name: 'openApiFile',
    required: true,
  })
  public file(filePath: string) {
    return filePath;
  }

  @Option({
    flags: '-n, --name [string]',
    name: 'sdkName',
    required: false,
    defaultValue: 'AppSdk',
  })
  public sdkName(name: string) {
    return name;
  }
}
