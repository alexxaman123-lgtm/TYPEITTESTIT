export default function TermsOfUsePage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-surface1/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Terms of Use</h1>
        <div className="mt-8 space-y-6 leading-7 text-muted">
          <div>
            <h2 className="font-semibold text-ink-soft">Use of the Service</h2>
            <p className="mt-2">
              TYPEITTESTIT is provided as a free tool for practicing and measuring typing speed. You may use
              the typing tester for personal, educational, and general practice purposes.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Typing Results</h2>
            <p className="mt-2">
              Results are generated locally in your browser based on your own input. WPM, accuracy, errors,
              and other results are provided for personal and informational use and are not guaranteed to be
              accurate for any specific professional, academic, or employment purpose.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Content</h2>
            <p className="mt-2">
              The typing passages available on TYPEITTESTIT are provided for practice purposes. Please use the
              service responsibly and do not attempt to interfere with, disrupt, or abuse the website.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Availability</h2>
            <p className="mt-2">
              We aim to keep TYPEITTESTIT available and useful, but the service is provided without a warranty
              that it will always be uninterrupted, error-free, or available in every circumstance.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Changes to These Terms</h2>
            <p className="mt-2">
              These Terms of Use may be updated as the service changes. Continued use of TYPEITTESTIT after an
              update means you accept the revised terms.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Contact</h2>
            <p className="mt-2">
              If you have questions about these Terms of Use, please contact us at{' '}
              <a href="mailto:typeittestit@gmail.com" className="text-accent hover:underline">typeittestit@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
