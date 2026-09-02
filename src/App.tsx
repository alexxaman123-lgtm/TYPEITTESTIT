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

const PAGE_CONFIG = {
  "/about": { title: "About GOATTYPE | Typing Speed Test", description: "Learn about GOATTYPE, a free online typing speed test for measuring WPM, accuracy, and typing progress." },
  "/contact": { title: "Contact GOATTYPE | Typing Speed Test", description: "Contact GOATTYPE with questions, suggestions, or feedback about our free typing speed test." },
  "/leaderboard": { title: "GOATTYPE Leaderboard | Top WPM & Accuracy", description: "View the GOATTYPE typing leaderboard, compare WPM and accuracy, and see the fastest and most accurate typists." },
  "/privacy-policy": { title: "GOATTYPE Privacy Policy", description: "Read the GOATTYPE Privacy Policy for account data, typing tests, local storage, and advertising." },
  "/terms-of-use": { title: "GOATTYPE Terms of Use", description: "Read the GOATTYPE Terms of Use for using our free online typing test and leaderboard features." },
} as const;

function getPage(pathname: string) {
  return pathname.replace(/\/$/, "") || "/";
}

export default function App() {
  const path = getPage(window.location.pathname);
  const dedicatedPage = path !== "/" && path in PAGE_CONFIG;

  useEffect(() => {
    const config = PAGE_CONFIG[path as keyof typeof PAGE_CONFIG];
    document.title = config?.title ?? "GOATTYPE — Free Typing Speed Test";
    const description = document.querySelector('meta[name="description"]');
    if (description && config) description.setAttribute("content", config.description);
    
    // Send pageview to Google Analytics using the current path
    try {
      const payload = { hitType: "pageview", page: path };
      ReactGA.send(payload);
      console.log("[GA] Event queued successfully:", payload);
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
