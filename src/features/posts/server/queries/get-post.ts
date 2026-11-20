import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/server/db";
import { postIdSchema } from "../../schemas";
import type { Post } from "../../types";
import { postTag } from "../cache-tags";

export async function getPost({
  postId,
}: {
  postId: unknown;
}): Promise<Post | null> {
  const result = postIdSchema.safeParse(postId);
  return result.success ? getCachedPost({ postId: result.data }) : null;
}

async function getCachedPost({
  postId,
}: {
  postId: number;
}): Promise<Post | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(postTag({ postId }));

  return db.post.findUnique({ where: { id: postId } });
}
