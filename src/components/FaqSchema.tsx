import { FAQS_BY_LOCALE } from "./FaqSection";
import type { Locale } from "../lib/i18n";

export default function FaqSchema({ locale = "en" as Locale }: { locale?: Locale }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS_BY_LOCALE[locale].map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a.replace(/<[^>]*>/g, ""),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
