import { IConfig } from './config.interface';

export class ConfigBuilder implements IConfig {
  apiKey: string;

  constructor(defaultValue?: IConfig) {
    if (!defaultValue)
      defaultValue = {
        apiKey: '',
      };

    Object.assign(this, defaultValue);
  }

  setApiKey(apiKey: string): this {
    this.apiKey = apiKey;
    return this;
  }

  build(): IConfig {
    return this;
  }
}
