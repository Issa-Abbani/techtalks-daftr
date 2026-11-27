import { notFound } from "next/navigation";

import { Logo } from "@/components/home/logo";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/i18n-config";

// Shared frame for the auth pages (Ledger PageLayout, single-form pages):
// logo at the top start, then one 400px column that becomes a bordered card from 640px.
// <html> and <body> come from the root layout in app/[lang]/layout.tsx.
export default async function AuthLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="min-h-dvh bg-canvas px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-[400px] flex-col gap-12">
        <Logo name={dict.brand} href={`/${lang}`} className="self-start" />
        <main className="flex flex-col gap-6 sm:rounded-lg sm:border sm:border-border sm:bg-surface sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
