import { z } from "zod";
import {
  POST_IMAGE_MAX_BYTES,
  POSTS_MAX_PAGE_SIZE,
  POSTS_PAGE_SIZE,
} from "./constants";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const createPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  text: z.string().trim().min(1, "Text is required").max(5000),
  // An empty file input submits a 0-byte file; treat it as no image.
  image: z.preprocess(
    (value) => (value instanceof File && value.size === 0 ? undefined : value),
    z.file().max(POST_IMAGE_MAX_BYTES).mime(IMAGE_MIME_TYPES).optional(),
  ),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const postIdSchema = z.coerce.number().int().positive();

export const updatePostSchema = z.object({
  postId: postIdSchema,
  text: z.string().trim().min(1, "Text is required").max(5000),
});

export const listPostsQuerySchema = z.object({
  cursor: postIdSchema.optional(),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(POSTS_MAX_PAGE_SIZE)
    .default(POSTS_PAGE_SIZE),
});
