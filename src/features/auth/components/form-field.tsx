import type { ComponentProps } from "react";

const inputClass =
  "mt-1 w-full rounded border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700";

export function FormField({
  label,
  errors,
  ...inputProps
}: { label: string; errors?: string[] } & ComponentProps<"input">) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        className={inputClass}
        aria-invalid={errors?.length ? true : undefined}
        {...inputProps}
      />
      {errors?.[0] && <p className="mt-1 text-sm text-red-600">{errors[0]}</p>}
    </label>
  );
}
