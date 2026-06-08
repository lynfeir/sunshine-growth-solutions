/* =========================================================
   Sunshine Growth Solutions — interactions
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Footer year ---------- */
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  const header = $("[data-header]");
  const onScroll = () => {
    if (!header) return;
    header.toggleAttribute("data-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const toggle = $("[data-nav-toggle]");
  const menu = $("[data-nav-menu]");

  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  };
  const openMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = [
    ".hero-inner > *",
    ".section-head",
    ".card",
    ".about-portrait",
    ".about-copy",
    ".step",
    ".stat",
    ".quote",
    ".cta-inner > *",
    ".contact-copy",
    ".contact-form-wrap",
  ];

  const revealEls = [];
  revealTargets.forEach((sel) => {
    $$(sel).forEach((el, i) => {
      el.setAttribute("data-reveal", "");
      const group = el.parentElement;
      const siblings = group ? Array.from(group.children).indexOf(el) : i;
      el.setAttribute("data-delay", String(Math.min(Math.max(siblings, 0), 3)));
      revealEls.push(el);
    });
  });

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Scrollspy (active nav link) ---------- */
  const navLinks = $$(".nav-menu a[href^='#']");
  const linkFor = (id) => navLinks.find((a) => a.getAttribute("href") === "#" + id);
  const sections = navLinks
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("is-active"));
            const link = linkFor(entry.target.id);
            if (link) link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Animated stat counters ---------- */
  const stats = $$(".stat-num[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) {
      el.textContent = prefix + target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (stats.length && "IntersectionObserver" in window) {
    const statObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    stats.forEach((s) => statObs.observe(s));
  } else {
    stats.forEach((el) => {
      el.textContent = (el.dataset.prefix || "") + el.dataset.count + (el.dataset.suffix || "");
    });
  }

  /* ---------- Contact form ---------- */
  const form = $("#contact-form");
  if (!form) return;

  const statusEl = $("#form-status");
  const submitBtn = $("[data-submit]", form);
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please tell me your name."),
    email: (v) =>
      v.trim() === ""
        ? "An email lets me reply to you."
        : EMAIL_RE.test(v.trim())
        ? ""
        : "Please enter a valid email address.",
    phone: (v) =>
      v.trim() === "" || v.replace(/[^\d]/g, "").length >= 7
        ? ""
        : "That phone number looks a little short.",
    message: (v) => (v.trim().length >= 10 ? "" : "A sentence or two helps me prepare."),
  };

  const setError = (field, msg) => {
    const input = form.elements[field];
    const errEl = $(`[data-error-for="${field}"]`, form);
    if (!input) return;
    if (msg) {
      input.setAttribute("aria-invalid", "true");
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add("show");
      }
    } else {
      input.removeAttribute("aria-invalid");
      if (errEl) {
        errEl.textContent = "";
        errEl.classList.remove("show");
      }
    }
  };

  const validateField = (field) => {
    const input = form.elements[field];
    if (!input || !validators[field]) return true;
    const msg = validators[field](input.value);
    setError(field, msg);
    return !msg;
  };

  // Validate on blur / live-clear on input
  Object.keys(validators).forEach((field) => {
    const input = form.elements[field];
    if (!input) return;
    input.addEventListener("blur", () => validateField(field));
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  const setStatus = (msg, kind) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.remove("is-success", "is-error", "show");
    if (msg) {
      statusEl.classList.add("show");
      if (kind) statusEl.classList.add("is-" + kind);
    }
  };

  const setLoading = (loading) => {
    if (!submitBtn) return;
    submitBtn.classList.toggle("is-loading", loading);
    submitBtn.disabled = loading;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("", null);

    // Honeypot — silently succeed for bots
    if (form.elements.botcheck && form.elements.botcheck.checked) {
      setStatus("Thanks! Your message has been sent.", "success");
      form.reset();
      return;
    }

    const fields = ["name", "email", "phone", "message"];
    let firstInvalid = null;
    fields.forEach((field) => {
      const ok = validateField(field);
      if (!ok && !firstInvalid) firstInvalid = form.elements[field];
    });

    if (firstInvalid) {
      firstInvalid.focus();
      setStatus("Please fix the highlighted fields above.", "error");
      return;
    }

    const accessKey = form.elements.access_key ? form.elements.access_key.value : "";
    if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      setStatus(
        "Almost there! This form needs a free Web3Forms key to deliver mail (see README). Meanwhile, email hello@sunshinegrowthsolutions.com.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus("Thank you! Your message is on its way — I'll be in touch within one business day. ☀", "success");
        form.reset();
      } else {
        setStatus(
          (data && data.message) || "Something went wrong sending your message. Please email hello@sunshinegrowthsolutions.com.",
          "error"
        );
      }
    } catch (err) {
      setStatus("A network hiccup stopped your message. Please try again, or email hello@sunshinegrowthsolutions.com.", "error");
    } finally {
      setLoading(false);
    }
  });
})();
