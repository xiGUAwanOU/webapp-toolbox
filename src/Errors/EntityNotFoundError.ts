export default class EntityNotFoundError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "EntityNotFoundError";
  }
}
