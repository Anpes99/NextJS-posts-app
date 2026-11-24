export class ValidationError extends Error {
  constructor(readonly fieldErrors: Record<string, string[] | undefined>) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}
