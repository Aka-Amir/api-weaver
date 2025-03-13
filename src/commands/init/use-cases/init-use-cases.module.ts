import { Module } from '@nestjs/common';
import { LoadConfigUseCase } from './load.service';
import { Create } from './create.service';
import { InitUseCasesFacadeService } from './use-cases-facade.service';
import { join } from 'path';

@Module({
  providers: [
    {
      provide: 'CONFIG_PATH',
      useFactory: () => join(process.cwd(), 'mit-bring.conf.json'),
    },
    {
      provide: 'load:use-case',
      useClass: LoadConfigUseCase,
    },
    {
      provide: 'create:use-case',
      useClass: Create,
    },
    InitUseCasesFacadeService,
  ],
  exports: [InitUseCasesFacadeService],
})
export class InitUseCasesModule {}
