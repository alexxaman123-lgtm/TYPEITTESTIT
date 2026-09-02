import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactGA from "react-ga4";
import "./index.css";
import App from "./App";
import SecurityBoundary from "./components/SecurityBoundary";

// Initialize Google Analytics exactly as requested
ReactGA.initialize("G-SGDYN5GEJT");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SecurityBoundary>
      <App />
    </SecurityBoundary>
  </StrictMode>
);
