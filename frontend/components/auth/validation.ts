// Shared by the log in and sign up forms, so both accept the same email addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}
