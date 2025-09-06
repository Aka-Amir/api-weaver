import { MethodBuilder } from './method-builder';
import { PropertyBuilder } from './property-builder';

export class ClassBuilder {
  constructor(public readonly className: string) {}

  private _imports: string[] = [];
  private _classBody: string[] = [];
  private _extensionToken: string = '';

  addMethod(method: MethodBuilder) {
    if (method.imports.length > 0) this._imports.push(...method.imports);
    this._classBody.push(method.build('method'));
    return this;
  }

  addProperty(property: PropertyBuilder) {
    if (property.imports.length > 0) this._imports.push(...property.imports);
    this._classBody.unshift(property.build());
    return this;
  }

  setExtends(className: string, importFrom: string) {
    const importToken = `import { ${className} } from "${importFrom}"; `;
    if (!this._imports.includes(importToken)) this._imports.push(importToken);
    this._extensionToken = 'extends ' + className + ' ';
    return this;
  }

  removeExtends() {
    this._extensionToken = '';
    return this;
  }

  private addIndent(item: string) {
    return item
      .split('\n')
      .map((item) => `\t` + item)
      .join('\n');
  }

  build() {
    const imports = Array.from(new Set(this._imports));
    return `
${imports.join('\n')}

export class ${this.className} ${this._extensionToken}{

${this._classBody.map((scriptItem) => this.addIndent(scriptItem)).join('\n \n')}

}
`;
  }
}
