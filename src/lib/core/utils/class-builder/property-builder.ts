export class PropertyBuilder {
  constructor(
    public readonly name: string,
    public readonly type: string,
  ) {}

  private _imports: string[] = [];

  private _defaultValue?: string;
  private _isReadOnly: boolean = false;

  private _accessModifier: 'private' | 'public' | 'protected' = 'public';
  public get accessModifier() {
    return this._accessModifier;
  }

  public get imports() {
    return [...this._imports];
  }

  addDependency(moduleName: string, path: string) {
    this._imports.push(`import { ${moduleName} } from "${path}";`);
    return this;
  }

  public setAccessModifier(accessModifier: 'private' | 'public' | 'protected') {
    this._accessModifier = accessModifier;
    return this;
  }

  public setDefaultValue(defaultValue: string) {
    this._defaultValue = defaultValue;
    return this;
  }

  public setReadonlyState(isReadonly: boolean) {
    this._isReadOnly = isReadonly;
    return this;
  }

  public build() {
    const orders = [
      this._accessModifier, //"access_modifier",
      this._isReadOnly ? 'readonly' : undefined, // isReadonly
      !this._defaultValue
        ? `${this.name}${this._isReadOnly ? '' : '?'}: ${this.type}`
        : `${this.name}: ${this.type}`, // hasDefaultValue ? `${name}: type` : `${name}?: type`,
      !this._defaultValue ? `;` : ` = ${this._defaultValue};`, // hasDefaultValue ? ` = ${defaultValue};` : `;`
    ];
    return orders.filter((i) => !!i).join(' ');
  }
}
