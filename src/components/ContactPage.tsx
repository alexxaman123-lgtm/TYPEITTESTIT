export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[24px] border border-hairline bg-canvas p-6 text-center shadow-sm sm:p-10">
        <p className="font-label text-accent">Get in touch</p>
        <h1 className="mt-3 font-heading-3 text-ink">CONTACT FREETYPINGTESTGOAT</h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-text-muted">
          Have a question, suggestion, or query about FreeTypingTestGoat? We would be happy to hear from you.
          Please reach out to us at the email address below and we’ll do our best to help.
        </p>
        <a href="mailto:typeittestit@gmail.com" className="mt-8 inline-flex items-center rounded-full border border-hairline bg-canvas-soft px-8 py-4 font-link text-ink transition-colors duration-200 hover:border-text-muted hover:bg-canvas">
          typeittestit@gmail.com
        </a>
      </div>
    </section>
  );
}
