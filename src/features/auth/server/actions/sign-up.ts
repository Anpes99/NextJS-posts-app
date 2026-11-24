"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ValidationError } from "@/server/errors";
import { parseOrThrow } from "@/server/validation";
import { signUpSchema } from "../../schemas";

type SignUpState = {
  errors: Record<string, string[] | undefined>;
  values: { name: string; email: string };
} | null;

const EMAIL_TAKEN_CODES = new Set([
  "USER_ALREADY_EXISTS",
  "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
]);

export async function signUpAction(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  try {
    const body = parseOrThrow({
      schema: signUpSchema,
      input: Object.fromEntries(formData),
    });
    // Also signs the new user in (Better Auth's autoSignIn default).
    await auth.api.signUpEmail({ body, headers: await headers() });
  } catch (error) {
    if (error instanceof ValidationError) {
      return { values, errors: error.fieldErrors };
    }
    if (isAPIError(error) && EMAIL_TAKEN_CODES.has(error.body?.code ?? "")) {
      return {
        values,
        errors: { email: ["An account with this email already exists."] },
      };
    }
    throw error;
  }

  redirect("/");
}
