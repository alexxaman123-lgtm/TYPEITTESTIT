import { useEffect } from "react";
import ReactGA from "react-ga4";
import BackgroundEffects from "./components/BackgroundEffects";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TypingTester from "./components/TypingTester";
import SeoContent from "./components/SeoContent";
import HowItWorks from "./components/HowItWorks";
import GuidesSection from "./components/GuidesSection";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";
import LeaderboardPage from "./components/LeaderboardPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import TermsOfUsePage from "./components/TermsOfUsePage";
import FaqSection from "./components/FaqSection";

const SITE_URL = "https://typeittestit.com";
const DEFAULT_TITLE = "Free Typing Test Online | WPM & Typing Practice | FreeTypingTestGoat";
const DEFAULT_DESCRIPTION = "Take a free typing test online to measure WPM, accuracy, and errors. Practice with 1, 2, 3, or 5 minute tests and improve your typing speed.";

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
  const path = getPage(window.location.pathname);
  const dedicatedPage = path !== "/" && path in PAGE_CONFIG;

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

  const renderPage = () => {
    if (path === "/about") return <AboutPage />;
    if (path === "/contact") return <ContactPage />;
    if (path === "/leaderboard") return <LeaderboardPage />;
    if (path === "/privacy-policy") return <PrivacyPolicyPage />;
    if (path === "/terms-of-use") return <TermsOfUsePage />;
    if (dedicatedPage) return null;

    return (
      <>
        <Hero />
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8"><TypingTester /></div>
        <div className="border-t border-white/8 below-fold-content"><SeoContent /></div>
        <div className="border-t border-white/8 below-fold-content"><HowItWorks /></div>
        <div className="border-t border-white/8 below-fold-content"><GuidesSection /></div>
        <div className="border-t border-white/8 below-fold-content"><FaqSection /></div>
      </>
    );
  };

  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}
