import { DynamicModule } from '@nestjs/common';
import { CommandsModule } from './commands/commands.module';

export class RootModule {
  static forRoot(rootDir: string): DynamicModule {
    return {
      module: RootModule,
      imports: [CommandsModule],
      providers: [
        {
          provide: 'ROOT_DIR',
          useValue: rootDir,
        },
      ],
    };
  }
}
