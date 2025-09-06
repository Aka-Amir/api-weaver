export class NonInterfaceException extends Error {
  constructor(public readonly entityPath: string) {
    super();
  }
}
