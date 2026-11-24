import type { Post, User } from "@/generated/prisma/client";

export type { Post };

export type PostWithAuthor = Post & { author: { name: User["name"] } };

export type PostsPage = {
  posts: PostWithAuthor[];
  nextCursor: number | null;
};
