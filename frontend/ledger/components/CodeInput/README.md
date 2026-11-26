# CodeInput

Six separate boxes for the email verification code. Large, numeric, paste-friendly.

**Look.** Six equal boxes in a grid with `space-2` gaps (about 50 × 56px each at 390px), `surface` fill, 1px `border-strong`, `radius-control`, digits at 26px semibold with tabular figures. Focus: `primary` border + focus ring. Error: every box gets the 2px `danger-solid` edge and one message below the row.

**Behaviour.**
- Typing a digit moves to the next box; Backspace on an empty box moves back and clears it; Left/Right arrows move between boxes.
- Pasting or autofilling six digits fills all boxes, from any box.
- Non-digits are ignored.
- When the sixth digit arrives, submit automatically and show the Verify email button in its loading state. Keep the button for people who prefer to tap.
- On a wrong code, keep the digits, show the error, and select the first box so the owner can retype.
- "Send a new code" is disabled for 30 seconds after sending, showing "Send a new code in 0:27".

**What you provide.** `value` (string of up to 6 digits), `onChange`, `onComplete`, optional `error`, `disabled`.

**Accessibility.** A `<fieldset>` with `<legend>Verification code</legend>`; each box `aria-label="Digit n of 6"`, `inputMode="numeric"`, `pattern="[0-9]*"`, `maxLength={1}`; the first box `autoComplete="one-time-code"`. The row is `dir="ltr"` in every language.

| Do | Don't |
|---|---|
| Accept paste of the whole code | Force typing digit by digit |
| Say where the code went: "…sent to hello@buzzybeans.com" | "Enter the OTP" |
| Tell people to check spam | Expire codes in under 10 minutes |

**Build it**

```tsx
"use client";
import { useRef } from "react";

export function CodeInput({ value, onChange, onComplete, invalid }: {
  value: string; onChange: (v: string) => void; onComplete?: (v: string) => void; invalid?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (next: string) => {
    const v = next.replace(/\D/g, "").slice(0, 6);
    onChange(v);
    refs.current[Math.min(v.length, 5)]?.focus();
    if (v.length === 6) onComplete?.(v);
  };
  return (
    <div dir="ltr" className="grid grid-cols-6 gap-2">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={value[i] ?? ""}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1} of 6`}
          aria-invalid={invalid || undefined}
          onChange={(e) => set(value.slice(0, i) + e.target.value + value.slice(i + 1))}
          onPaste={(e) => { e.preventDefault(); set(e.clipboardData.getData("text")); }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) { refs.current[i - 1]?.focus(); onChange(value.slice(0, i - 1)); }
            if (e.key === "ArrowLeft") refs.current[i - 1]?.focus();
            if (e.key === "ArrowRight") refs.current[i + 1]?.focus();
          }}
          className="h-14 w-full rounded-control border border-border-strong bg-surface text-center text-[26px] font-semibold tabular-nums text-ink caret-primary focus-visible:border-primary aria-invalid:border-danger-solid aria-invalid:ring-1 aria-invalid:ring-inset aria-invalid:ring-danger-solid"
        />
      ))}
    </div>
  );
}
```
