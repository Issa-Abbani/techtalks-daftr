import { useId, useState, type ComponentProps } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

type TextFieldProps = Omit<ComponentProps<"input">, "id" | "type"> & {
  label: string;
  type?: "text" | "email" | "password";
  /** Help text below the input, such as a password rule. An error replaces it. */
  hint?: string;
  /** Message shown below the input; also marks the input as invalid. */
  error?: string;
  /** Words on the Show/Hide button. Required when `type` is "password". */
  toggleLabels?: { show: string; hide: string };
};

// Ledger TextField: visible label, 52px input, hint or error below.
// Only used inside client forms, so it runs on the client through their import.
export function TextField({
  label,
  type = "text",
  hint,
  error,
  toggleLabels,
  className,
  ...inputProps
}: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isEmailField = type === "email";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          // Emails are typed left to right, even on the Arabic page.
          dir={isEmailField ? "ltr" : undefined}
          {...inputProps}
          id={id}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-13 w-full rounded-[8px] border border-border-strong bg-surface px-4 text-base text-ink placeholder:text-muted-foreground hover:border-ink focus-visible:border-primary aria-invalid:border-2 aria-invalid:border-danger-solid",
            isPassword && "pe-26",
            // Inside a dir="rtl" page this lines the email up with its label on the right.
            isEmailField && "rtl:text-end",
            className
          )}
        />
        {isPassword && toggleLabels ? (
          <button
            type="button"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((shown) => !shown)}
            className="absolute end-1 top-1/2 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center gap-1.5 rounded-[8px] px-3 text-sm font-medium text-primary hover:bg-primary-soft"
          >
            {showPassword ? (
              <EyeOff className="size-5" aria-hidden />
            ) : (
              <Eye className="size-5" aria-hidden />
            )}
            {showPassword ? toggleLabels.hide : toggleLabels.show}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="flex items-start gap-2 text-sm font-medium text-danger-solid">
          <CircleAlert className="mt-px size-[18px] shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
