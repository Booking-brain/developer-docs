/**
 * Language URL Sync — Stripe-style ?lang= parameter for API docs.
 *
 * Syncs the selected code-sample language with the URL query string so
 * links like /docs/api/search-properties?lang=python are shareable.
 *
 * Flow:
 *   1. onRouteUpdate (before render): read ?lang → write to localStorage
 *      so the CodeSnippets component picks the right default.
 *   2. onRouteDidUpdate (after render): if code tabs are on the page but
 *      no ?lang param, add it from localStorage.
 *   3. Global click handler: when a language tab is clicked, update ?lang.
 */

const STORAGE_KEY = "docusaurus.tab.code-samples";
const VALID_LANGS = ["curl", "nodejs", "python", "php", "ruby", "go"];

function getLangFromTab(tab) {
  for (const lang of VALID_LANGS) {
    if (tab.classList.contains(`openapi-tabs__code-item--${lang}`)) {
      return lang;
    }
  }
  return null;
}

// Before route components mount — seed localStorage from URL
export function onRouteUpdate({ location }) {
  if (typeof window === "undefined") return;
  const lang = new URLSearchParams(location.search).get("lang");
  if (lang && VALID_LANGS.includes(lang)) {
    localStorage.setItem(STORAGE_KEY, lang);
  }
}

// After route components mount — add ?lang to URL if missing
export function onRouteDidUpdate() {
  if (typeof window === "undefined") return;

  // Wait for React hydration so code tabs are in the DOM
  setTimeout(() => {
    const hasCodeTabs = document.querySelector(
      ".openapi-tabs__code-list-container"
    );
    if (!hasCodeTabs) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("lang")) return; // already set

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LANGS.includes(stored)) {
      const url = new URL(window.location);
      url.searchParams.set("lang", stored);
      window.history.replaceState({}, "", url);
    }
  }, 150);
}

// Global click handler — update ?lang when a language tab is clicked
if (typeof document !== "undefined") {
  document.addEventListener("click", (e) => {
    const tab = e.target.closest('.openapi-tabs__code-item[role="tab"]');
    if (!tab) return;

    // Skip variant and sample sub-tabs
    if (
      tab.classList.contains("openapi-tabs__code-item--variant") ||
      tab.classList.contains("openapi-tabs__code-item--sample")
    )
      return;

    const lang = getLangFromTab(tab);
    if (!lang) return;

    const url = new URL(window.location);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);
  });
}
