import type { Post } from "@/generated/prisma/client";

export type { Post };

export type PostsPage = {
  posts: Post[];
  nextCursor: number | null;
};
