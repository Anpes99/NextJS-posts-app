"use server";

import { ValidationError } from "@/server/errors";
import { getClientIp, rateLimit } from "@/server/rate-limit";
import { createPost } from "../mutations/create-post";

export type CreatePostResult =
  | { ok: true }
  | {
      ok: false;
      errors: Record<string, string[] | undefined>;
      formError?: string;
    };

export async function createPostAction(
  formData: FormData,
): Promise<CreatePostResult> {
  const ip = await getClientIp();
  if (
    !rateLimit({ key: `create-post:${ip}`, limit: 5, windowMs: 10 * 60_000 })
  ) {
    return {
      ok: false,
      errors: {},
      formError: "Too many posts. Try again in a few minutes.",
    };
  }

  try {
    await createPost(Object.fromEntries(formData));
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, errors: error.fieldErrors };
    }
    throw error;
  }
}
