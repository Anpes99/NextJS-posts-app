"use client";

import { ErrorFallback } from "@/components/error-fallback";
import { PostModal } from "@/features/posts/components/post-modal";

export default function Error(props: { error: unknown; retry: () => void }) {
  return (
    <PostModal>
      <ErrorFallback {...props} />
    </PostModal>
  );
}
