import Link from "next/link";
import { Suspense } from "react";
import { UserMenu } from "@/features/auth/components/user-menu";

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-8">
        <Link href="/" className="font-semibold">
          Posts App
        </Link>
        <Suspense fallback={null}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}
