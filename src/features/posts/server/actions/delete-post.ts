"use server";

import { redirect } from "next/navigation";
import { deletePost } from "../mutations/delete-post";

export async function deletePostAction(postId: number): Promise<void> {
  await deletePost(postId);
  redirect("/");
}
