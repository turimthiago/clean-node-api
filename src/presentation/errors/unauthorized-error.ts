export class AnauthorizedError extends Error {
  constructor () {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}
