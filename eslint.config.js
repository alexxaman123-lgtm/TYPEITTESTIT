// ESLint flat config for TYPEITTESTIT (Astro + React + TypeScript).
//
// Version pairing notes (ESLint 10 was just released and the ecosystem is
// split, so everything is pinned):
// - ESLint 9: eslint-plugin-react@7 does not yet support ESLint 10.
// - eslint-plugin-astro@1: v2+ requires ESLint >= 10, so v1 is used here.
// - @eslint/js@9: v10 declares a peer dep on ESLint 10.
// When both plugins support ESLint 10, bump everything together.
//
// The toolchain is installed in CI with `npm install --no-save` (see the
// Lint step in .github/workflows/security.yml) so package-lock.json stays
// untouched. Keep the pins there in sync with the versions below.
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import astroPlugin from "eslint-plugin-astro";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**", "public/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroPlugin.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx}"],
    ...reactPlugin.configs.flat.recommended,
    plugins: {
      ...reactPlugin.configs.flat.recommended.plugins,
      "react-hooks": reactHooks,
    },
    settings: { react: { version: "detect" } },
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      ...reactHooks.configs["recommended-latest"].rules,
      // React 19 compiler-era rules, adopted incrementally: these flag
      // pre-existing patterns in the typing engine (setState-in-effect,
      // ref reads and Date.now() during render) that need careful,
      // behavior-preserving refactors. Kept as warnings until then.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      // React 19 + react-jsx transform: React need not be in scope
      "react/react-in-jsx-scope": "off",
      // TypeScript already validates props
      "react/prop-types": "off",
    },
  },
  {
    // Build scripts and configs run in Node, not the browser
    files: ["scripts/**/*.mjs", "*.config.*", "_worker.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
