import { z } from "zod";
import { POSTS_MAX_PAGE_SIZE, POSTS_PAGE_SIZE } from "./constants";

export const createPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  text: z.string().trim().min(1, "Text is required").max(5000),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const postIdSchema = z.coerce.number().int().positive();

export const listPostsQuerySchema = z.object({
  cursor: postIdSchema.optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(POSTS_MAX_PAGE_SIZE)
    .default(POSTS_PAGE_SIZE),
});
