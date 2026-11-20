import "server-only";
import { z } from "zod";
import { ValidationError } from "./errors";

export function parseOrThrow<T extends z.ZodType>({
  schema,
  input,
}: {
  schema: T;
  input: unknown;
}): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(z.flattenError(result.error).fieldErrors);
  }
  return result.data;
}
