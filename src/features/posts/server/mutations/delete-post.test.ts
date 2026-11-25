import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("next/cache", () => ({ updateTag: vi.fn() }));
vi.mock("@/server/db", () => ({
  db: { post: { findUnique: vi.fn(), delete: vi.fn() } },
}));
vi.mock("@/server/uploads", () => ({ deleteImage: vi.fn() }));

import { updateTag } from "next/cache";
import { db } from "@/server/db";
import { ForbiddenError } from "@/server/errors";
import { deleteImage } from "@/server/uploads";
import { POSTS_LIST_TAG, postTag } from "../cache-tags";
import { deletePost } from "./delete-post";

const mockDb = vi.mocked(db, true);

beforeEach(() => vi.clearAllMocks());

describe("deletePost", () => {
  test("rejects deletes by someone other than the author", async () => {
    mockDb.post.findUnique.mockResolvedValue({
      authorId: "test-user-1",
    } as never);

    await expect(
      deletePost({ input: 1, userId: "test-user-2" }),
    ).rejects.toBeInstanceOf(ForbiddenError);

    expect(mockDb.post.delete).not.toHaveBeenCalled();
    expect(deleteImage).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  test("does nothing when the post does not exist", async () => {
    mockDb.post.findUnique.mockResolvedValue(null);

    await expect(
      deletePost({ input: 1, userId: "test-user-1" }),
    ).resolves.toBeUndefined();

    expect(mockDb.post.delete).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  test("lets the author delete, removes the image and invalidates caches", async () => {
    mockDb.post.findUnique.mockResolvedValue({
      authorId: "test-user-1",
    } as never);
    mockDb.post.delete.mockResolvedValue({
      imageUrl: "/uploads/abc.png",
    } as never);

    await deletePost({ input: 1, userId: "test-user-1" });

    expect(mockDb.post.delete).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { imageUrl: true },
    });
    expect(deleteImage).toHaveBeenCalledWith({ url: "/uploads/abc.png" });
    expect(updateTag).toHaveBeenCalledWith(postTag({ postId: 1 }));
    expect(updateTag).toHaveBeenCalledWith(POSTS_LIST_TAG);
  });
});
