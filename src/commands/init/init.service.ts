import { Inject, Injectable } from '@nestjs/common';
import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
  Question,
} from 'nest-commander';
import { ConfigBuilder } from './models/config/config.model';
import { InitUseCasesFacadeService } from './use-cases/use-cases-facade.service';

@Command({ name: 'init' })
@Injectable()
export class InitService extends CommandRunner {
  private readonly config: ConfigBuilder;
  @Inject(InitUseCasesFacadeService) private facade: InitUseCasesFacadeService;

  constructor(private readonly inquirerService: InquirerService) {
    super();
    this.config = new ConfigBuilder();
  }

  async run(): Promise<void> {
    const loadedConfig = await this.facade.load.execute().toPromise().resolve();

    if (loadedConfig) {
      console.log(loadedConfig);
      const response = await this.inquirerService.ask('init', {
        shouldOverride: true,
      });

      console.log(response);
    }

    if (!this.config.apiKey) {
      await this.inquirerService.ask('init', {
        apiKey: true,
      });
    }

    await this.execute();
  }

  private async execute() {
    await this.facade.create.execute(this.config.build()).toPromise().resolve();
  }

  @Option({
    flags: '-a, --api-key [string]',
    name: 'Api key',
  })
  setApiKey(apiKey: string) {
    this.config.setApiKey(apiKey);
    return apiKey;
  }

  @Question({
    name: 'shouldOverride',
    type: 'list',
    choices: [
      {
        name: 'yes',
        value: true,
      },
      {
        name: 'no',
        value: false,
      },
    ],
    message: () =>
      `Config already has an api key, would you like to override ? `,
    askAnswered: true,
  })
  shouldOverride(value: boolean) {
    return value;
  }

  @Question({
    type: 'input',
    name: 'apiKey',
    message: 'Github api key : ',
    askAnswered: true,
  })
  askApiKey(apiKey: string) {
    return this.setApiKey(apiKey);
  }
}
