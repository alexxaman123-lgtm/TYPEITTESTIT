export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-surface1/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Privacy Policy</h1>
        <div className="mt-8 space-y-6 leading-7 text-muted">
          <div>
            <h2 className="font-semibold text-ink-soft">Information We Collect</h2>
            <p className="mt-2">
              TYPEITTESTIT does not require an account to use the typing test. We do not ask you to provide
              personal information simply to practice or measure your typing speed.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Local Browser Data</h2>
            <p className="mt-2">
              Your difficulty and duration preferences and your personal best scores are stored in your browser’s
              local storage so they can be restored on your next visit. This information is stored locally on your device.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Typing Content</h2>
            <p className="mt-2">
              Your typing results and custom text are processed directly in your browser. Custom text you paste
              into custom typing mode is not transmitted to our servers by the typing tester.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time as TYPEITTESTIT evolves. Any updated version
              will be published on this page.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Questions</h2>
            <p className="mt-2">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:typeittestit@gmail.com" className="text-accent hover:underline">typeittestit@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
