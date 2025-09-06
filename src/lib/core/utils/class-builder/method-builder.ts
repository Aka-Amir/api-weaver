export class MethodBuilder {
  constructor(public readonly methodName: string) {}

  private _content: string = '';
  private _outputTypes: string[] = [];
  private _requiredInputs: string[] = [];
  private _optionalInputs: string[] = [];
  private _imports: string[] = [];
  private _isAsync: boolean = false;
  private _accessModifier: 'private' | 'public' | 'protected' = 'public';

  setAccessModifier(accessModifier: 'private' | 'public' | 'protected') {
    this._accessModifier = accessModifier;
    return this;
  }

  setAsync(mode: boolean) {
    this._isAsync = mode;
    return this;
  }

  public get outputTypes() {
    return [...this._outputTypes];
  }

  public get inputs() {
    return [...this._requiredInputs, ...this._optionalInputs];
  }

  public get imports() {
    return [...this._imports];
  }

  addDependency(moduleName: string, path: string) {
    this._imports.push(`import { ${moduleName} } from "${path}";`);
    return this;
  }

  addInput(name: string, type: string, required?: boolean) {
    if (required) {
      this._requiredInputs.push(`${name}: ${type}`);
    } else {
      this._optionalInputs.push(`${name}${!required ? '?' : ''}: ${type}`);
    }
    return this;
  }

  addOutputType(outputType: string) {
    this._outputTypes.push(outputType);
    return this;
  }

  setContent(content: string) {
    this._content = content;
    return this;
  }

  build(as: 'method' | 'function' = 'method', prefix: string = '') {
    switch (as) {
      case 'function':
        return this.buildAsFunction(prefix);
      default:
        return this.buildAsMethod(prefix);
    }
  }

  private getInputs() {
    return this.inputs.join(', ');
  }

  private getOutput() {
    const outType =
      this._outputTypes.length > 0 ? this._outputTypes.join(' | ') : '';
    if (this._isAsync) return `Promise<${outType || 'unknown'}>`;
    return outType;
  }

  private buildAsMethod(prefix: string = '') {
    const params = this.getInputs();
    const out = this.getOutput();
    const asyncToken = this._isAsync ? 'async ' : '';
    return `${prefix}${this._accessModifier} ${asyncToken}${this.methodName}(${params})${!out ? '' : `: ${out}`} {\n\t${this._content}\n}`;
  }

  private buildAsFunction(prefix: string = '') {
    const params = this.getInputs();
    const out = this.getOutput();
    const asyncToken = this._isAsync ? 'async ' : '';
    return `${prefix}export ${asyncToken}function ${this.methodName}(${params})${!out ? '' : `: ${out}`} {
  ${this._content}
}`;
  }
}
