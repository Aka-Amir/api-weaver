import { from, isObservable, lastValueFrom, Observable } from 'rxjs';
import { IExecutableResolver } from 'src/interface/executable-resolver.interface';

export class ExecutableResult<T = void>
  implements IExecutableResolver<Promise<T> | Observable<T>>
{
  private _mode: 'PROMISE' | 'OBSERVABLE' = 'PROMISE';
  constructor(private fn: () => Promise<T> | Observable<T> | T) {}

  public toPromise(): IExecutableResolver<Promise<T>> {
    this._mode = 'PROMISE';
    return this as IExecutableResolver<Promise<T>>;
  }

  public toObservable(): IExecutableResolver<Observable<T>> {
    this._mode = 'OBSERVABLE';
    return this as IExecutableResolver<Observable<T>>;
  }

  public resolve(): Promise<T> | Observable<T> {
    const execution = this.fn();
    if (isObservable(execution)) {
      if (this._mode === 'OBSERVABLE') return execution;
      return lastValueFrom(execution);
    }

    if (this._mode === 'PROMISE') return execution as Promise<T>;
    return from(Promise.resolve(execution));
  }
}
