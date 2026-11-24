import "server-only";
import { updateTag } from "next/cache";
import { db } from "@/server/db";
import { ForbiddenError } from "@/server/errors";
import { parseOrThrow } from "@/server/validation";
import { updatePostSchema } from "../../schemas";
import type { Post } from "../../types";
import { POSTS_LIST_TAG, postTag } from "../cache-tags";

export async function updatePost({
  input,
  userId,
}: {
  input: unknown;
  userId: string;
}): Promise<Post | null> {
  const { postId, ...data } = parseOrThrow({ schema: updatePostSchema, input });

  const existing = await db.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (!existing) return null;
  if (existing.authorId !== userId) {
    throw new ForbiddenError("You can only edit your own posts.");
  }

  const [post] = await db.post.updateManyAndReturn({
    where: { id: postId },
    data,
  });
  if (!post) return null;

  // Read-your-own-writes: the post page and the feed both show the text.
  updateTag(postTag({ postId }));
  updateTag(POSTS_LIST_TAG);
  return post;
}
