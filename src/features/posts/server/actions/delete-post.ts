"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { deletePost } from "../mutations/delete-post";

export async function deletePostAction(postId: number): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  await deletePost({ input: postId, userId: session.user.id });
  redirect("/");
}
