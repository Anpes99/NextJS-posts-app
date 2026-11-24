import "server-only";
import { updateTag } from "next/cache";
import { db } from "@/server/db";
import { saveImage } from "@/server/uploads";
import { parseOrThrow } from "@/server/validation";
import { createPostSchema } from "../../schemas";
import type { Post } from "../../types";
import { POSTS_LIST_TAG } from "../cache-tags";

export async function createPost({
  input,
  authorId,
}: {
  input: unknown;
  authorId: string;
}): Promise<Post> {
  const { image, ...data } = parseOrThrow({ schema: createPostSchema, input });
  const imageUrl = image ? await saveImage({ file: image }) : null;
  const post = await db.post.create({ data: { ...data, imageUrl, authorId } });
  // read-your-own-writes: the server action returns automatically re-rendered page with the new post
  updateTag(POSTS_LIST_TAG);
  return post;
}
