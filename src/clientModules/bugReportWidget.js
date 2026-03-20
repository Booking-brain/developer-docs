/**
 * Bug Report Widget — floating button that opens a pre-filled GitHub issue.
 *
 * Inspired by the BB_REACT BugReportWidget. Simpler version for docs:
 * red dot on bottom-right, click opens GitHub Issues with context.
 */

const REPO = "Booking-brain/developer-docs";

function getPageContext() {
  const url = window.location.href;
  const title = document.title;
  const path = window.location.pathname;
  return { url, title, path };
}

function buildIssueUrl(context) {
  const body = [
    "## Bug Report",
    "",
    `**Page:** [${context.title}](${context.url})`,
    `**Path:** \`${context.path}\``,
    `**Browser:** ${navigator.userAgent}`,
    "",
    "## Description",
    "",
    "<!-- What's wrong? What did you expect? -->",
    "",
    "",
    "## Steps to Reproduce",
    "",
    "1. Go to the page linked above",
    "2. ",
    "3. ",
    "",
    "## Screenshots",
    "",
    "<!-- Drag and drop screenshots here -->",
    "",
    "---",
    "*Reported via docs.bookingbrain.com bug report widget*",
  ].join("\n");

  const params = new URLSearchParams({
    title: `[Docs] `,
    body: body,
    labels: "bug,docs",
  });

  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}

function createWidget() {
  // Container
  const btn = document.createElement("a");
  btn.id = "bb-bug-report";
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.title = "Report a docs issue";
  btn.setAttribute("aria-label", "Report a documentation issue");

  // Style
  Object.assign(btn.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#d23f31",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    zIndex: "9999",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    textDecoration: "none",
    fontSize: "20px",
    lineHeight: "1",
  });

  // Bug icon (simple SVG)
  btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  // Hover effect
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.1)";
    btn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.35)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";
  });

  // Set href dynamically on click to capture current page context
  btn.addEventListener("click", (e) => {
    const context = getPageContext();
    btn.href = buildIssueUrl(context);
  });

  // Initial href
  btn.href = "#";

  document.body.appendChild(btn);
}

// Init after DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
}
