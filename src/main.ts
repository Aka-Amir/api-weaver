#!/usr/bin/env node

import { CommandFactory } from 'nest-commander';
import { RootModule } from './root.module';
import { join } from 'path';

async function bootstrap() {
  await CommandFactory.run(RootModule.forRoot(join(__dirname, '..')));
}

bootstrap()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
