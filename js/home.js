/* ──────────────────────────────────────────────────────────────────
   Home page motion layer. Everything here is progressive: without
   this file (or with reduced motion) the page is complete and static.

     1. Inertial smooth scrolling (Lenis, loaded from the CDN)
     2. Scroll reveals + press-style split headlines
     3. Live dateline clock
     4. Word-embedding constellation behind the name
     5. Magnetic buttons
   ────────────────────────────────────────────────────────────────── */

(function () {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ── 1. Smooth scrolling ──────────────────────────────────────────
  let lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, anchors: { offset: -64 } });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }

  // ── 2. Reveals ───────────────────────────────────────────────────
  // Wrap each headline line's content so it can slide up inside its mask.
  document.querySelectorAll("[data-split] .line").forEach((line) => {
    const idx = Array.prototype.indexOf.call(line.parentElement.children, line);
    line.innerHTML = `<span style="--i:${idx}">${line.innerHTML}</span>`;
  });

  // Stagger siblings that reveal together.
  document.querySelectorAll(".identity, .record, .about-story").forEach((group) => {
    group.querySelectorAll(":scope > [data-reveal]").forEach((el, i) => {
      el.style.setProperty("--d", `${0.12 + i * 0.08}s`);
    });
  });

  const reveal = (el) => el.classList.add("is-in");
  let io = null;
  if ("IntersectionObserver" in window && !reduceMotion) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  }
  function observeAll() {
    document.querySelectorAll("[data-reveal]:not(.is-in), [data-split]:not(.is-in)").forEach((el) => {
      io ? io.observe(el) : reveal(el);
    });
  }
  observeAll();
  document.addEventListener("gallery:rendered", observeAll);

  // ── 3. Dateline clock (Madrid time) ──────────────────────────────
  const dateEl = document.getElementById("dl-date");
  const timeEl = document.getElementById("dl-time");
  const tz = "Europe/Madrid";
  const fmtDate = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const fmtTime = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZoneName: "short" });
  function tick() {
    const now = new Date();
    if (dateEl) dateEl.textContent = fmtDate.format(now);
    if (timeEl) timeEl.textContent = fmtTime.format(now);
  }
  tick();
  setInterval(tick, 1000);

  // ── 4. Embedding constellation ───────────────────────────────────
  // Points drift like tokens in a vector space; neighbours within a
  // radius are joined, and the pointer gently pulls the field.
  const canvas = document.querySelector(".embedding-field");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0, pts = [], visible = true;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 110;

    function size() {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, (w * h) / 9000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.2 + 0.5,
        gold: Math.random() < 0.18,
      }));
    }

    function frame() {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (const p of pts) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160) { p.vx += dx * 0.000025; p.vy += dy * 0.000025; }
          p.vx *= 0.995; p.vy *= 0.995;
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        ctx.lineWidth = 0.6;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const a = pts[i], b = pts[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < LINK) {
              ctx.strokeStyle = `rgba(201,164,92,${(1 - d / LINK) * 0.22})`;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
        for (const p of pts) {
          ctx.fillStyle = p.gold ? "rgba(201,164,92,0.85)" : "rgba(236,229,214,0.45)";
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }

    size();
    addEventListener("resize", size, { passive: true });
    addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    // Pause drawing when the hero is off screen.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    }
    requestAnimationFrame(() => canvas.classList.add("is-on"));
    frame();
  }

  // ── 5. Magnetic buttons ──────────────────────────────────────────
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) * 0.18;
        const my = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.transform = `translate(${mx}px, ${my}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }
})();
