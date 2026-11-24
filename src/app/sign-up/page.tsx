import type { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = { title: "Sign up · Posts App" };

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-sm p-8">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <SignUpForm />
    </main>
  );
}
