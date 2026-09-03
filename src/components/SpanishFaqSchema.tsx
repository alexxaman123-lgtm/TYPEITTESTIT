import { SPANISH_FAQS } from "./SpanishFaqSection";

export default function SpanishFaqSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SPANISH_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />;
}
