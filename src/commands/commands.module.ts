import { Module } from '@nestjs/common';
import { InitModule } from './init/init.module';

@Module({
  imports: [InitModule]
})
export class CommandsModule {}
