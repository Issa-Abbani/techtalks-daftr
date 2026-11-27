import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SignupForm } from "@/components/auth/signup-form";
import { TextLink } from "@/components/auth/text-link";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/i18n-config";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/signup">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.auth.signup.metaTitle,
    // Replaces the root layout's links, which point at the home pages.
    alternates: { languages: { en: "/en/signup", ar: "/ar/signup" } },
  };
}

export default async function SignupPage({ params }: PageProps<"/[lang]/signup">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { fields, errors, signup } = getDictionary(lang).auth;

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">{signup.heading}</h1>
        <p className="text-base text-muted-foreground">{signup.subheading}</p>
      </div>
      <SignupForm
        strings={{
          ...fields,
          ...errors,
          businessNameLabel: signup.businessNameLabel,
          businessNameHint: signup.businessNameHint,
          businessNamePlaceholder: signup.businessNamePlaceholder,
          passwordHint: signup.passwordHint,
          submit: signup.submit,
        }}
      />
      <div className="flex flex-col items-start">
        <p className="text-base text-muted-foreground">{signup.loginPrompt}</p>
        <TextLink href={`/${lang}/login`}>{signup.loginLink}</TextLink>
      </div>
    </>
  );
}
