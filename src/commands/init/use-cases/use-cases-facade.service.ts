import { Inject, Injectable } from '@nestjs/common';
import { IExecutable } from 'src/interface/executable.interface';
import { IConfig } from '../models/config/config.interface';

@Injectable()
export class InitUseCasesFacadeService {
  @Inject('create:use-case') public create: IExecutable<IConfig>;
  @Inject('load:use-case') public load: IExecutable<void, IConfig | null>;
}
