import { expect, test } from "vitest";
import { parseOrThrow } from "@/server/validation";
import { ValidationError } from "@/server/errors";
import { postIdSchema } from "@/features/posts/schemas";

test("vitest setup resolves @/ paths and server-only modules", () => {
  expect(parseOrThrow({ schema: postIdSchema, input: "3" })).toBe(3);
  expect(() => parseOrThrow({ schema: postIdSchema, input: "abc" })).toThrow(
    ValidationError,
  );
});
