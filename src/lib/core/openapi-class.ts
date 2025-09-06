import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

export abstract class OpenApiClass {
  protected _generatePath: string = __dirname;
  public get generatePath(): string {
    return this._generatePath;
  }
  public setGeneratePath(path: string) {
    this._generatePath = path;
    return this;
  }

  protected preparePath() {
    const parentPath = this.getParentPath();
    if (existsSync(parentPath)) {
      return;
    }
    return mkdir(parentPath, { recursive: true });
  }

  protected getParentPath(path = this._generatePath) {
    const pathArray = path.split('/');
    pathArray.pop();
    return pathArray.join('/');
  }
}
