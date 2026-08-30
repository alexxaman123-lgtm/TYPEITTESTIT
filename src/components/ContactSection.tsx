import { Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border border-white/10 bg-surface1/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Contact Us
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          We&apos;d love to hear from you
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          Have a question, suggestion, or any query about TYPEITTESTIT? Please reach out to us and
          we&apos;ll do our best to help. Whether you have feedback about the typing test or need
          assistance, you can contact us using the email address below.
        </p>

        <a
          href="mailto:typeittestit@gmail.com"
          className="mt-8 inline-flex items-center gap-3 rounded-xl border border-accent/35 bg-accent/10 px-5 py-3 font-mono text-sm font-semibold text-accent transition-all hover:border-accent/60 hover:bg-accent/15"
        >
          <Mail className="h-5 w-5" aria-hidden="true" />
          typeittestit@gmail.com
        </a>
      </div>
    </section>
  );
}
