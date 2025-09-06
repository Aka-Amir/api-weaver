import { Global, Module } from '@nestjs/common';
import { CommandsService } from './commands.service';

@Global()
@Module({
  providers: [CommandsService],
})
export class AppModule {}
