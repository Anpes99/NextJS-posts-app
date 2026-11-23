import { PostDetail } from "@/features/posts/components/post-detail";
import { PostModal } from "@/features/posts/components/post-modal";

// Intercepts /posts/[id] on client navigation from the feed and shows it as a
// modal over the feed. Direct visits and reloads render app/posts/[id] instead.
export default async function Page({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  return (
    <PostModal fullPageHref={`/posts/${id}`}>
      <PostDetail postId={id} />
    </PostModal>
  );
}
