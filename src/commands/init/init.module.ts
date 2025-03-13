import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { InitUseCasesModule } from './use-cases/init-use-cases.module';

@Module({
  imports: [InitUseCasesModule],
  providers: [InitService],
})
export class InitModule {}
