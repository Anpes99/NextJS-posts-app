import Link from "next/link";
import type { PostWithAuthor } from "../types";

export function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      scroll={false}
      className="block rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
    >
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="mt-0.5 text-sm text-gray-500">by {post.author.name}</p>
      <p className="mt-1 text-gray-600 dark:text-gray-400">{post.text}</p>
    </Link>
  );
}
