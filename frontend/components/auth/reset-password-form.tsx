"use client";

import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";

import { TextField } from "@/components/auth/text-field";
import { isEmail } from "@/components/auth/validation";
import { Button } from "@/components/ui/button";

type ResetPasswordFormStrings = {
  emailLabel: string;
  emailPlaceholder: string;
  submit: string;
  emailRequired: string;
  emailInvalid: string;
};

function validateEmail(value: string, strings: ResetPasswordFormStrings) {
  const email = value.trim();
  if (!email) return strings.emailRequired;
  if (!isEmail(email)) return strings.emailInvalid;
  return undefined;
}

export function ResetPasswordForm({ strings }: { strings: ResetPasswordFormStrings }) {
  const [error, setError] = useState<string>();
  const emailRef = useRef<HTMLInputElement>(null);

  function handleBlur(value: string) {
    // Empty fields are flagged on submit, so tabbing or tapping past the field doesn't nag.
    if (!value.trim()) return;
    setError(validateEmail(value, strings));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validateEmail(emailRef.current?.value ?? "", strings);
    // Render the error first, so a screen reader hears the message when focus lands on the field.
    flushSync(() => setError(next));
    if (next) emailRef.current?.focus();

    // Sending the reset email is pending (Clerk, NJTH-12): a valid submit does nothing yet.
  }

  return (
    <form method="post" noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        ref={emailRef}
        label={strings.emailLabel}
        type="email"
        name="email"
        inputMode="email"
        autoComplete="email"
        placeholder={strings.emailPlaceholder}
        error={error}
        onBlur={(event) => handleBlur(event.target.value)}
        onChange={() => setError(undefined)}
      />
      <Button
        type="submit"
        className="h-13 w-full rounded-[8px] px-6 text-base font-semibold focus-visible:outline-solid focus-visible:ring-0"
      >
        {strings.submit}
      </Button>
    </form>
  );
}
