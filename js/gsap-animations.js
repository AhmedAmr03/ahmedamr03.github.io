/**
 * Ahmed Amr Portfolio — GSAP Animations
 * Requires: gsap.min.js + ScrollTrigger.min.js loaded before this file
 */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     GUARD: make sure GSAP is available
  ───────────────────────────────────────── */
  if (typeof gsap === "undefined") {
    console.warn("GSAP not found. Animations skipped.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────── */

  /**
   * Generic scroll-triggered fade-up for a set of elements.
   * @param {string|Element|NodeList} targets
   * @param {object} scrollTriggerVars
   * @param {object} fromVars   - gsap.from() overrides
   * @param {object} toVars     - gsap.to() / stagger overrides
   */
  function revealOnScroll(targets, scrollTriggerVars, fromVars, toVars) {
    const els = gsap.utils.toArray(targets);
    if (!els.length) return;

    gsap.fromTo(
      els,
      Object.assign({ opacity: 0, y: 48, filter: "blur(6px)" }, fromVars),
      Object.assign(
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: Object.assign(
            {
              trigger: els[0],
              start: "top 88%",
              toggleActions: "play none none none",
            },
            scrollTriggerVars
          ),
        },
        toVars
      )
    );
  }

  /* ─────────────────────────────────────────
     1. PRE-LOADER
  ───────────────────────────────────────── */
  function runPreloader() {
    const preloader = document.getElementById("preloader");
    if (!preloader) return runHero(); // safety: skip to hero if no preloader

    const lineTop    = document.getElementById("preloader-line-top");
    const lineBottom = document.getElementById("preloader-line-bottom");
    const greeting   = preloader.querySelector(".preloader-greeting");
    const name       = preloader.querySelector(".preloader-name");
    const tagline    = preloader.querySelector(".preloader-tagline");
    const barWrap    = preloader.querySelector(".preloader-bar-container");
    const bar        = document.getElementById("preloader-bar");

    // Lock scroll while preloader is active
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: dismissPreloader,
    });

    // Decorative vertical lines grow in
    tl.to([lineTop, lineBottom], {
      height: 60,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
    });

    // Greeting text slides up
    tl.to(
      greeting,
      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
      "-=0.3"
    );

    // Big name slides up
    tl.to(
      name,
      { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
      "-=0.25"
    );

    // Tagline slides up
    tl.to(
      tagline,
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );

    // Loading bar fades in, then fills to 100%
    tl.to(barWrap, { opacity: 1, duration: 0.3, ease: "none" }, "-=0.1");
    tl.to(bar, { width: "100%", duration: 1.1, ease: "power1.inOut" }, "-=0.1");

    // Hold briefly at 100%
    tl.to({}, { duration: 0.35 });

    // Exit phase: fade out background elements except the name
    tl.to(
      [lineTop, tagline, barWrap],
      { opacity: 0, y: -12, duration: 0.35, ease: "power2.in", stagger: 0.05 },
      "exit"
    );
    tl.to(
      [greeting, lineBottom],
      { opacity: 0, y: -10, duration: 0.3, ease: "power2.in" },
      "exit+=0.05"
    );

    // Launch smooth name flight transition into hero section
    tl.call(() => launchNameFlight(name), [], "exit+=0.15");

    // Preloader slides up and away
    tl.to(preloader, {
      yPercent: -100,
      duration: 0.85,
      ease: "expo.inOut",
    }, "exit+=0.2");
  }

  function dismissPreloader() {
    const preloader = document.getElementById("preloader");

    // Re-enable scroll
    document.body.style.overflow = "";

    // Hide from DOM flow & accessibility
    if (preloader) {
      preloader.style.display = "none";
      preloader.setAttribute("aria-hidden", "true");
    }

  }

  /* ─────────────────────────────────────────
     NAME FLIGHT: smoothly move name from
     preloader center → hero h1 position
  ───────────────────────────────────────── */
  var _nameFlightDone = false; // flag so runHero skips re-hiding h1

  function launchNameFlight(nameEl) {
    const heroH1 = document.querySelector("section.relative.min-h-screen h1");

    // Fallback: no hero h1 found → run hero normally
    if (!heroH1) {
      runHero();
      return;
    }

    // ── Snapshot source position (preloader name) ──────────────────
    const fromRect     = nameEl.getBoundingClientRect();
    const fromFontSize = parseFloat(window.getComputedStyle(nameEl).fontSize);

    // Guard: if the name element has no dimensions (hidden/offscreen), skip flight
    if (!fromRect.width || !fromRect.height) {
      heroH1.style.opacity = "";
      runHero();
      return;
    }

    // ── Prepare hero h1 ────────────────────────────────────────────
    // Stop CSS animation so getBoundingClientRect is stable
    heroH1.style.animation = "none";
    heroH1.style.opacity   = "0";
    heroH1.style.transform = "";
    heroH1.style.filter    = "";

    const toRect     = heroH1.getBoundingClientRect();
    const toFontSize = parseFloat(window.getComputedStyle(heroH1).fontSize);

    // ── Hard safety net: if anything goes wrong, always restore h1 ──
    var _flightComplete = false;
    var _safetyTimer = setTimeout(function () {
      if (_flightComplete) return;
      _flightComplete = true;
      if (clone && clone.parentNode) clone.remove();
      heroH1.style.opacity = "";  // restore to natural value
      _nameFlightDone = true;
      runHero();
    }, 3000);

    // ── Build fixed-position flying clone ──────────────────────────
    const clone = document.createElement("div");
    clone.setAttribute("aria-hidden", "true");
    clone.innerHTML = nameEl.innerHTML;

    Object.assign(clone.style, {
      position:      "fixed",
      top:           fromRect.top  + "px",
      left:          fromRect.left + "px",
      width:         fromRect.width + "px",
      margin:        "0",
      padding:       "0",
      zIndex:        "100000",
      pointerEvents: "none",
      fontFamily:    "'Playfair Display', serif",
      fontStyle:     "italic",
      fontWeight:    "700",
      color:         "#f0f2f5",
      lineHeight:    "1.1",
      fontSize:      fromFontSize + "px",
      textAlign:     "center",
      whiteSpace:    "nowrap",
      willChange:    "top, left, font-size",
    });

    // Teal colour for the "Amr" span inside the clone
    const cloneSpan = clone.querySelector("span");
    if (cloneSpan) {
      cloneSpan.style.color      = "#20b2a6";
      cloneSpan.style.textShadow = "0 0 40px rgba(32, 178, 166, 0.6)";
    }

    document.body.appendChild(clone);

    // Hide original inside the sliding preloader panel
    gsap.set(nameEl, { opacity: 0 });

    // ── Fly the clone to the hero h1 ───────────────────────────────
    gsap.to(clone, {
      top:      toRect.top,
      left:     toRect.left,
      fontSize: toFontSize,
      duration: 1.05,
      ease:     "expo.inOut",
      onComplete: function () {
        if (_flightComplete) return; // safety timer already fired
        _flightComplete = true;
        clearTimeout(_safetyTimer);
        _nameFlightDone = true;

        // Instant handover: lock name permanently in hero section without any fade-out or disappearance
        heroH1.style.opacity = "1";
        clone.remove();

        // Kick off the rest of the hero elements
        runHero();
      },
    });
  }


  /* ─────────────────────────────────────────
     2. HERO SECTION — staggered reveal
  ───────────────────────────────────────── */
  function runHero() {
    const heroSection = document.querySelector("section.relative.min-h-screen");
    const heroLeftCol = heroSection && heroSection.querySelector(".space-y-8");
    const heroH1      = heroSection && heroSection.querySelector("h1");

    // Build children list — if the name already flew in, exclude the h1's
    // parent (.space-y-4) from the initial hide+stagger to avoid a flash
    const heroLeftChildren = heroLeftCol
      ? Array.from(heroLeftCol.children).filter(el => {
          if (_nameFlightDone && heroH1 && el.contains(heroH1)) return false;
          return true;
        })
      : [];

    // Right column: profile card
    const heroRight = document.querySelector(".relative.animate-fade-in.animation-delay-300");

    // Set initial hidden state (suppress CSS animation-delay conflicts)
    gsap.set(heroLeftChildren, { opacity: 0, y: 36, filter: "blur(8px)" });
    if (heroRight) gsap.set(heroRight, { opacity: 0, x: 40, filter: "blur(8px)" });

    const tl = gsap.timeline({ delay: 0.1 });

    if (heroLeftChildren.length) {
      tl.to(heroLeftChildren, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.14,
      });
    }

    if (heroRight) {
      tl.to(
        heroRight,
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "expo.out",
        },
        heroLeftChildren.length ? "-=0.5" : "0"
      );
    }

    // Skills marquee tape fade-in
    const marqueeWrap = document.querySelector(".mt-20.animate-fade-in");
    if (marqueeWrap) {
      gsap.set(marqueeWrap, { opacity: 0, y: 24 });
      tl.to(
        marqueeWrap,
        { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
        "-=0.3"
      );
    }

    // Scroll arrow
    const scrollArrow = document.querySelector(".absolute.bottom-8");
    if (scrollArrow) {
      gsap.set(scrollArrow, { opacity: 0 });
      tl.to(scrollArrow, { opacity: 1, duration: 0.5, ease: "none" }, "-=0.1");
    }

    // Register scroll animations for remaining sections once hero is done
    tl.call(registerScrollAnimations);
  }

  /* ─────────────────────────────────────────
     3. SCROLL-TRIGGERED ANIMATIONS
  ───────────────────────────────────────── */
  function registerScrollAnimations() {

    /* ════════════════════════════════════════════════════
       ABOUT
       Targets the label, h2 title, and glass card directly.
    ════════════════════════════════════════════════════ */
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const aboutLabel = aboutSection.querySelector(".about-section-label");
      const aboutTitle = aboutSection.querySelector(".about-section-title");
      const aboutCard  = aboutSection.querySelector(".about-card");
      const aboutEls   = [aboutLabel, aboutTitle, aboutCard].filter(Boolean);

      if (aboutEls.length) {
        gsap.set(aboutEls, { opacity: 0, y: 44, filter: "blur(8px)" });

        gsap.to(aboutEls, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "expo.out",
          stagger: 0.22,
          scrollTrigger: {
            trigger: aboutSection,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });
      }
    }

    /* ════════════════════════════════════════════════════
       EDUCATION
       Strategy:
         1. Animate h2 heading on its own.
         2. Draw the vertical timeline line (scaleY).
         3. Animate each .relative timeline-item container
            as a WHOLE (slide from left or right based on
            index). Children become visible automatically.
    ════════════════════════════════════════════════════ */
    const educationSection = document.getElementById("education");
    if (educationSection) {

      // 1. Section heading
      const eduH2 = educationSection.querySelector("h2");
      if (eduH2) {
        gsap.set(eduH2, { opacity: 0, y: 36, filter: "blur(5px)" });
        gsap.to(eduH2, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.7, ease: "power3.out",
          scrollTrigger: {
            trigger: educationSection,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }

      // 2. Vertical timeline line grows from top
      const timelineLine = educationSection.querySelector(".timeline-glow");
      if (timelineLine) {
        gsap.set(timelineLine, { scaleY: 0, transformOrigin: "top center", opacity: 0 });
        gsap.to(timelineLine, {
          scaleY: 1, opacity: 1,
          duration: 1.3, ease: "power2.inOut",
          scrollTrigger: {
            trigger: educationSection.querySelector(".space-y-12"),
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }

      // 3. Each full timeline item — animate the CONTAINER
      const eduItems = Array.from(
        educationSection.querySelectorAll(".space-y-12 > .relative")
      );
      eduItems.forEach((item, i) => {
        // Even index → slide from left; odd → from right
        const xFrom = i % 2 === 0 ? -70 : 70;
        gsap.set(item, { opacity: 0, x: xFrom, filter: "blur(6px)" });
        gsap.to(item, {
          opacity: 1, x: 0, filter: "blur(0px)",
          duration: 0.8, ease: "expo.out",
          scrollTrigger: {
            trigger: item,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      });
    }

    /* ════════════════════════════════════════════════════
       CERTIFICATES
       (Kept ultra-lightweight to ensure zero lag with slider)
    ════════════════════════════════════════════════════ */
    const certsSection = document.getElementById("certificates");
    if (certsSection) {
      // Header children
      const certHeader = certsSection.querySelector(".text-center");
      if (certHeader) {
        const certKids = Array.from(certHeader.children);
        gsap.set(certKids, { opacity: 0, y: 20 });
        gsap.to(certKids, {
          opacity: 1, y: 0,
          duration: 0.6, ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: certsSection,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

      // Tab buttons
      const tabBtns = Array.from(certsSection.querySelectorAll(".cert-tab-btn"));
      if (tabBtns.length) {
        gsap.set(tabBtns, { opacity: 0, y: 15 });
        gsap.to(tabBtns, {
          opacity: 1, y: 0,
          duration: 0.5, ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: certsSection.querySelector(".flex.justify-center.mb-10"),
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }
    }

    /* ════════════════════════════════════════════════════
       AWARDS
       Strategy: header kids stagger up, then each card
       container slides up with scale — children auto-visible.
    ════════════════════════════════════════════════════ */
    const awardsSection = document.getElementById("awards");
    if (awardsSection) {

      // Header
      const awardsHeader = awardsSection.querySelector(".text-center");
      if (awardsHeader) {
        const headerKids = Array.from(awardsHeader.children);
        gsap.set(headerKids, { opacity: 0, y: 30, filter: "blur(4px)" });
        gsap.to(headerKids, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.65, ease: "power3.out",
          stagger: 0.16,
          scrollTrigger: {
            trigger: awardsSection,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });
      }

      // Award card CONTAINERS — animate the whole div
      const awardCards = Array.from(awardsSection.querySelectorAll(".grid > div"));
      if (awardCards.length) {
        gsap.set(awardCards, { opacity: 0, y: 65, scale: 0.96, filter: "blur(7px)" });
        gsap.to(awardCards, {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
          duration: 0.85, ease: "expo.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: awardsSection.querySelector(".grid"),
            start: "top 84%",
            toggleActions: "play none none none",
          },
        });
      }
    }

    /* ════════════════════════════════════════════════════
       CONTACT
    ════════════════════════════════════════════════════ */
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      const contactHeader = contactSection.querySelector(".text-center");
      if (contactHeader) {
        const headerKids = Array.from(contactHeader.children);
        gsap.set(headerKids, { opacity: 0, y: 28, filter: "blur(4px)" });
        gsap.to(headerKids, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.6, ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: contactSection,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });
      }

      const contactPanels = Array.from(
        contactSection.querySelectorAll(".grid.lg\\:grid-cols-2 > div")
      );
      if (contactPanels.length) {
        gsap.set(contactPanels, { opacity: 0, y: 55, filter: "blur(6px)" });
        gsap.to(contactPanels, {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 0.85, ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: contactSection.querySelector(".grid.lg\\:grid-cols-2"),
            start: "top 84%",
            toggleActions: "play none none none",
          },
        });
      }
    }

    /* ════════════════════════════════════════════════════
       FOOTER
    ════════════════════════════════════════════════════ */
    const footer = document.querySelector("footer");
    if (footer) {
      gsap.set(footer, { opacity: 0, y: 30 });
      gsap.to(footer, {
        opacity: 1, y: 0,
        duration: 0.7, ease: "power2.out",
        scrollTrigger: {
          trigger: footer,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      });
    }

    /* ════════════════════════════════════════════════════
       FAILSAFE: after 4 s, force all sections visible
       in case ScrollTrigger didn't fire (slow network, 
       already-scrolled page, reduced-motion, etc.)
    ════════════════════════════════════════════════════ */
    setTimeout(function () {
      ScrollTrigger.getAll().forEach(function (st) {
        if (!st.isActive) {
          // Force the animation to its end state
          st.animation && st.animation.progress(1);
        }
      });
      // Also force refresh
      ScrollTrigger.refresh();
    }, 4000);
  } // end registerScrollAnimations


  /* ─────────────────────────────────────────
     BOOT
  ───────────────────────────────────────── */
  // Wait for fonts + layout before starting
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runPreloader);
  } else {
    // DOM already ready (script loaded async / defer)
    runPreloader();
  }
})();
