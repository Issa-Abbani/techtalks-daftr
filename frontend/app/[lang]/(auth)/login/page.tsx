import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { TextLink } from "@/components/auth/text-link";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/i18n-config";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/login">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.auth.login.metaTitle,
    // Replaces the root layout's links, which point at the home pages.
    alternates: { languages: { en: "/en/login", ar: "/ar/login" } },
  };
}

export default async function LoginPage({ params }: PageProps<"/[lang]/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { fields, errors, login } = getDictionary(lang).auth;

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">{login.heading}</h1>
        <p className="text-base text-muted-foreground">{login.subheading}</p>
      </div>
      <LoginForm
        lang={lang}
        strings={{
          ...fields,
          emailRequired: errors.emailRequired,
          emailInvalid: errors.emailInvalid,
          passwordRequired: errors.passwordRequired,
          passwordPlaceholder: login.passwordPlaceholder,
          submit: login.submit,
          forgotPassword: login.forgotPassword,
        }}
      />
      <div className="flex flex-col items-start">
        <p className="text-base text-muted-foreground">{login.signupPrompt}</p>
        <TextLink href={`/${lang}/signup`}>{login.signupLink}</TextLink>
      </div>
    </>
  );
}
