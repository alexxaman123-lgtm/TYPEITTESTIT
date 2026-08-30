export default function TermsOfUsePage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-surface1/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Legal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Terms of Use</h1>
        <p className="mt-3 text-sm text-faint">Last updated: August 31, 2026</p>
        <div className="mt-8 space-y-6 leading-7 text-muted">
          <div>
            <h2 className="font-semibold text-ink-soft">Use of the Service</h2>
            <p className="mt-2">
              TYPEITTESTIT is provided as a free tool for practicing and measuring typing speed. You may use the
              basic typing test without creating an account. Google Sign-In is optional, but is required for
              account-based saved progress and leaderboard participation.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Accounts and Usernames</h2>
            <p className="mt-2">
              You are responsible for the username you choose and for activity carried out through your account.
              Usernames must be valid, respectful, and unique without regard to capitalization. Do not use
              usernames that are offensive, abusive, misleading, impersonate another person or organization, or
              otherwise violate these Terms. We may reject, change, or remove usernames that do not meet these rules.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Leaderboard and Fair Play</h2>
            <p className="mt-2">
              If you participate in a leaderboard, your username, WPM, accuracy, difficulty, and result date may
              be displayed publicly. You must not submit manipulated, automated, fraudulent, or otherwise unfair
              results, or attempt to interfere with the service. We may remove results, restrict leaderboard access,
              or suspend accounts to protect fair play and the community.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Typing Results</h2>
            <p className="mt-2">
              Results are generated from your own input. WPM, accuracy, errors, and other results are provided for
              personal and informational use and are not guaranteed to be accurate for any specific professional,
              academic, or employment purpose. Results from a test taken without signing in are not added to an
              account history or leaderboard.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-ink-soft">Content and Acceptable Use</h2>
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
              If you have questions about these Terms of Use, please contact us at{" "}
              <a href="mailto:typeittestit@gmail.com" className="text-accent hover:underline">typeittestit@gmail.com</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
