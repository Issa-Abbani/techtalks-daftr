import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { textLinkClassName } from "@/components/auth/text-link";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/i18n-config";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/verify-email">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.auth.verifyEmail.metaTitle,
    // Replaces the root layout's links, which point at the home pages.
    alternates: { languages: { en: "/en/verify-email", ar: "/ar/verify-email" } },
  };
}

export default async function VerifyEmailPage({ params }: PageProps<"/[lang]/verify-email">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { errors, verifyEmail } = getDictionary(lang).auth;

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">{verifyEmail.heading}</h1>
        <p className="text-base text-muted-foreground">{verifyEmail.subheading}</p>
      </div>
      <VerifyEmailForm
        strings={{
          codeLabel: verifyEmail.codeLabel,
          digitLabels: verifyEmail.digitLabels,
          submit: verifyEmail.submit,
          codeIncomplete: errors.codeIncomplete,
        }}
      />
      <div className="flex flex-col items-start">
        <p className="text-base text-muted-foreground">{verifyEmail.resendPrompt}</p>
        {/* Sending a new code is pending (Clerk, NJTH-12), so this button does nothing yet. */}
        <button type="button" className={textLinkClassName}>
          {verifyEmail.resendButton}
        </button>
      </div>
    </>
  );
}
