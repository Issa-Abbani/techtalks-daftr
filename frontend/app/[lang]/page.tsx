import { notFound } from "next/navigation";

import { About } from "@/components/home/about";
import { BusinessTypes } from "@/components/home/business-types";
import { Contact } from "@/components/home/contact";
import { Features } from "@/components/home/features";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Navbar } from "@/components/home/navbar";
import { Pricing } from "@/components/home/pricing";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { getDictionary } from "@/lib/i18n";
import { hasLocale } from "@/lib/i18n-config";

/**
 * The homepage, at /en and /ar.
 *
 * It loads the text for the current language (the "dictionary") and hands it to
 * each section, top to bottom in the order they appear on the page.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <Navbar dict={dict} lang={lang} />

      <main className="flex-1">
        <Hero dict={dict} />
        <BusinessTypes dict={dict} />
        <Features dict={dict} />
        <HowItWorks dict={dict} />
        <Pricing dict={dict} />
        <About dict={dict} />
        <Contact dict={dict} />
      </main>

      <Footer dict={dict} lang={lang} />

      {/* Turns on the fade-in animations for every element marked `data-reveal`. */}
      <ScrollReveal />
    </>
  );
}
