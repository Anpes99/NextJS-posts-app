import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("next/cache", () => ({ updateTag: vi.fn() }));
vi.mock("@/server/db", () => ({
  db: { post: { findUnique: vi.fn(), updateManyAndReturn: vi.fn() } },
}));

import { updateTag } from "next/cache";
import { db } from "@/server/db";
import { ForbiddenError, ValidationError } from "@/server/errors";
import { POSTS_LIST_TAG, postTag } from "../cache-tags";
import { updatePost } from "./update-post";

const mockDb = vi.mocked(db, true);

const post = {
  id: 1,
  title: "Title",
  text: "Original",
  imageUrl: null,
  createdAt: new Date(),
  authorId: "test-user-1",
};

beforeEach(() => vi.clearAllMocks());

describe("updatePost", () => {
  test("rejects edits by someone other than the author", async () => {
    mockDb.post.findUnique.mockResolvedValue({
      authorId: "test-user-1",
    } as never);

    await expect(
      updatePost({
        input: { postId: "1", text: "new text1" },
        userId: "test-user-2",
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);

    expect(mockDb.post.updateManyAndReturn).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  test("returns null when the post does not exist", async () => {
    mockDb.post.findUnique.mockResolvedValue(null);

    await expect(
      updatePost({
        input: { postId: "1", text: "new text1" },
        userId: "test-user-1",
      }),
    ).resolves.toBeNull();

    expect(mockDb.post.updateManyAndReturn).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  test("lets the author edit and invalidates the post and list caches", async () => {
    const updatedPost = { ...post, text: "Updated" };
    mockDb.post.findUnique.mockResolvedValue({
      authorId: "test-user-1",
    } as never);
    mockDb.post.updateManyAndReturn.mockResolvedValue([updatedPost]);

    await expect(
      updatePost({
        input: { postId: "1", text: "  Updated  " },
        userId: "test-user-1",
      }),
    ).resolves.toEqual(updatedPost);

    expect(mockDb.post.updateManyAndReturn).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { text: "Updated" },
    });
    expect(updateTag).toHaveBeenCalledWith(postTag({ postId: 1 }));
    expect(updateTag).toHaveBeenCalledWith(POSTS_LIST_TAG);
  });

  test("throws ValidationError for invalid input", async () => {
    await expect(
      updatePost({
        input: { postId: "1", text: "   " },
        userId: "test-user-1",
      }),
    ).rejects.toBeInstanceOf(ValidationError);

    expect(mockDb.post.findUnique).not.toHaveBeenCalled();
  });
});
