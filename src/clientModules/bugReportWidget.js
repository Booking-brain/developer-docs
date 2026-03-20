/**
 * Bug Report Widget — BB_REACT-style slide-out panel for docs.
 *
 * User writes their issue in plain language, hits submit. Backend calls
 * Anthropic API to generate a structured bug report, then creates a
 * GitHub issue automatically. User never sees the AI analysis.
 */

const API_BASE = "https://app.bookingbrain.com/api/v1/developer";
const API_KEY = "bb_6c4e584be61667d4d50928d0d0039ed2";
const WIDGET_ID = "bb-bug-report";
const PANEL_ID = "bb-bug-report-panel";
const BACKDROP_ID = "bb-bug-report-backdrop";

function injectStyles() {
  if (document.getElementById("bb-bug-report-styles")) return;
  const style = document.createElement("style");
  style.id = "bb-bug-report-styles";
  style.textContent = `
    #${WIDGET_ID} {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #d23f31;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      z-index: 9999;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      padding: 0;
      font-size: 0;
    }
    #${WIDGET_ID}:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    }

    #${BACKDROP_ID} {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      backdrop-filter: blur(2px);
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }
    #${BACKDROP_ID}.open {
      opacity: 1;
      pointer-events: auto;
    }

    #${PANEL_ID} {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 420px;
      max-width: 100vw;
      background: var(--bb-surface-primary, #fff);
      box-shadow: -4px 0 24px rgba(0,0,0,0.12);
      z-index: 10001;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #${PANEL_ID}.open {
      transform: translateX(0);
    }

    [data-theme='dark'] #${PANEL_ID} {
      background: var(--bb-surface-primary, #13151e);
      box-shadow: -4px 0 24px rgba(0,0,0,0.4);
    }

    .bb-bug-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--bb-border-color, #e3e5e8);
    }
    .bb-bug-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .bb-bug-header-icon {
      width: 28px;
      height: 28px;
      background: #d23f31;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bb-bug-header h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: var(--bb-gray-900, #1d1d1f);
      border: none;
      padding: 0;
    }
    .bb-bug-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--bb-gray-500, #6e6e73);
      transition: background 0.15s ease;
    }
    .bb-bug-close:hover {
      background: var(--bb-surface-secondary, #f7f8fa);
    }

    .bb-bug-body {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .bb-bug-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--bb-gray-500, #6e6e73);
      margin-bottom: 6px;
    }

    .bb-bug-page-url {
      width: 100%;
      padding: 8px 12px;
      font-size: 13px;
      border: 1px solid var(--bb-border-color, #e3e5e8);
      border-radius: 8px;
      background: var(--bb-surface-secondary, #f7f8fa);
      color: var(--bb-gray-400, #a1a1a6);
      cursor: not-allowed;
      font-family: var(--ifm-font-family-monospace, monospace);
    }

    .bb-bug-type-toggle {
      display: flex;
      gap: 8px;
    }
    .bb-bug-type-btn {
      flex: 1;
      padding: 8px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      border: 1.5px solid var(--bb-border-color, #e3e5e8);
      background: var(--bb-surface-primary, #fff);
      color: var(--bb-gray-600, #4a4a50);
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .bb-bug-type-btn:hover {
      border-color: var(--bb-gray-300, #d1d1d6);
    }
    .bb-bug-type-btn.active-bug {
      background: #d23f31;
      color: #fff;
      border-color: #d23f31;
    }
    .bb-bug-type-btn.active-feature {
      background: var(--bb-brand-primary, #015A9C);
      color: #fff;
      border-color: var(--bb-brand-primary, #015A9C);
    }

    .bb-bug-textarea {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      line-height: 1.6;
      border: 1px solid var(--bb-border-color, #e3e5e8);
      border-radius: 8px;
      background: var(--bb-surface-primary, #fff);
      color: var(--bb-gray-900, #1d1d1f);
      resize: none;
      font-family: var(--ifm-font-family-base, sans-serif);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .bb-bug-textarea:focus {
      outline: none;
      border-color: var(--bb-brand-primary, #015A9C);
      box-shadow: 0 0 0 3px rgba(1, 90, 156, 0.1);
    }
    .bb-bug-textarea::placeholder {
      color: var(--bb-gray-400, #a1a1a6);
    }

    [data-theme='dark'] .bb-bug-textarea {
      background: var(--bb-surface-secondary, #191c28);
      color: var(--bb-gray-900, #f0f1f5);
      border-color: var(--bb-border-color, #2a2d3d);
    }

    .bb-bug-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--bb-border-color, #e3e5e8);
    }

    .bb-bug-submit {
      width: 100%;
      padding: 10px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      color: #fff;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .bb-bug-submit.bug-btn {
      background: #d23f31;
    }
    .bb-bug-submit.bug-btn:hover:not(:disabled) {
      background: #b5332a;
    }
    .bb-bug-submit.feature-btn {
      background: var(--bb-brand-primary, #015A9C);
    }
    .bb-bug-submit.feature-btn:hover:not(:disabled) {
      background: var(--bb-brand-primary-hover, #004A82);
    }
    .bb-bug-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .bb-bug-helper {
      font-size: 12px;
      color: var(--bb-gray-400, #a1a1a6);
      text-align: center;
      margin-top: 10px;
    }

    /* Spinner for loading state */
    .bb-bug-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: bb-spin 0.6s linear infinite;
    }
    @keyframes bb-spin {
      to { transform: rotate(360deg); }
    }

    /* Toast notification */
    .bb-bug-toast {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      z-index: 10002;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      font-family: var(--ifm-font-family-base, sans-serif);
      max-width: 400px;
    }
    .bb-bug-toast.show {
      opacity: 1;
      transform: translateY(0);
    }
    .bb-bug-toast.success {
      background: #00a67d;
      color: #fff;
    }
    .bb-bug-toast.error {
      background: #d23f31;
      color: #fff;
    }
    .bb-bug-toast a {
      color: #fff;
      text-decoration: underline;
    }

    @media screen and (max-width: 480px) {
      #${PANEL_ID} {
        width: 100vw;
        top: auto;
        bottom: 0;
        border-radius: 16px 16px 0 0;
        max-height: 90vh;
        transform: translateY(100%);
      }
      #${PANEL_ID}.open {
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

function showToast(message, type = "success", duration = 4000) {
  const toast = document.createElement("div");
  toast.className = `bb-bug-toast ${type}`;
  toast.innerHTML = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

let panelOpen = false;
let currentType = "bug";
let submitting = false;

function togglePanel(open) {
  panelOpen = open !== undefined ? open : !panelOpen;
  const panel = document.getElementById(PANEL_ID);
  const backdrop = document.getElementById(BACKDROP_ID);
  if (panel) panel.classList.toggle("open", panelOpen);
  if (backdrop) backdrop.classList.toggle("open", panelOpen);

  if (panelOpen) {
    const pageUrl = panel.querySelector(".bb-bug-page-url");
    if (pageUrl) pageUrl.value = window.location.href;
    const textarea = panel.querySelector(".bb-bug-textarea");
    if (textarea) setTimeout(() => textarea.focus(), 300);
  }
}

function setType(type) {
  currentType = type;
  const bugBtn = document.querySelector(".bb-bug-type-btn.bug");
  const featureBtn = document.querySelector(".bb-bug-type-btn.feature");
  const submitBtn = document.querySelector(".bb-bug-submit");

  if (bugBtn) {
    bugBtn.classList.toggle("active-bug", type === "bug");
    bugBtn.classList.toggle("active-feature", false);
  }
  if (featureBtn) {
    featureBtn.classList.toggle("active-feature", type === "feature");
    featureBtn.classList.toggle("active-bug", false);
  }
  if (submitBtn) {
    submitBtn.classList.toggle("bug-btn", type === "bug");
    submitBtn.classList.toggle("feature-btn", type === "feature");
    if (!submitting) {
      submitBtn.innerHTML = type === "bug"
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Submit Bug Report`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg> Submit Feature Request`;
    }
  }
}

function setSubmitting(loading) {
  submitting = loading;
  const submitBtn = document.querySelector(".bb-bug-submit");
  const textarea = document.querySelector(".bb-bug-textarea");
  const typeBtns = document.querySelectorAll(".bb-bug-type-btn");

  if (submitBtn) {
    submitBtn.disabled = loading;
    if (loading) {
      submitBtn.innerHTML = `<span class="bb-bug-spinner"></span> Analyzing & creating issue...`;
    } else {
      setType(currentType);
    }
  }
  if (textarea) textarea.disabled = loading;
  typeBtns.forEach((btn) => (btn.disabled = loading));
}

async function handleSubmit() {
  if (submitting) return;

  const textarea = document.querySelector(".bb-bug-textarea");
  const description = textarea?.value?.trim();
  if (!description) {
    textarea?.focus();
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(`${API_BASE}/docs-feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        type: currentType,
        description,
        pageUrl: window.location.href,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Server error (${response.status})`);
    }

    const result = await response.json();

    // Success — show toast with link to issue
    showToast(
      `Issue <a href="${result.issueUrl}" target="_blank" rel="noopener">#${result.issueNumber}</a> created successfully!`,
      "success",
      5000
    );

    // Reset form and close panel
    if (textarea) textarea.value = "";
    togglePanel(false);
  } catch (err) {
    showToast(
      `Failed to create issue. ${err.message || "Please try again."}`,
      "error",
      5000
    );
  } finally {
    setSubmitting(false);
  }
}

function createWidget() {
  if (document.getElementById(WIDGET_ID)) return;

  injectStyles();

  // Floating button
  const btn = document.createElement("button");
  btn.id = WIDGET_ID;
  btn.title = "Report an issue";
  btn.setAttribute("aria-label", "Report a documentation issue");
  btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  btn.addEventListener("click", () => togglePanel());
  document.body.appendChild(btn);

  // Backdrop
  const backdrop = document.createElement("div");
  backdrop.id = BACKDROP_ID;
  backdrop.addEventListener("click", () => togglePanel(false));
  document.body.appendChild(backdrop);

  // Panel
  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <div class="bb-bug-header">
      <div class="bb-bug-header-left">
        <div class="bb-bug-header-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2>Report an Issue</h2>
      </div>
      <button class="bb-bug-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="bb-bug-body">
      <div>
        <label class="bb-bug-label">Current Page</label>
        <input class="bb-bug-page-url" type="text" readonly value="${window.location.href}" />
      </div>
      <div>
        <label class="bb-bug-label">Type</label>
        <div class="bb-bug-type-toggle">
          <button class="bb-bug-type-btn bug active-bug" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Bug
          </button>
          <button class="bb-bug-type-btn feature" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
            Feature
          </button>
        </div>
      </div>
      <div style="flex:1; display:flex; flex-direction:column;">
        <label class="bb-bug-label">What's the issue? <span style="color:#d23f31">*</span></label>
        <textarea class="bb-bug-textarea" rows="6" placeholder="Describe what's wrong or what you'd like to see..."></textarea>
      </div>
    </div>
    <div class="bb-bug-footer">
      <button class="bb-bug-submit bug-btn" type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Submit Bug Report
      </button>
      <p class="bb-bug-helper">AI analyses your report and creates a GitHub issue automatically</p>
    </div>
  `;
  document.body.appendChild(panel);

  // Event listeners
  panel.querySelector(".bb-bug-type-btn.bug")?.addEventListener("click", () => setType("bug"));
  panel.querySelector(".bb-bug-type-btn.feature")?.addEventListener("click", () => setType("feature"));
  panel.querySelector(".bb-bug-submit")?.addEventListener("click", handleSubmit);
  panel.querySelector(".bb-bug-close")?.addEventListener("click", () => togglePanel(false));

  // Ctrl+Enter to submit
  panel.querySelector(".bb-bug-textarea")?.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  });

  // Escape to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panelOpen) {
      togglePanel(false);
    }
  });
}

// Init
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
}

// Re-init on route change (Docusaurus SPA navigation)
export function onRouteDidUpdate() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(WIDGET_ID)) {
    createWidget();
  }
}
