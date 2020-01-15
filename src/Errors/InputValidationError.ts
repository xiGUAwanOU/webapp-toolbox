export default class InputValidationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InputValidationError";
  }
}
