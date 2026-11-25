import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/server/auth", () => ({ getSession: vi.fn() }));
vi.mock("@/server/rate-limit", () => ({
  getClientIp: vi.fn(),
  rateLimit: vi.fn(),
}));
vi.mock("../mutations/create-post", () => ({ createPost: vi.fn() }));

import { getSession } from "@/server/auth";
import { ValidationError } from "@/server/errors";
import { rateLimit } from "@/server/rate-limit";
import { createPost } from "../mutations/create-post";
import { createPostAction } from "./create-post";

const session = { user: { id: "test-user-1" } };

function formData() {
  const data = new FormData();
  data.set("title", "Title1");
  data.set("text", "Text1");
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(rateLimit).mockReturnValue(true);
});

describe("createPostAction", () => {
  test("requires a signed-in user", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    await expect(createPostAction(formData())).resolves.toEqual({
      ok: false,
      errors: {},
      formError: "Sign in to create a post.",
    });
    expect(createPost).not.toHaveBeenCalled();
  });

  test("blocks the request once the rate limit is hit", async () => {
    vi.mocked(getSession).mockResolvedValue(session as never);
    vi.mocked(rateLimit).mockReturnValue(false);

    await expect(createPostAction(formData())).resolves.toMatchObject({
      ok: false,
      formError: "Too many posts. Try again in a few minutes.",
    });
    expect(createPost).not.toHaveBeenCalled();
  });

  test("creates the post as the signed-in user", async () => {
    vi.mocked(getSession).mockResolvedValue(session as never);

    await expect(createPostAction(formData())).resolves.toEqual({ ok: true });
    expect(createPost).toHaveBeenCalledWith({
      input: { title: "Title1", text: "Text1" },
      authorId: "test-user-1",
    });
  });

  test("returns field errors when validation fails", async () => {
    vi.mocked(getSession).mockResolvedValue(session as never);
    vi.mocked(createPost).mockRejectedValue(
      new ValidationError({ title: ["Title is required"] }),
    );

    await expect(createPostAction(formData())).resolves.toEqual({
      ok: false,
      errors: { title: ["Title is required"] },
    });
  });
});
