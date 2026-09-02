import { StrictMode, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga4";
import "./index.css";
import App from "./App";
import SecurityBoundary from "./components/SecurityBoundary";
import { runGADiagnostic } from "./lib/ga-diagnostic";

function RootApp() {
  const isInitialized = useRef(false);

  // Initialize GA only once during the initial render,
  // ensuring it's ready before any child component's useEffect runs.
  if (!isInitialized.current) {
    ReactGA.initialize("G-SGDYN5GEJT");
    isInitialized.current = true;
  }

  useEffect(() => {
    // Automatically run the diagnostic report in the browser console
    // shortly after initial load (to give time for network requests to fire).
    if (import.meta.env.DEV) {
      setTimeout(() => {
        runGADiagnostic();
      }, 2500);
    }
  }, []);

  return (
    <SecurityBoundary>
      <App />
    </SecurityBoundary>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);

