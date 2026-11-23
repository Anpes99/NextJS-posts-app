import { PostDetailSkeleton } from "@/features/posts/components/post-detail";
import { PostModal } from "@/features/posts/components/post-modal";

export default function Loading() {
  return (
    <PostModal>
      <PostDetailSkeleton />
    </PostModal>
  );
}
