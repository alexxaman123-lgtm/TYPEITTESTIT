export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-surface1/50 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Get in touch</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Contact TippyType</h1>
        <p className="mx-auto mt-6 max-w-2xl leading-7 text-muted">
          Have a question, suggestion, or query about TippyType? We would be happy to hear from you.
          Please reach out to us at the email address below and we’ll do our best to help.
        </p>
        <a
          href="mailto:typeittestit@gmail.com"
          className="mt-8 inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-6 py-3 font-semibold text-accent transition-all duration-200 hover:border-accent/70 hover:bg-accent/20"
        >
          typeittestit@gmail.com
        </a>
      </div>
    </section>
  );
}
