// Google Analytics bootstrap for the GOATTYPE Vite SPA.
// Keep this as a same-origin classic script so the global gtag/dataLayer
// initialization is not dependent on inline-script CSP behavior.
(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', 'G-SGDYN5GEJT');
})();
