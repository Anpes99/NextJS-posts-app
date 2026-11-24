import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = { title: "Sign in · Posts App" };

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-sm p-8">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <SignInForm />
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        No account?{" "}
        <Link href="/sign-up" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
