import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/server/db";
import { parseOrThrow } from "@/server/validation";
import { listPostsQuerySchema } from "../../schemas";
import type { PostsPage } from "../../types";
import { POSTS_LIST_TAG } from "../cache-tags";

export async function getPostsPage(query: unknown = {}): Promise<PostsPage> {
  const { cursor, limit } = parseOrThrow({
    schema: listPostsQuerySchema,
    input: query,
  });
  return getCachedPostsPage({ cursor, limit });
}

async function getCachedPostsPage({
  cursor,
  limit,
}: {
  cursor: number | undefined;
  limit: number;
}): Promise<PostsPage> {
  "use cache";
  cacheLife("hours");
  cacheTag(POSTS_LIST_TAG);

  const rows = await db.post.findMany({
    where: cursor ? { id: { lt: cursor } } : undefined,
    orderBy: { id: "desc" },
    take: limit + 1,
    include: { author: { select: { name: true } } },
  });

  const hasMore = rows.length > limit;
  const posts = hasMore ? rows.slice(0, limit) : rows;
  return { posts, nextCursor: hasMore ? posts[posts.length - 1].id : null };
}
