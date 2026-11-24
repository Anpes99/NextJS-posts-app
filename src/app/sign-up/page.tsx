import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = { title: "Sign up · Posts App" };

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-sm p-8">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <SignUpForm />
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
