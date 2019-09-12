export default class BasicAuthError extends Error {
  public constructor() {
    super("Basic auth failed, access denied");
    this.name = "BasicAuthError";
  }
}
