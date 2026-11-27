"use client";

import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";

import { TextField } from "@/components/auth/text-field";
import { isEmail } from "@/components/auth/validation";
import { Button } from "@/components/ui/button";

type SignupFormStrings = {
  businessNameLabel: string;
  businessNameHint: string;
  businessNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordHint: string;
  showPassword: string;
  hidePassword: string;
  submit: string;
  businessNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordTooShort: string;
};

// "organizationName" is the field key in code; owners see "Business name".
type Field = "organizationName" | "email" | "password";
type Errors = Partial<Record<Field, string>>;

// In screen order, so the first invalid field gets focus.
const FIELDS: Field[] = ["organizationName", "email", "password"];

// Placeholder rule from the Ledger copy until the team sets the real password policy.
// If it changes, change the hint and the "too short" message in both locale files too.
const MIN_PASSWORD_LENGTH = 8;

function validate(field: Field, value: string, strings: SignupFormStrings) {
  if (field === "organizationName") {
    return value.trim() ? undefined : strings.businessNameRequired;
  }
  if (field === "email") {
    const email = value.trim();
    if (!email) return strings.emailRequired;
    if (!isEmail(email)) return strings.emailInvalid;
    return undefined;
  }
  if (!value) return strings.passwordRequired;
  if (value.length < MIN_PASSWORD_LENGTH) return strings.passwordTooShort;
  return undefined;
}

export function SignupForm({ strings }: { strings: SignupFormStrings }) {
  const [errors, setErrors] = useState<Errors>({});
  const organizationNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const refs = { organizationName: organizationNameRef, email: emailRef, password: passwordRef };

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

    const next: Errors = {};
    for (const field of FIELDS) {
      next[field] = validate(field, refs[field].current?.value ?? "", strings);
    }
    // Render the errors first, so a screen reader hears the message when focus lands on the field.
    flushSync(() => setErrors(next));
    const firstInvalid = FIELDS.find((field) => next[field]);
    if (firstInvalid) refs[firstInvalid].current?.focus();

    // Account creation is pending (Clerk, NJTH-12): a valid submit does nothing yet.
  }

  return (
    <form method="post" noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField
        ref={organizationNameRef}
        label={strings.businessNameLabel}
        name="organizationName"
        autoComplete="organization"
        placeholder={strings.businessNamePlaceholder}
        hint={strings.businessNameHint}
        error={errors.organizationName}
        onBlur={(event) => handleBlur("organizationName", event.target.value)}
        onChange={() => clearError("organizationName")}
      />
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
        autoComplete="new-password"
        hint={strings.passwordHint}
        toggleLabels={{ show: strings.showPassword, hide: strings.hidePassword }}
        error={errors.password}
        onBlur={(event) => handleBlur("password", event.target.value)}
        onChange={() => clearError("password")}
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
