"use server";

import { ValidationError } from "@/server/errors";
import { createPost } from "../mutations/create-post";

export type CreatePostResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string[] | undefined> };

export async function createPostAction(
  formData: FormData,
): Promise<CreatePostResult> {
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
