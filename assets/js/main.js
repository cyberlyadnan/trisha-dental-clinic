/* =========================================================
   TRISHTA DENTAL CLINIC — MAIN JAVASCRIPT
   Vanilla JS · Bootstrap 5 · AOS · Swiper · GSAP
   ---------------------------------------------------------
   TABLE OF CONTENTS
   01. Page Loader
   02. Sticky Header + Scroll Progress
   03. Mobile Navigation Drawer
   04. Active Nav Link by Page
   05. AOS Init
   06. GSAP Hero Intro Animation
   07. Counter Animation (CountUp)
   08. FAQ Accordion
   09. Gallery Filter + Lightbox
   10. Testimonials Swiper
   11. Smooth Anchor Scroll
   12. Contact Form Handler
   13. Back-to-top + FAB visibility
   ========================================================= */

(function () {
  "use strict";

  /* =====================================================
     01. PAGE LOADER
     ===================================================== */
  window.addEventListener("load", function () {
    const loader = document.querySelector(".page-loader");
    if (loader) {
      setTimeout(() => loader.classList.add("hidden"), 400);
    }
    // Init AOS after load so offsets are correct
    if (window.AOS) AOS.refresh();
  });

  document.addEventListener("DOMContentLoaded", function () {
    /* =====================================================
       05. AOS INIT
       ===================================================== */
    if (window.AOS) {
      AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 80,
        disable: () => window.innerWidth < 480 ? false : false,
      });
    }

    /* =====================================================
       02. STICKY HEADER + SCROLL PROGRESS
       ===================================================== */
    const header = document.querySelector(".site-header");
    const progress = document.querySelector(".scroll-progress");

    function onScroll() {
      const y = window.scrollY;
      if (header) header.classList.toggle("scrolled", y > 30);

      if (progress) {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? (y / docH) * 100 : 0;
        progress.style.width = pct + "%";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* =====================================================
       03. MOBILE NAVIGATION DRAWER
       ===================================================== */
    const toggle = document.querySelector(".nav-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    const backdrop = document.querySelector(".nav-backdrop");

    function openNav() {
      toggle?.classList.add("open");
      mobileNav?.classList.add("open");
      backdrop?.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeNav() {
      toggle?.classList.remove("open");
      mobileNav?.classList.remove("open");
      backdrop?.classList.remove("open");
      document.body.style.overflow = "";
    }
    toggle?.addEventListener("click", function () {
      mobileNav?.classList.contains("open") ? closeNav() : openNav();
    });
    backdrop?.addEventListener("click", closeNav);
    mobileNav?.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", closeNav)
    );
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    /* =====================================================
       04. ACTIVE NAV LINK BY PAGE
       ===================================================== */
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, .mobile-nav a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });

    /* =====================================================
       06. GSAP HERO INTRO ANIMATION
       ===================================================== */
    if (window.gsap) {
      const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });
      const heroEls = document.querySelectorAll("[data-hero]");
      if (heroEls.length) {
        heroTL.to("[data-hero='eyebrow']", { y: 0, opacity: 1, duration: 0.6 })
              .to("[data-hero='title']", { y: 0, opacity: 1, duration: 0.9 }, "-=0.3")
              .to("[data-hero='sub']", { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
              .to("[data-hero='cta']", { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
              .to("[data-hero='trust']", { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
              .to("[data-hero='visual']", { x: 0, opacity: 1, duration: 1 }, "-=0.9")
              .to("[data-hero='float']", { opacity: 1, duration: 0.6, stagger: 0.15 }, "-=0.4");
      }
    }

    /* =====================================================
       07. COUNTER ANIMATION (COUNT UP)
       ===================================================== */
    const counters = document.querySelectorAll("[data-count]");
    if (counters.length && "IntersectionObserver" in window) {
      const counterObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              counterObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((c) => counterObs.observe(c));
    }
    function animateCount(el) {
      const target = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      const dur = 1800;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        const decimals = target % 1 !== 0 ? 1 : 0;
        el.innerHTML = val.toFixed(decimals) + (suffix ? `<span class="suffix">${suffix}</span>` : "");
        if (p < 1) requestAnimationFrame(tick);
        else el.innerHTML = target.toFixed(decimals) + (suffix ? `<span class="suffix">${suffix}</span>` : "");
      }
      requestAnimationFrame(tick);
    }

    /* =====================================================
       08. FAQ ACCORDION
       ===================================================== */
    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      q?.addEventListener("click", function () {
        const isOpen = item.classList.contains("open");
        // close siblings
        document.querySelectorAll(".faq-item").forEach((sib) => {
          sib.classList.remove("open");
          const sibA = sib.querySelector(".faq-a");
          if (sibA) sibA.style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });

    /* =====================================================
       09. GALLERY FILTER + LIGHTBOX
       ===================================================== */
    const filterBtns = document.querySelectorAll(".gfilter-btn");
    const galleryItems = document.querySelectorAll(".masonry-item");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        filterBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        const filter = this.getAttribute("data-filter");
        galleryItems.forEach((item) => {
          const cat = item.getAttribute("data-cat");
          const show = filter === "all" || cat === filter;
          if (show) {
            item.style.display = "";
            requestAnimationFrame(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            });
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.9)";
            setTimeout(() => (item.style.display = "none"), 300);
          }
        });
      });
    });

    // Lightbox
    const lightbox = document.querySelector(".lightbox");
    const lbImg = document.querySelector(".lightbox img");
    let currentLb = -1;
    const lbSources = Array.from(galleryItems).map((it) => {
      const img = it.querySelector("img");
      return img ? img.getAttribute("src") : "";
    });

    function openLightbox(index) {
      if (!lightbox || !lbSources.length) return;
      currentLb = index;
      lbImg.src = lbSources[index];
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lightbox?.classList.remove("open");
      document.body.style.overflow = "";
    }
    function lbStep(dir) {
      currentLb = (currentLb + dir + lbSources.length) % lbSources.length;
      lbImg.src = lbSources[currentLb];
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener("click", () => openLightbox(i));
    });
    document.querySelector(".lb-close")?.addEventListener("click", closeLightbox);
    document.querySelector(".lb-prev")?.addEventListener("click", () => lbStep(-1));
    document.querySelector(".lb-next")?.addEventListener("click", () => lbStep(1));
    lightbox?.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox?.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "ArrowRight") lbStep(1);
    });

    /* =====================================================
       10. TESTIMONIALS SWIPER
       ===================================================== */
    if (window.Swiper && document.querySelector(".testi-swiper")) {
      const testiSwiper = new Swiper(".testi-swiper", {
        slidesPerView: 1,
        spaceBetween: 24,
        grabCursor: true,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: ".testi-pagination", clickable: true },
        navigation: {
          nextEl: ".testi-next",
          prevEl: ".testi-prev",
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        },
      });
    }

    /* =====================================================
       11. SMOOTH ANCHOR SCROLL
       ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const id = this.getAttribute("href");
        if (id.length > 1) {
          const target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      });
    });

    /* =====================================================
       12. CONTACT FORM HANDLER
       ===================================================== */
    const contactForm = document.querySelector("#contactForm");
    contactForm?.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector("button[type='submit']");
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Request Sent!';
        contactForm.reset();
        showToast("Thank you! We'll call you back shortly to confirm your appointment.");
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = original;
        }, 3000);
      }, 1200);
    });

    // Newsletter form
    document.querySelector(".footer-newsletter")?.addEventListener("submit", function (e) {
      e.preventDefault();
      this.querySelector("input").value = "";
      showToast("Subscribed! Watch your inbox for smile tips.");
    });

    /* =====================================================
       13. TOAST NOTIFICATION
       ===================================================== */
    function showToast(msg) {
      let toast = document.querySelector(".app-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "app-toast";
        document.body.appendChild(toast);
      }
      toast.innerHTML = '<i class="fas fa-circle-check"></i> ' + msg;
      toast.classList.add("show");
      clearTimeout(toast._t);
      toast._t = setTimeout(() => toast.classList.remove("show"), 4000);
    }

    /* =====================================================
         FOOTER YEAR
       ===================================================== */
    const yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
