export class InvalidParamsError {
  public error: string;

  constructor(param: string, message: string) {
    this.error = `${param} is invalid, ${message}`
  }
}
