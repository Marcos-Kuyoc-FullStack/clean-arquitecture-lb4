export class InvalidParamError {
  public error: string;

  constructor(param: string, message: string) {
    this.error = `${param} is invalid, ${message}`
  }
}
