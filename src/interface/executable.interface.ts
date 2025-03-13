import { ExecutableResult } from 'src/utils/executable-result.util';

export interface IExecutable<TIN, TOUT = void> {
  execute(data: TIN): ExecutableResult<TOUT>;
}
