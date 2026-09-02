export function runGADiagnostic() {
  console.group("🔍 Google Analytics Diagnostic Report");

  try {
    // 1. Verify dataLayer existence and contents
    const dataLayer = (window as any).dataLayer;
    if (!dataLayer || !Array.isArray(dataLayer)) {
      console.error("❌ window.dataLayer is not initialized or is not an array.");
    } else {
      console.log("✅ window.dataLayer is initialized. Length:", dataLayer.length);
      
      // Look for the specific G-SGDYN5GEJT property in the dataLayer history
      const containsMeasurementId = dataLayer.some((item: any) => {
        try {
          return JSON.stringify(Array.from(item)).includes("G-SGDYN5GEJT");
        } catch {
          return false;
        }
      });

      if (containsMeasurementId) {
        console.log("✅ Successfully found config for G-SGDYN5GEJT in dataLayer.");
      } else {
        console.warn("⚠️ Could not find config for G-SGDYN5GEJT in dataLayer. Make sure ReactGA.initialize() ran successfully.");
      }

      // Look for pageview events or events pushed to the dataLayer
      const pageViewEvents = dataLayer.filter((item: any) => {
        try {
          const str = JSON.stringify(Array.from(item));
          // react-ga4 can push 'event', 'page_view' or just standard hitType parameters
          return str.includes("pageview") || str.includes("page_view") || str.includes("hitType");
        } catch {
          return false;
        }
      });

      if (pageViewEvents.length > 0) {
        console.log(`✅ Successfully detected ${pageViewEvents.length} pageview/event(s) in dataLayer.`);
      } else {
        console.warn("⚠️ No pageview events found in dataLayer yet.");
      }
    }

    // 2. Verify Network Requests (Resource Timing API)
    if ("performance" in window && "getEntriesByType" in window.performance) {
      const resources = window.performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      
      // Filter for GA / GTM / DoubleClick domains listed in the CSP
      const gaResources = resources.filter(r =>
        r.name.includes("google-analytics.com") ||
        r.name.includes("googletagmanager.com") ||
        r.name.includes("analytics.google.com") ||
        r.name.includes("stats.g.doubleclick.net")
      );

      if (gaResources.length > 0) {
        console.log("✅ Found successful network requests to GA endpoints (CSP allowed):");
        gaResources.forEach(r => {
          // Truncate long URLs for clean console output
          const url = new URL(r.name);
          console.log(`   ➔ ${url.origin}${url.pathname}`);
        });
      } else {
        console.warn("⚠️ No network requests to Google Analytics domains were detected.");
        console.log("   Possible reasons:");
        console.log("   1. Tracking blocked by an Adblocker (uBlock, Brave Shields).");
        console.log("   2. Content-Security-Policy blocked the request (check Console for red CSP errors).");
        console.log("   3. The network request has not fired yet.");
      }
    } else {
      console.log("⚠️ Performance API not supported in this browser. Cannot check network requests.");
    }
  } catch (error) {
    console.error("❌ Diagnostic check failed with error:", error);
  }

  console.groupEnd();
}

// Attach to the window object so it can be called manually in the browser DevTools console
if (typeof window !== "undefined") {
  (window as any).runGADiagnostic = runGADiagnostic;
}
