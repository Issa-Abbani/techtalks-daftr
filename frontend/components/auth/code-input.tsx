import { useId, useRef, type KeyboardEvent } from "react";
import { CircleAlert } from "lucide-react";

export const CODE_LENGTH = 6;

type CodeInputProps = {
  legend: string;
  /** Screen reader name for each box, e.g. "Digit 1 of 6". */
  digitLabels: string[];
  /** The digits typed so far, with no gaps (up to six). */
  value: string;
  onChange: (value: string) => void;
  /** Called when the sixth digit arrives. */
  onComplete?: (value: string) => void;
  error?: string;
};

// Ledger CodeInput: six boxes for the email code. Typing moves forward, Backspace on an
// empty box moves back, arrows move between boxes, and a pasted or autofilled code fills
// every box. Only used inside client forms, so it runs on the client through their import.
export function CodeInput({ legend, digitLabels, value, onChange, onComplete, error }: CodeInputProps) {
  const errorId = useId();
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  function focusBox(index: number) {
    boxes.current[Math.min(Math.max(index, 0), CODE_LENGTH - 1)]?.focus();
  }

  function update(next: string, focusIndex: number) {
    const code = next.slice(0, CODE_LENGTH);
    onChange(code);
    focusBox(Math.min(focusIndex, code.length));
    if (code.length === CODE_LENGTH && value.length < CODE_LENGTH) onComplete?.(code);
  }

  // Puts digits into the code starting at `index`. An empty string clears that box.
  function put(index: number, digits: string) {
    if (digits.length >= CODE_LENGTH) {
      update(digits, CODE_LENGTH); // a whole code fills every box, from any box
      return;
    }
    const rest = value.slice(index + Math.max(digits.length, 1));
    update(value.slice(0, index) + digits + rest, index + digits.length);
  }

  function handleChange(index: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (raw && !digits) return; // letters and symbols are ignored
    const old = value[index];
    // Typing next to a digit that is already in the box leaves two; keep the new one.
    put(index, old && digits.length === 2 ? digits.replace(old, "") : digits);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      event.preventDefault();
      put(index - 1, "");
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink">{legend}</legend>
      {/* Codes read left to right in every language. */}
      <div dir="ltr" className="grid grid-cols-6 gap-2">
        {digitLabels.slice(0, CODE_LENGTH).map((label, index) => (
          <input
            key={label}
            ref={(element) => {
              boxes.current[index] = element;
            }}
            value={value[index] ?? ""}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={label}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onFocus={(event) => event.target.select()}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => {
              event.preventDefault();
              const digits = event.clipboardData.getData("text").replace(/\D/g, "");
              if (digits) put(index, digits);
            }}
            className="h-14 w-full min-w-0 rounded-[8px] border border-border-strong bg-surface text-center text-[26px] font-semibold tabular-nums text-ink caret-primary hover:border-ink focus-visible:border-primary aria-invalid:border-2 aria-invalid:border-danger-solid"
          />
        ))}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 flex items-start gap-2 text-sm font-medium text-danger-solid">
          <CircleAlert className="mt-px size-[18px] shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
