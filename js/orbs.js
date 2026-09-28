/* ──────────────────────────────────────────────────────────────────
   <thinking-orb> — a framework-free port of the React <ThinkingOrb>
   from thinking-orbs (https://libraries.dev/orbs, MIT). It drives the
   package's own engine (vendored in js/vendor/), so the animations are
   identical; only the React wrapper is replaced by a custom element.

     <thinking-orb state="solving" size="64"></thinking-orb>

   Attributes
     state   working · searching · solving · listening · connecting ·
             weaving · composing · breathing · shaping   (default working)
     size    64 · 32 · 20 — tuned presets, not a scale  (default 64)
     color   optional hex/rgb tint, e.g. "#c9a45c"
     theme   auto · dark · light. auto reads the nearest data-theme:
             "night"/"dark" → light dots; anything else → dark dots
             (the site's default edition is parchment).
     label   optional aria-label

   Load as a module:  <script type="module" src="js/orbs.js"></script>
   Honours prefers-reduced-motion (static frame) and pauses offscreen.
   ────────────────────────────────────────────────────────────────── */

import {
  r as resolvePreset,
  M as MODE_FRAMES,
  p as paintFrame,
} from "./vendor/thinking-orbs-engine.js";

const LABELS = {
  working: "Working…", searching: "Searching…", solving: "Solving…",
  listening: "Listening…", connecting: "Connecting…", weaving: "Weaving…",
  composing: "Composing…", breathing: "Thinking…", shaping: "Shaping…",
};
const SIZES = [64, 32, 20];
const reduced = matchMedia("(prefers-reduced-motion: reduce)");

function parseTint(color) {
  if (!color) return undefined;
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.replace(/./g, (c) => c + c);
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  const fn = color.trim().match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  return fn ? { r: +fn[1], g: +fn[2], b: +fn[3] } : undefined;
}

class ThinkingOrbElement extends HTMLElement {
  static get observedAttributes() { return ["state", "size", "color", "theme"]; }

  connectedCallback() {
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.style.display = "block";
      this.appendChild(this.canvas);
      this.setAttribute("role", "img");
    }
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.sync();
    });
    this.io.observe(this);
    this.onVis = () => this.sync();
    document.addEventListener("visibilitychange", this.onVis);
    this.setup();
  }

  disconnectedCallback() {
    this.stop();
    this.io && this.io.disconnect();
    document.removeEventListener("visibilitychange", this.onVis);
  }

  attributeChangedCallback() {
    if (this.canvas) this.setup();
  }

  setup() {
    this.stop();
    const state = this.getAttribute("state") || "working";
    const want = parseInt(this.getAttribute("size"), 10) || 64;
    const size = SIZES.includes(want) ? want : 64;
    const dpr = Math.min(2, devicePixelRatio || 1);

    this.style.display = "inline-block";
    this.style.width = this.style.height = size + "px";
    this.canvas.style.width = this.canvas.style.height = size + "px";
    this.canvas.width = this.canvas.height = Math.round(size * dpr);
    this.setAttribute("aria-label", this.getAttribute("label") || LABELS[state] || "Loading…");

    const { mode, speed, opts } = resolvePreset(state, size);
    const frameFn = MODE_FRAMES[mode];
    const tint = parseTint(this.getAttribute("color"));
    const dark = this.isDark();
    const ctx = this.canvas.getContext("2d");

    this.draw = (t) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      paintFrame(ctx, frameFn(size, t, opts), dark, tint);
    };
    this.speed = speed;
    this.draw(reduced.matches ? 0.6 : (performance.now() / 1000) * speed);
    this.sync();
  }

  isDark() {
    const theme = this.getAttribute("theme") || "auto";
    if (theme !== "auto") return theme === "dark";
    const host = this.closest("[data-theme]");
    const t = host && host.getAttribute("data-theme");
    return t === "night" || t === "dark";
  }

  // Run only while on screen, in a visible tab, with motion allowed.
  sync() {
    const run = this.visible && !reduced.matches && document.visibilityState !== "hidden";
    if (run && !this.raf) {
      const loop = () => {
        this.draw((performance.now() / 1000) * this.speed);
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    } else if (!run) {
      this.stop();
    }
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
}

if (!customElements.get("thinking-orb")) {
  customElements.define("thinking-orb", ThinkingOrbElement);
}
