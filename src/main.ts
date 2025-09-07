#!/usr/bin/env node

import { CommandFactory } from 'nest-commander';
import { join } from 'path';
import { RootModule } from './root.module';
import Logger from './app/logger';

async function bootstrap() {
  await CommandFactory.run(RootModule.forRoot(join(__dirname, '..')), {
    errorHandler: (err: Error) => {
      Logger.error(err);
      process.exit(1);
    },
    serviceErrorHandler: (err: Error) => {
      Logger.error(err);
      process.exit(1);
    },
  });
}

bootstrap()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
