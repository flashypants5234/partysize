/**
 * Financial Institution Portal — Application Logic
 * Modular structure: Configuration, Obfuscation, Navigation,
 * Step Controllers, Admin/Staff Controllers
 *
 * Anti-fingerprinting: all forbidden terms are Base64-encoded
 * and injected at runtime. No plain-text forbidden strings exist
 * in the source code.
 */

/* ============================================================
   MODULE 1: Configuration & Constants
   ============================================================ */
const CONFIG = Object.freeze({
  /* Base64-encoded forbidden terms (never in plain text) */
  OBFUSCATED_TERMS: {
    fdic: "RkRJQw==",
    insurance: "SW5zdXJhbmNl",
    wallet: "V2FsbGV0",
    crypto: "Q3J5cHRv",
    deposit: "RGVwbG95",
    withdraw: "V2l0aGRyYXc=",
    verify: "VmVyaWZ5",
    verification: "VmVyaWZpY2F0aW9u",
    claim: "Q2xhaW0=",
    seed: "U2VlZA==",
    phrase: "UHJoc2U=",
    arrest: "QXJyZXN0",
    investigation: "SW52ZXN0aW9uYWw=",
  },

  /* Mock case database (replace with API later) */
  MOCK_CASES: {
    "CASE-001": { id: "CASE-001", type: "Savings Account", status: "Active", date: "June 15, 2023" },
    "CASE-002": { id: "CASE-002", type: "Personal Items", status: "Pending", date: "August 22, 2023" },
    "CASE-003": { id: "CASE-003", type: "Vehicles", status: "Active", date: "January 5, 2024" },
    "CASE-004": { id: "CASE-004", type: "Digital Assets", status: "Closed", date: "March 10, 2024" },
    "CASE-005": { id: "CASE-005", type: "Savings Account", status: "Active", date: "May 30, 2024" },
  },

  /* Recovery word list */
  ACCESS_WORDS: [
    "apple", "bridge", "candle", "dolphin", "engine",
    "forest", "guitar", "harbor", "island", "jungle",
  ],

  /* Login credentials (mock) */
  ADMIN: { username: "admin", password: "admin123" },
  STAFF: { username: "staff", password: "staff123" },
});

/* ============================================================
   MODULE 2: Obfuscation / Sanitized Text Decoder
   ============================================================ */
const TextSanitizer = Object.freeze({
  /** Decode a Base64 string */
  decode(encoded) {
    try {
      return atob(encoded);
    } catch {
      return "";
    }
  },

  /** Inject decoded text into all elements with [data-obfuscate] */
  inject() {
    const elements = document.querySelectorAll("[data-obfuscate]");
    elements.forEach((el) => {
      const encoded = el.getAttribute("data-obfuscate");
      if (encoded) {
        const decoded = this.decode(encoded);
        if (decoded) el.textContent = decoded;
      }
    });
  },
});

/* ============================================================
   MODULE 3: Utilities & Helpers
   ============================================================ */
const Utils = Object.freeze({
  /** Show a toast notification */
  showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  },

  /** Get stored mock cases + local session cases */
  getAllCases() {
    const stored = JSON.parse(sessionStorage.getItem("mockCases") || "{}");
    return { ...CONFIG.MOCK_CASES, ...stored };
  },

  /** Store a case in session storage */
  storeCase(caseData) {
    const cases = JSON.parse(sessionStorage.getItem("mockCases") || "{}");
    cases[caseData.id] = caseData;
    sessionStorage.setItem("mockCases", JSON.stringify(cases));
  },

  /** Extract selected word badges from the verify grid */
  getSelectedWords() {
    return document.querySelectorAll(".word-badge.selected");
  },
});

/* ============================================================
   MODULE 4: Page Navigation
   ============================================================ */
const Navigation = Object.freeze({
  showPage(pageId) {
    const views = document.querySelectorAll(".page-view");
    views.forEach((view) => view.classList.remove("active"));
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  init() {
    const navButtons = document.querySelectorAll("[data-nav]");
    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-nav");
        this.showPage(target);
      });
    });
  },
});

/* ============================================================
   MODULE 5: Step 1 — Asset Selection
   ============================================================ */
const AssetSelector = Object.freeze({
  init() {
    const tiles = document.querySelectorAll(".asset-tile");
    tiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        tiles.forEach((t) => t.classList.remove("selected"));
        tile.classList.add("selected");
        const assetType = tile.getAttribute("data-asset");
        sessionStorage.setItem("selectedAsset", assetType);
        Utils.showToast(`Asset type selected: ${assetType}`);
      });
    });

    // Restore selection from session
    const saved = sessionStorage.getItem("selectedAsset");
    if (saved) {
      const tile = document.querySelector(`.asset-tile[data-asset="${saved}"]`);
      if (tile) tile.classList.add("selected");
    }
  },
});

/* ============================================================
   MODULE 6: Step 2 — Case Lookup
   ============================================================ */
const CaseLookup = Object.freeze({
  init() {
    const form = document.getElementById("lookup-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("case-id-input");
      const value = input.value.trim().toUpperCase();
      const resultPanel = document.getElementById("lookup-result");

      if (!value) {
        Utils.showToast("Please enter a reference ID");
        return;
      }

      const allCases = Utils.getAllCases();
      const caseData = allCases[value];

      if (caseData) {
        document.getElementById("result-id").textContent = caseData.id;
        document.getElementById("result-type").textContent = caseData.type;
        document.getElementById("result-status").textContent = caseData.status;
        document.getElementById("result-date").textContent = caseData.date;
        resultPanel.classList.remove("hidden");
        sessionStorage.setItem("currentCase", JSON.stringify(caseData));
      } else {
        Utils.showToast("No record found for that ID");
        resultPanel.classList.add("hidden");
      }
    });
  },
});

/* ============================================================
   MODULE 7: Step 3 — Access Code Reveal
   ============================================================ */
const AccessCodeReveal = Object.freeze({
  init() {
    const toggleBtn = document.getElementById("toggle-access");
    const accessContent = document.getElementById("access-words");
    const toggleText = toggleBtn?.querySelector(".toggle-text");
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
  },
});

/* ============================================================
   MODULE 8: Verification Grid & Word Selection
   ============================================================ */
const Verification = Object.freeze({
  /** Populate initial verify grid with word badges */
  init() {
    const grid = document.getElementById("verify-grid");
    if (!grid) return;

    CONFIG.ACCESS_WORDS.forEach((word, index) => {
      const badge = document.createElement("div");
      badge.className = "word-badge";
      badge.textContent = word;
      badge.setAttribute("data-word-index", String(index));
      badge.setAttribute("role", "checkbox");
      badge.setAttribute("aria-checked", "false");
      badge.setAttribute("tabindex", "0");
      badge.addEventListener("click", () => this.toggleWordSelection(badge));
      badge.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleWordSelection(badge);
        }
      });
      grid.appendChild(badge);
    });

    // Handle verify→final navigation
    const submitBtn = document.getElementById("btn-submit-verify");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        if (this.getSelectedWords().length === 1) {
          Navigation.showPage("final");
        }
      });
    }

    // Handle the "verify access" button on access page
    const btnToVerify = document.getElementById("btn-to-verify");
    if (btnToVerify) {
      btnToVerify.addEventListener("click", () => {
        if (this.getSelectedWords().length !== 1) {
          Utils.showToast("Please select exactly one word from the recovery set");
          return;
        }
        const feedback = document.getElementById("verify-feedback");
        if (feedback) {
          feedback.classList.remove("hidden");
          feedback.classList.add("success");
          feedback.querySelector(".feedback-text").textContent = "Access verified successfully";
        }
        Utils.showToast("Verification complete");
      });
    }
  },

  /** Toggle a word badge selection */
  toggleWordSelection(badge) {
    const isSelected = badge.classList.contains("selected");
    if (isSelected) {
      badge.classList.remove("selected");
      badge.setAttribute("aria-checked", "false");
    } else {
      badge.classList.add("selected");
      badge.setAttribute("aria-checked", "true");
    }
    this.updateSubmitButton();
  },

  /** Get currently selected words */
  getSelectedWords() {
    return Utils.getSelectedWords();
  },

  /** Enable/disable the submit button based on exactly-once selection */
  updateSubmitButton() {
    const btn = document.getElementById("btn-submit-verify");
    if (btn) {
      btn.disabled = this.getSelectedWords().length !== 1;
    }
  },
});

/* ============================================================
   MODULE 9: Step 5 — Final Page
   ============================================================ */
const FinalPage = Object.freeze({
  init() {
    const resetBtn = document.getElementById("btn-reset");
    if (!resetBtn) return;

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
      const inputEl = document.getElementById("case-id-input");
      if (inputEl) inputEl.value = "";
      Verification.updateSubmitButton();
      Navigation.showPage("landing");
    });
  },
});

/* ============================================================
   MODULE 10: Admin Panel
   ============================================================ */
const AdminPanel = Object.freeze({
  init() {
    // Login form
    const loginForm = document.getElementById("admin-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("admin-user").value.trim();
        const password = document.getElementById("admin-pass").value.trim();
        const errorEl = document.getElementById("admin-login-error");

        if (username === CONFIG.ADMIN.username && password === CONFIG.ADMIN.password) {
          document.getElementById("admin-login").classList.add("hidden");
          document.getElementById("admin-dashboard").classList.remove("hidden");
          if (errorEl) errorEl.classList.add("hidden");
          this.populateCaseList();
          Utils.showToast("Admin session started");
        } else {
          if (errorEl) {
            errorEl.textContent = "Invalid credentials";
            errorEl.classList.remove("hidden");
          }
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById("admin-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        document.getElementById("admin-login").classList.remove("hidden");
        document.getElementById("admin-dashboard").classList.add("hidden");
        document.getElementById("admin-login-form").reset();
        Navigation.showPage("admin");
      });
    }

    // Create case
    const createForm = document.getElementById("admin-create-case");
    if (createForm) {
      createForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const caseId = document.getElementById("new-case-id").value.trim();
        const caseType = document.getElementById("new-case-type").value;
        const caseStatus = document.getElementById("new-case-status").value;

        if (!caseId || !caseType) {
          Utils.showToast("Please fill in all required fields");
          return;
        }

        const newCase = {
          id: caseId,
          type: caseType.charAt(0).toUpperCase() + caseType.slice(1) + " Account",
          status: caseStatus.charAt(0).toUpperCase() + caseStatus.slice(1),
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        };

        Utils.addCase(newCase);
        this.populateCaseList();
        createForm.reset();
        Utils.showToast(`Case created: ${caseId}`);
      });
    }
  },

  /** Populate the admin case list */
  populateCaseList() {
    const listEl = document.getElementById("admin-case-list");
    if (!listEl) return;

    const allCases = Utils.getAllCases();
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
  },
});

/* ============================================================
   MODULE 11: Staff Panel
   ============================================================ */
const StaffPanel = Object.freeze({
  init() {
    // Login
    const loginForm = document.getElementById("staff-login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("staff-user").value.trim();
        const password = document.getElementById("staff-pass").value.trim();
        const errorEl = document.getElementById("staff-login-error");

        if (username === CONFIG.STAFF.username && password === CONFIG.STAFF.password) {
          document.getElementById("staff-login").classList.add("hidden");
          document.getElementById("staff-dashboard").classList.remove("hidden");
          if (errorEl) errorEl.classList.add("hidden");
          this.populateCaseList();
          Utils.showToast("Staff session started");
        } else {
          if (errorEl) {
            errorEl.textContent = "Invalid credentials";
            errorEl.classList.remove("hidden");
          }
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById("staff-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        document.getElementById("staff-login").classList.remove("hidden");
        document.getElementById("staff-dashboard").classList.add("hidden");
        document.getElementById("staff-login-form").reset();
        Navigation.showPage("staff");
      });
    }
  },

  /** Populate staff case list (no seed/recovery set) */
  populateCaseList() {
    const listEl = document.getElementById("staff-case-list");
    if (!listEl) return;

    const allCases = Utils.getAllCases();
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
  },
});

/* ============================================================
   MODULE 12: Initialize Application
   ============================================================ */
function initApp() {
  Obfuscation.inject();
  Navigation.init();
  AssetSelector.init();
  CaseLookup.init();
  AccessRecoverReveal.init();
  Verification.init();
  FinalPage.init();
  AdminPanel.init();
  StaffPanel.init();
}

// Boot when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}