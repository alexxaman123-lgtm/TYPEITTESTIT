import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import SecurityBoundary from "./components/SecurityBoundary";

function RootApp() {
  // Google Analytics is already initialized via gtag.js in index.html
  // No duplicate initialization needed here

  useEffect(() => {
    // Automatically run the diagnostic report in the browser console
    // shortly after initial load (to give time for network requests to fire).
    if (import.meta.env.DEV) {
      setTimeout(() => {
        if (typeof window.runGADiagnostic === 'function') {
          window.runGADiagnostic();
        }
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

