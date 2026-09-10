import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

const legacyBrandNames = [
  "FreeTypingTestGoat",
  "FREETYPINGTESTGOAT",
  "Test de mecanografía Cabra",
  "Schreibtest Ziege",
  "Test de frappe Chèvre",
  "Test di Digitazione Capra",
  "Test di digitazione Capra",
  "Teste de Digitação Cabra",
  "Teste de digitação Cabra",
  "Test Pisania Koza",
  "Yazma Testi Keçi",
  "Yazma testi Keçi",
  "Тест друку Коза",
  "Tes Mengetik Kambing",
  "Tes mengetik Kambing",
  "打字测试山羊",
  "タイピングテスト ヤギ",
  "타이핑 테스트 염소",
];

function goattypeBrandPlugin() {
  return {
    name: "goattype-brand-normalizer",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("/src/")) return null;
      let next = code;
      for (const legacyName of legacyBrandNames) next = next.split(legacyName).join("GOATTYPE");
      if (id.includes("/src/lib/i18n.ts")) {
        next = next.replace(/brandParts:\s*\[[^\]]+\]/g, 'brandParts: ["GOAT", "TYPE"]');
      }
      return next === code ? null : { code: next, map: null };
    },
  };
}

export default defineConfig({
  site: "https://typeittestit.com",
  integrations: [react()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  vite: {
    plugins: [goattypeBrandPlugin(), tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
