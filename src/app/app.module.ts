import { Global, Module } from '@nestjs/common';
import { GenerateCommand } from './commands/generate.command';

@Global()
@Module({
  providers: [GenerateCommand],
})
export class AppModule {}
