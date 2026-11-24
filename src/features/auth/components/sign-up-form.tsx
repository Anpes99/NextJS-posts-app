"use client";

import { useActionState } from "react";
import { signUpAction } from "../server/actions/sign-up";
import { FormField } from "./form-field";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <FormField
        label="Name"
        name="name"
        autoComplete="name"
        required
        minLength={3}
        maxLength={50}
        defaultValue={state?.values?.name}
        errors={state?.errors?.name}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state?.values?.email}
        errors={state?.errors?.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={128}
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
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
