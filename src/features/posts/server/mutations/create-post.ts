import "server-only";
import { revalidateTag } from "next/cache";
import { db } from "@/server/db";
import { parseOrThrow } from "@/server/validation";
import { createPostSchema } from "../../schemas";
import type { Post } from "../../types";
import { POSTS_LIST_TAG } from "../cache-tags";

export async function createPost(input: unknown): Promise<Post> {
  const data = parseOrThrow({ schema: createPostSchema, input });
  const post = await db.post.create({ data });
  revalidateTag(POSTS_LIST_TAG, "max");
  return post;
}
