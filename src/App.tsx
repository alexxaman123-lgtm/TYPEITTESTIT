import BackgroundEffects from "./components/BackgroundEffects";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TypingTester from "./components/TypingTester";
import SeoContent from "./components/SeoContent";
import HowItWorks from "./components/HowItWorks";
import GuidesSection from "./components/GuidesSection";
import AboutSection from "./components/AboutSection";
import FaqSection from "./components/FaqSection";

export default function App() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Header />

      <main>
        <Hero />

        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <TypingTester />
        </div>

        <div className="border-t border-white/8 below-fold-content">
          <SeoContent />
        </div>

        <div className="border-t border-white/8 below-fold-content">
          <HowItWorks />
        </div>

        <div className="border-t border-white/8 below-fold-content">
          <GuidesSection />
        </div>

        <div className="border-t border-white/8 below-fold-content">
          <AboutSection />
        </div>

        <div className="border-t border-white/8 below-fold-content">
          <FaqSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
