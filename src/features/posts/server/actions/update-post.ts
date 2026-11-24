"use server";

import { getSession } from "@/server/auth";
import { ForbiddenError, ValidationError } from "@/server/errors";
import { updatePost } from "../mutations/update-post";

export type UpdatePostResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string[] | undefined>; formError?: string };

export async function updatePostAction(formData: FormData): Promise<UpdatePostResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, errors: {}, formError: "Sign in to edit posts." };
  }

  try {
    const post = await updatePost({
      input: Object.fromEntries(formData),
      userId: session.user.id,
    });
    if (!post) {
      return { ok: false, errors: {}, formError: "This post no longer exists." };
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, errors: error.fieldErrors };
    }
    if (error instanceof ForbiddenError) {
      return { ok: false, errors: {}, formError: error.message };
    }
    throw error;
  }
}
