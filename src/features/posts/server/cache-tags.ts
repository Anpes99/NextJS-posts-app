/** Tag for paginated post lists. Invalidate when posts are created or deleted. */
export const POSTS_LIST_TAG = "posts:list";

/** Tag for a single post. Invalidate when that post is updated or deleted. */
export const postTag = ({ postId }: { postId: number }) => `post:${postId}`;
