import type { PostWithAuthor } from "../types";
import { PostCard } from "./post-card";

export function PostList({ posts }: { posts: PostWithAuthor[] }) {
  if (posts.length === 0) {
    return <p className="mt-6 text-gray-600 dark:text-gray-400">No posts yet.</p>;
  }

  return (
    <ul className="mt-6 space-y-4">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
