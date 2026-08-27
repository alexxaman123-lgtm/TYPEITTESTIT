import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import SecurityBoundary from "./components/SecurityBoundary";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SecurityBoundary>
      <App />
    </SecurityBoundary>
  </StrictMode>
);
