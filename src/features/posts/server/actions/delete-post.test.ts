import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`redirect:${url}`);
  }),
}));
vi.mock("@/server/auth", () => ({ getSession: vi.fn() }));
vi.mock("../mutations/delete-post", () => ({ deletePost: vi.fn() }));

import { getSession } from "@/server/auth";
import { deletePost } from "../mutations/delete-post";
import { deletePostAction } from "./delete-post";

beforeEach(() => vi.clearAllMocks());

describe("deletePostAction", () => {
  test("redirects to sign-in without deleting when signed out", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    await expect(deletePostAction(1)).rejects.toThrow("redirect:/sign-in");
    expect(deletePost).not.toHaveBeenCalled();
  });

  test("deletes as the signed-in user, then redirects to home page", async () => {
    vi.mocked(getSession).mockResolvedValue({
      user: { id: "test-user-1" },
    } as never);

    await expect(deletePostAction(1)).rejects.toThrow("redirect:/");
    expect(deletePost).toHaveBeenCalledWith({
      input: 1,
      userId: "test-user-1",
    });
  });
});
