import { DynamicModule } from '@nestjs/common';
import { AppModule } from './app/app.module';

export class RootModule {
  static forRoot(rootDir: string): DynamicModule {
    return {
      module: RootModule,
      imports: [AppModule],
      global: true,
      providers: [
        {
          provide: 'ROOT_DIR',
          useValue: rootDir,
        },
      ],
      exports: ['ROOT_DIR'],
    };
  }
}
