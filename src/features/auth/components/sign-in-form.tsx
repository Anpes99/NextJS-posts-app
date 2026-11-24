"use client";

import { useActionState } from "react";
import { signInAction } from "../server/actions/sign-in";
import { FormField } from "./form-field";

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signInAction, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state?.values.email}
        errors={state?.errors?.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        errors={state?.errors?.password}
      />

      {state?.formError && (
        <p role="alert" className="text-sm text-red-600">
          {state.formError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
