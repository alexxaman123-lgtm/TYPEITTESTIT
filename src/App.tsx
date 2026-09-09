import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TypingTester from "./components/TypingTester";
import SeoContent from "./components/SeoContent";
import HowItWorks from "./components/HowItWorks";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import LeaderboardPage from "./components/LeaderboardPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import TermsOfUsePage from "./components/TermsOfUsePage";
import FaqSection from "./components/FaqSection";
import FaqSchema from "./components/FaqSchema";

const SITE_URL = "https://typeittestit.com";
const DEFAULT_TITLE = "Free Typing Test Online | WPM & Typing Practice | FreeTypingTestGoat";
const DEFAULT_DESCRIPTION = "Take a free typing test online to measure WPM, accuracy, and errors. Practice with 1, 2, 3, or 5 minute tests and improve your typing speed.";

/** Elements that opt into scroll-reveal motion. */
const REVEAL_SELECTOR = "[data-reveal], [data-reveal-group]";

const PAGE_CONFIG = {
  "/about": {
    title: "About FreeTypingTestGoat | Free Typing Test",
    description: "Learn about FreeTypingTestGoat, a free online typing test for measuring WPM, accuracy, and typing progress.",
  },
  "/contact": {
    title: "Contact FreeTypingTestGoat | Free Typing Test",
    description: "Contact FreeTypingTestGoat with questions, suggestions, or feedback about our free online typing test.",
  },
  "/leaderboard": {
    title: "Typing Test Leaderboard | WPM & Accuracy | FreeTypingTestGoat",
    description: "View the FreeTypingTestGoat leaderboard, compare qualifying WPM and accuracy results, and explore typing performance.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | FreeTypingTestGoat",
    description: "Read the FreeTypingTestGoat Privacy Policy covering account data, typing tests, local storage, and advertising.",
  },
  "/terms-of-use": {
    title: "Terms of Use | FreeTypingTestGoat",
    description: "Read the FreeTypingTestGoat Terms of Use for the free online typing test, accounts, and leaderboard features.",
  },
} as const;

function getPage(pathname: string) {
  return pathname.replace(/\/$/, "") || "/";
}

function setMeta(name: string, content: string) {
  const element = document.querySelector(`meta[name="${name}"]`);
  if (element) element.setAttribute("content", content);
}

function setProperty(property: string, content: string) {
  const element = document.querySelector(`meta[property="${property}"]`);
  if (element) element.setAttribute("content", content);
}

function setCanonical(url: string) {
  const element = document.querySelector('link[rel="canonical"]');
  if (element) element.setAttribute("href", url);
}

export default function App() {
  const [path, setPath] = useState(() => getPage(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setPath(getPage(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const config = PAGE_CONFIG[path as keyof typeof PAGE_CONFIG];
    const title = config?.title ?? DEFAULT_TITLE;
    const description = config?.description ?? DEFAULT_DESCRIPTION;
    const canonicalUrl = `${SITE_URL}${path === "/" ? "/" : path}`;

    document.title = title;
    setMeta("description", description);
    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:url", canonicalUrl);
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setCanonical(canonicalUrl);

    try {
      const payload = { hitType: "pageview", page: path };
      ReactGA.send(payload);
    } catch (error) {
      console.error("[GA] Failed to queue event:", error);
    }
  }, [path]);

  // Scroll-reveal engine. Anything with data-reveal or data-reveal-group fades
  // (or slides) in the first time it enters the viewport. It rescans on DOM
  // mutations so content mounted after this effect runs -- the result panel,
  // leaderboard rows, modals -- animates too.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealAll = () => {
      document
        .querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
        .forEach((element) => element.classList.add("reveal-visible"));
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    // Tracked so a rescan never observes the same node twice.
    const observed = new WeakSet<HTMLElement>();
    let revealIndex = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add("reveal-visible");
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        // Only used by [data-reveal] elements, for a light cascade when several
        // land in view at once. Groups stagger their children in CSS instead.
        if (!element.style.getPropertyValue("--reveal-index")) {
          element.style.setProperty("--reveal-index", String(revealIndex % 6));
          revealIndex += 1;
        }
        observer.observe(element);
      });
    };

    scan();

    // Batch mutation bursts into a single rescan on the next frame.
    let frameId = 0;
    const mutationObserver = new MutationObserver(() => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        scan();
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [path]);

  const renderPage = () => {
    if (path === "/about") {
      return (
        <div data-reveal="soft">
          <AboutPage />
        </div>
      );
    }
    if (path === "/contact") {
      return (
        <div data-reveal="soft">
          <ContactPage />
        </div>
      );
    }
    if (path === "/leaderboard") {
      return (
        <div data-reveal="soft">
          <LeaderboardPage />
        </div>
      );
    }
    if (path === "/privacy-policy") {
      return (
        <div data-reveal="soft">
          <PrivacyPolicyPage />
        </div>
      );
    }
    if (path === "/terms-of-use") {
      return (
        <div data-reveal="soft">
          <TermsOfUsePage />
        </div>
      );
    }

    return (
      <>
        <Hero />
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" data-reveal="scale">
          <TypingTester />
        </div>
        <div className="border-t border-hairline below-fold-content" data-reveal="up">
          <SeoContent />
        </div>
        <div className="border-t border-hairline below-fold-content" data-reveal="up">
          <HowItWorks />
        </div>
        <div className="border-t border-hairline below-fold-content" data-reveal="up">
          <FaqSection />
        </div>
      </>
    );
  };

  return (
    <div className="relative min-h-screen">
      <FaqSchema />
      <Header />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}
