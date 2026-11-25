import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/server/auth", () => ({ getSession: vi.fn() }));
vi.mock("../mutations/update-post", () => ({ updatePost: vi.fn() }));

import { getSession } from "@/server/auth";
import { updatePost } from "../mutations/update-post";
import { updatePostAction } from "./update-post";

const session = { user: { id: "test-user-1" } };

function formData() {
  const data = new FormData();
  data.set("postId", "1");
  data.set("text", "New text");
  return data;
}

beforeEach(() => vi.clearAllMocks());

describe("updatePostAction", () => {
  test("requires a signed-in user", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    await expect(updatePostAction(formData())).resolves.toEqual({
      ok: false,
      errors: {},
      formError: "Sign in to edit posts.",
    });
    expect(updatePost).not.toHaveBeenCalled();
  });

  test("passes the update post data and the signed-in user's id to the mutation", async () => {
    vi.mocked(getSession).mockResolvedValue(session as never);
    vi.mocked(updatePost).mockResolvedValue({ id: 1 } as never);

    await expect(updatePostAction(formData())).resolves.toEqual({ ok: true });
    expect(updatePost).toHaveBeenCalledWith({
      input: { postId: "1", text: "New text" },
      userId: "test-user-1",
    });
  });
});
