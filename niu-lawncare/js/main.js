(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* nav shadow on scroll */
  var nav = document.getElementById("siteNav");
  var onScroll = function () {
    if (window.scrollY > 12) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile menu toggle */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* entrance reveal: fires on load in document order, never scroll-gated
     (scroll-gated opacity reveals leave below-the-fold content invisible
     to full-page captures and slow scrollers) */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 70, 420) + "ms";
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.classList.add("in-view"); });
      });
    });
  }

  /* hero parallax, subtle, scroll + pointer driven */
  var heroMedia = document.getElementById("heroMedia");
  if (heroMedia && !reduceMotion) {
    var img = heroMedia.querySelector("img");
    var raf = null;

    var apply = function (scrollShift, pointerShift) {
      img.style.transform =
        "scale(1.06) translate3d(" + pointerShift.x + "px," + (scrollShift + pointerShift.y) + "px,0)";
    };

    var lastPointer = { x: 0, y: 0 };

    var onScrollParallax = function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var shift = Math.min(window.scrollY * 0.12, 60);
        apply(shift, lastPointer);
        raf = null;
      });
    };
    window.addEventListener("scroll", onScrollParallax, { passive: true });

    window.addEventListener("pointermove", function (e) {
      var vw = window.innerWidth, vh = window.innerHeight;
      lastPointer = {
        x: ((e.clientX / vw) - 0.5) * 16,
        y: ((e.clientY / vh) - 0.5) * 10
      };
      onScrollParallax();
    });
  }
})();
