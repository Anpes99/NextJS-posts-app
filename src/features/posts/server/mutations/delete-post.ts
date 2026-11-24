import "server-only";
import { updateTag } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/server/db";
import { ForbiddenError } from "@/server/errors";
import { deleteImage } from "@/server/uploads";
import { parseOrThrow } from "@/server/validation";
import { postIdSchema } from "../../schemas";
import { POSTS_LIST_TAG, postTag } from "../cache-tags";

export async function deletePost({
  input,
  userId,
}: {
  input: unknown;
  userId: string;
}): Promise<void> {
  const postId = parseOrThrow({ schema: postIdSchema, input });

  const existing = await db.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (!existing) return;
  if (existing.authorId !== userId) {
    throw new ForbiddenError("You can only delete your own posts.");
  }

  const post = await db.post
    .delete({ where: { id: postId }, select: { imageUrl: true } })
    .catch((error) => {
      // P2025: record not found (deleted since the check). Rethrow real failures.
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
