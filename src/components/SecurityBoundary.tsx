import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class SecurityBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep production failures from taking down the entire page.
    // Do not persist potentially sensitive runtime details.
    if (import.meta.env.DEV) {
      console.error("TYPEITTESTIT runtime error", error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <section className="max-w-md rounded-2xl border border-white/10 bg-surface1 p-8">
          <h1 className="text-2xl font-bold text-ink">Something went wrong</h1>
          <p className="mt-3 text-muted">
            The typing test hit an unexpected error. Refresh the page to safely restart the session.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl border border-accent/40 px-5 py-2.5 font-semibold text-accent transition hover:border-accent hover:bg-accent/10"
          >
            Reload TYPEITTESTIT
          </button>
        </section>
      </main>
    );
  }
}
