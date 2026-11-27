import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { TextLink } from "@/components/auth/text-link";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/i18n-config";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/forgot-password">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.auth.resetPassword.metaTitle,
    // Replaces the root layout's links, which point at the home pages.
    alternates: { languages: { en: "/en/forgot-password", ar: "/ar/forgot-password" } },
  };
}

export default async function ForgotPasswordPage({ params }: PageProps<"/[lang]/forgot-password">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { fields, errors, resetPassword } = getDictionary(lang).auth;

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">{resetPassword.heading}</h1>
        <p className="text-base text-muted-foreground">{resetPassword.subheading}</p>
      </div>
      <ResetPasswordForm
        strings={{
          emailLabel: fields.emailLabel,
          emailPlaceholder: fields.emailPlaceholder,
          submit: resetPassword.submit,
          emailRequired: errors.emailRequired,
          emailInvalid: errors.emailInvalid,
        }}
      />
      <TextLink href={`/${lang}/login`} className="self-start">
        {resetPassword.backToLogin}
      </TextLink>
    </>
  );
}
