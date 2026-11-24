"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ValidationError } from "@/server/errors";
import { parseOrThrow } from "@/server/validation";
import { signInSchema } from "../../schemas";

type SignInState = {
  values: { email: string };
  errors?: Record<string, string[] | undefined>;
  formError?: string;
} | null;

export async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const values = { email: String(formData.get("email") ?? "") };

  try {
    const body = parseOrThrow({
      schema: signInSchema,
      input: Object.fromEntries(formData),
    });
    await auth.api.signInEmail({ body, headers: await headers() });
  } catch (error) {
    if (error instanceof ValidationError) {
      return { values, errors: error.fieldErrors };
    }
    if (isAPIError(error) && error.body?.code === "INVALID_EMAIL_OR_PASSWORD") {
      return { values, formError: "Invalid email or password." };
    }
    throw error;
  }

  redirect("/");
}
