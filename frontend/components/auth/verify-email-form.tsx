"use client";

import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";

import { CODE_LENGTH, CodeInput } from "@/components/auth/code-input";
import { Button } from "@/components/ui/button";

type VerifyEmailFormStrings = {
  codeLabel: string;
  digitLabels: string[];
  submit: string;
  codeIncomplete: string;
};

export function VerifyEmailForm({ strings }: { strings: VerifyEmailFormStrings }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const codeRef = useRef<HTMLDivElement>(null);

  function verify(value: string) {
    if (value.length < CODE_LENGTH) {
      // Render the error first, so a screen reader hears it when focus lands on the box.
      flushSync(() => setError(strings.codeIncomplete));
      codeRef.current?.querySelectorAll("input")[value.length]?.focus(); // first empty box
      return;
    }
    // Checking the code is pending (Clerk, NJTH-12): a full code does nothing yet.
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    verify(code);
  }

  return (
    <form method="post" noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div ref={codeRef}>
        <CodeInput
          legend={strings.codeLabel}
          digitLabels={strings.digitLabels}
          value={code}
          onChange={(value) => {
            setCode(value);
            setError(undefined);
          }}
          // Ledger: the code is checked as soon as the sixth digit arrives.
          onComplete={verify}
          error={error}
        />
      </div>
      <Button
        type="submit"
        className="h-13 w-full rounded-[8px] px-6 text-base font-semibold focus-visible:outline-solid focus-visible:ring-0"
      >
        {strings.submit}
      </Button>
    </form>
  );
}
