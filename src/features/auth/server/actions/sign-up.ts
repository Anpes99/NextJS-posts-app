"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ValidationError } from "@/server/errors";
import { getClientIp, rateLimit } from "@/server/rate-limit";
import { parseOrThrow } from "@/server/validation";
import { signUpSchema } from "../../schemas";

type SignUpState = {
  values: { name: string; email: string };
  errors?: Record<string, string[] | undefined>;
  formError?: string;
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

  const ip = await getClientIp();
  if (!rateLimit({ key: `sign-up:${ip}`, limit: 5, windowMs: 60 * 60_000 })) {
    return { values, formError: "Too many sign-ups. Try again later." };
  }

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
