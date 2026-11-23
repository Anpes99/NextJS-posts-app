import "server-only";
import { updateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/server/db";
import { deleteImage } from "@/server/uploads";
import { parseOrThrow } from "@/server/validation";
import { postIdSchema } from "../../schemas";
import { POSTS_LIST_TAG, postTag } from "../cache-tags";

export async function deletePost(input: unknown): Promise<void> {
  const postId = parseOrThrow({ schema: postIdSchema, input });

  const post = await db.post
    .delete({ where: { id: postId }, select: { imageUrl: true } })
    .catch((error) => {
      // P2025: record not found (already deleted). Rethrow real failures.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      }
      throw error;
    });
  if (!post) return;
  if (post.imageUrl) await deleteImage({ url: post.imageUrl });

  updateTag(postTag({ postId }));
  updateTag(POSTS_LIST_TAG);
}
