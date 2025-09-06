import { ClassBuilder } from '../core/utils/class-builder/class-builder';

export class ClassRegistry {
  private constructor() {}
  private static _instance: ClassRegistry;
  public static getInstance() {
    if (!this._instance) this._instance = new ClassRegistry();
    return this._instance;
  }

  private _registeredClass: Record<string, ClassBuilder> = {};

  static get registeredClass() {
    return ClassRegistry._instance._registeredClass;
  }

  getClass(name: string): ClassBuilder {
    let classObject: ClassBuilder | undefined = this._registeredClass[name];
    if (classObject) return classObject;
    classObject = new ClassBuilder(name);
    this._registeredClass[name] = classObject;
    return classObject;
  }

  saveClass(classBuilder: ClassBuilder) {
    this._registeredClass[classBuilder.className] = classBuilder;
    return this;
  }
}
