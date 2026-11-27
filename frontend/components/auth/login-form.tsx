"use client";

import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";

import { TextField } from "@/components/auth/text-field";
import { TextLink } from "@/components/auth/text-link";
import { isEmail } from "@/components/auth/validation";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n-config";

type LoginFormStrings = {
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  showPassword: string;
  hidePassword: string;
  submit: string;
  forgotPassword: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
};

type Field = "email" | "password";
type Errors = Partial<Record<Field, string>>;

function validate(field: Field, value: string, strings: LoginFormStrings) {
  if (field === "email") {
    const email = value.trim();
    if (!email) return strings.emailRequired;
    if (!isEmail(email)) return strings.emailInvalid;
    return undefined;
  }
  // Log in only checks that a password was typed; the length rule belongs to sign up.
  return value ? undefined : strings.passwordRequired;
}

export function LoginForm({ lang, strings }: { lang: Locale; strings: LoginFormStrings }) {
  const [errors, setErrors] = useState<Errors>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleBlur(field: Field, value: string) {
    // Empty fields are flagged on submit, so tabbing or tapping past a field doesn't nag.
    if (!value.trim()) return;
    setErrors((current) => ({ ...current, [field]: validate(field, value, strings) }));
  }

  function clearError(field: Field) {
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // method="post" keeps the password out of the URL if the form is sent before this code loads.
    event.preventDefault();

    const next: Errors = {
      email: validate("email", emailRef.current?.value ?? "", strings),
      password: validate("password", passwordRef.current?.value ?? "", strings),
    };
    // Render the errors first, so a screen reader hears the message when focus lands on the field.
    flushSync(() => setErrors(next));
    if (next.email) emailRef.current?.focus();
    else if (next.password) passwordRef.current?.focus();

    // Auth integration is pending (Clerk, NJTH-12): a valid submit does nothing yet.
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
        error={errors.email}
        onBlur={(event) => handleBlur("email", event.target.value)}
        onChange={() => clearError("email")}
      />
      <TextField
        ref={passwordRef}
        label={strings.passwordLabel}
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder={strings.passwordPlaceholder}
        toggleLabels={{ show: strings.showPassword, hide: strings.hidePassword }}
        error={errors.password}
        onBlur={(event) => handleBlur("password", event.target.value)}
        onChange={() => clearError("password")}
      />
      <TextLink href={`/${lang}/forgot-password`} className="self-start">
        {strings.forgotPassword}
      </TextLink>
      <Button
        type="submit"
        className="h-13 w-full rounded-[8px] px-6 text-base font-semibold focus-visible:outline-solid focus-visible:ring-0"
      >
        {strings.submit}
      </Button>
    </form>
  );
}
