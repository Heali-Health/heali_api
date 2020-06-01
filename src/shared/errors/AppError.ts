export default class Error {
  public readonly message: string;

  public readonly statusCode: number; // código http

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
