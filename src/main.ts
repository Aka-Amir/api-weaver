#!/usr/bin/env node

import { ConsoleLogger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { join } from 'path';
import { RootModule } from './root.module';

async function bootstrap() {
  await CommandFactory.run(
    RootModule.forRoot(join(__dirname, '..')),
    new ConsoleLogger({
      timestamp: true,
      prefix: 'OpenAPI-Generator',
      context: 'Root',
    }),
  );
}

bootstrap()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
