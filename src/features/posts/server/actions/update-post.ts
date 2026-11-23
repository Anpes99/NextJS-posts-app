"use server";

import { ValidationError } from "@/server/errors";
import { updatePost } from "../mutations/update-post";

export type UpdatePostResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string[] | undefined>; formError?: string };

export async function updatePostAction(formData: FormData): Promise<UpdatePostResult> {
  try {
    const post = await updatePost(Object.fromEntries(formData));
    if (!post) return { ok: false, errors: {}, formError: "This post no longer exists." };
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, errors: error.fieldErrors };
    }
    throw error;
  }
}
