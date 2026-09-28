/* ──────────────────────────────────────────────────────────────────
   Hero painting roster.

   The scanner bar sweeps the canvas once; when a pass finishes the
   painting changes. Each entry carries its own annotations (positioned
   in % of the canvas, so they land on the right part of the picture),
   its caption, and the --edge colour sampled from its own borders —
   the page background follows the painting on screen.

   Every plate is a landscape painting cropped to the portrait frame,
   which is why the figure carries a "cropped to frame" note.

   To add a painting: drop a 924×1072 .webp in images/, add an entry
   here, and give it annotations. Nothing else needs to change.
   ────────────────────────────────────────────────────────────────── */

window.PAINTINGS = [
  {
    src: "images/hero-pearl-earring.webp",
    edge: "#0f1013",
    cropped: false,
    alt: {
      en: "Girl with a Pearl Earring — Johannes Vermeer, c.1665",
      es: "La joven de la perla — Johannes Vermeer, c.1665",
    },
    caption: {
      en: "VERMEER · C.1665 · MAURITSHUIS, DEN HAAG",
      es: "VERMEER · C.1665 · MAURITSHUIS, LA HAYA",
    },
    annotations: [
      { pos: "top:12.7%; left:3.5%",
        label: { en: "ENTITY", es: "ENTIDAD" },
        value: { en: "subject · PERSON", es: "sujeto · PERSONA" },
        meta:  { en: "conf: 0.97", es: "conf: 0,97" } },
      { pos: "top:35.8%; left:6.9%", delay: 0.9, dur: 4.0,
        label: { en: "GAZE_VECTOR", es: "VECTOR_MIRADA" },
        value: { en: "direct · viewer", es: "directa · espectador" },
        meta:  { en: "θ: 0.02 rad", es: "θ: 0,02 rad" } },
      { pos: "top:60%; left:25%", delay: 0.4, dur: 3.7,
        label: { en: "SENTIMENT", es: "SENTIMIENTO" },
        value: { en: "neutral · longing", es: "neutro · anhelo" },
        bars: [22, 16, 8] },
      { pos: "bottom:14%; left:36%", delay: 1.3, dur: 4.4,
        label: { en: "OBJECT", es: "OBJETO" },
        value: { en: "pearl earring", es: "pendiente de perla" },
        meta:  { en: "status_marker: 1", es: "marcador_estatus: 1" } },
    ],
  },

  {
    src: "images/hero-juana-la-loca.webp",
    edge: "#191912",
    cropped: true,
    alt: {
      en: "Doña Juana la Loca — Francisco Pradilla Ortiz, 1877",
      es: "Doña Juana la Loca — Francisco Pradilla Ortiz, 1877",
    },
    caption: {
      en: "PRADILLA · 1877 · MUSEO DEL PRADO, MADRID",
      es: "PRADILLA · 1877 · MUSEO DEL PRADO, MADRID",
    },
    annotations: [
      { pos: "top:11%; left:4%",
        label: { en: "ENTITY", es: "ENTIDAD" },
        value: { en: "Juana I · PERSON", es: "Juana I · PERSONA" },
        meta:  { en: "conf: 0.94", es: "conf: 0,94" } },
      { pos: "top:33%; left:52%", delay: 0.9, dur: 4.0,
        label: { en: "GAZE_VECTOR", es: "VECTOR_MIRADA" },
        value: { en: "averted · downward", es: "esquiva · hacia abajo" },
        meta:  { en: "θ: 0.41 rad", es: "θ: 0,41 rad" } },
      { pos: "top:57%; left:5%", delay: 0.4, dur: 3.7,
        label: { en: "SENTIMENT", es: "SENTIMIENTO" },
        value: { en: "grief · vigil", es: "duelo · vela" },
        bars: [26, 11, 5] },
      { pos: "bottom:17%; left:30%", delay: 1.3, dur: 4.4,
        label: { en: "OBJECT", es: "OBJETO" },
        value: { en: "coffin · candles", es: "féretro · cirios" },
        meta:  { en: "ritual_marker: 1", es: "marcador_ritual: 1" } },
    ],
  },

  {
    src: "images/hero-rendicion-breda.webp",
    edge: "#1a1612",
    cropped: true,
    alt: {
      en: "The Surrender of Breda — Diego Velázquez, 1635",
      es: "La rendición de Breda — Diego Velázquez, 1635",
    },
    caption: {
      en: "VELÁZQUEZ · 1635 · MUSEO DEL PRADO, MADRID",
      es: "VELÁZQUEZ · 1635 · MUSEO DEL PRADO, MADRID",
    },
    annotations: [
      { pos: "top:14%; right:5%",
        label: { en: "ENTITY", es: "ENTIDAD" },
        value: { en: "Spínola · PERSON", es: "Spínola · PERSONA" },
        meta:  { en: "conf: 0.91", es: "conf: 0,91" } },
      { pos: "top:36%; left:4%", delay: 0.9, dur: 4.0,
        label: { en: "GAZE_VECTOR", es: "VECTOR_MIRADA" },
        value: { en: "mutual · level", es: "mutua · a la misma altura" },
        meta:  { en: "θ: 0.06 rad", es: "θ: 0,06 rad" } },
      { pos: "top:58%; left:26%", delay: 0.4, dur: 3.7,
        label: { en: "SENTIMENT", es: "SENTIMIENTO" },
        value: { en: "clemency · restraint", es: "clemencia · contención" },
        bars: [19, 19, 9] },
      { pos: "bottom:15%; left:6%", delay: 1.3, dur: 4.4,
        label: { en: "OBJECT", es: "OBJETO" },
        value: { en: "key of the city", es: "llave de la ciudad" },
        meta:  { en: "power_transfer: 1", es: "traspaso_poder: 1" } },
    ],
  },

  {
    src: "images/hero-muerte-cesar.webp",
    edge: "#1a1212",
    cropped: true,
    alt: {
      en: "The Murder of Caesar — Karl Theodor von Piloty, 1865",
      es: "El asesinato de Julio César — Karl Theodor von Piloty, 1865",
    },
    caption: {
      en: "VON PILOTY · 1865 · NIEDERSÄCHSISCHES LANDESMUSEUM",
      es: "VON PILOTY · 1865 · NIEDERSÄCHSISCHES LANDESMUSEUM",
    },
    annotations: [
      { pos: "top:12%; right:4%",
        label: { en: "ENTITY", es: "ENTIDAD" },
        value: { en: "Caesar · PERSON", es: "César · PERSONA" },
        meta:  { en: "conf: 0.96", es: "conf: 0,96" } },
      { pos: "top:34%; left:4%", delay: 0.9, dur: 4.0,
        label: { en: "COREF_CHAIN", es: "CADENA_COREF" },
        value: { en: "conspirators · 8", es: "conspiradores · 8" },
        meta:  { en: "cluster: senate", es: "clúster: senado" } },
      { pos: "top:60%; left:3%", delay: 0.4, dur: 3.7,
        label: { en: "SENTIMENT", es: "SENTIMIENTO" },
        value: { en: "betrayal · alarm", es: "traición · alarma" },
        bars: [28, 14, 4] },
      { pos: "bottom:13%; left:34%", delay: 1.3, dur: 4.4,
        label: { en: "OBJECT", es: "OBJETO" },
        value: { en: "petition scroll", es: "rollo de peticiones" },
        meta:  { en: "pretext: 1", es: "pretexto: 1" } },
    ],
  },

  {
    src: "images/hero-antonio-cleopatra.webp",
    edge: "#1a1612",
    cropped: true,
    alt: {
      en: "The Meeting of Antony and Cleopatra — Sir Lawrence Alma-Tadema, 1885",
      es: "El encuentro de Marco Antonio y Cleopatra — Sir Lawrence Alma-Tadema, 1885",
    },
    caption: {
      en: "ALMA-TADEMA · 1885 · PRIVATE COLLECTION",
      es: "ALMA-TADEMA · 1885 · COLECCIÓN PRIVADA",
    },
    annotations: [
      { pos: "top:16%; right:4%",
        label: { en: "ENTITY", es: "ENTIDAD" },
        value: { en: "Cleopatra VII · PERSON", es: "Cleopatra VII · PERSONA" },
        meta:  { en: "conf: 0.93", es: "conf: 0,93" } },
      { pos: "top:36%; left:3%", delay: 0.9, dur: 4.0,
        label: { en: "GAZE_VECTOR", es: "VECTOR_MIRADA" },
        value: { en: "appraising · held", es: "evaluadora · sostenida" },
        meta:  { en: "θ: 0.18 rad", es: "θ: 0,18 rad" } },
      { pos: "top:58%; left:6%", delay: 0.4, dur: 3.7,
        label: { en: "SENTIMENT", es: "SENTIMIENTO" },
        value: { en: "composure · power", es: "aplomo · poder" },
        bars: [24, 18, 7] },
      { pos: "bottom:16%; left:33%", delay: 1.3, dur: 4.4,
        label: { en: "OBJECT", es: "OBJETO" },
        value: { en: "gilded barge", es: "barca dorada" },
        meta:  { en: "staging: 1", es: "puesta_en_escena: 1" } },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────
   The rotation itself.

   One sweep of the scanner = one plate. We listen for the scan line's
   `animationiteration` (the moment it wraps back to the top) and swap
   the painting under it, so the change always lands between passes and
   never mid-sweep. The new plate is decoded before it is shown, and
   the old one is removed once it has faded out.

   With reduced motion the scan line is hidden, so nothing rotates —
   the page keeps the Vermeer that is already in the markup.
   ────────────────────────────────────────────────────────────────── */

(function () {
  const roster = window.PAINTINGS || [];
  const stack = document.getElementById("plate-stack");
  const scan = document.querySelector(".scan-line");
  const annotEl = document.getElementById("plate-annotations");
  const captionEl = document.getElementById("plate-caption");
  const noteEl = document.getElementById("plate-note");
  if (!roster.length || !stack) return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lang = () => (window.i18n ? window.i18n.lang : "en");
  const pick = (v) => (v && typeof v === "object" ? v[lang()] || v.en : v);

  let i = 0;
  let visible = true;

  // ── Chrome that sits on top of the plate (annotations, caption) ──
  function paintChrome(p) {
    if (captionEl) captionEl.textContent = pick(p.caption);
    if (noteEl) noteEl.hidden = !p.cropped;

    if (!annotEl) return;
    annotEl.innerHTML = "";
    p.annotations.forEach((a) => {
      const el = document.createElement("div");
      el.className = "nlp-annotation";
      el.style.cssText = a.pos;
      if (a.delay) el.style.animationDelay = a.delay + "s";
      if (a.dur) el.style.animationDuration = a.dur + "s";

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = pick(a.label);
      el.appendChild(label);

      const value = document.createElement("div");
      value.className = "value";
      value.textContent = pick(a.value);
      el.appendChild(value);

      if (a.meta) {
        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = pick(a.meta);
        el.appendChild(meta);
      }
      if (a.bars) {
        const bars = document.createElement("div");
        bars.className = "bars";
        const fills = ["var(--gold)", "rgba(201,164,92,0.42)", "rgba(157,147,132,0.4)"];
        a.bars.forEach((w, n) => {
          const bar = document.createElement("div");
          bar.className = "bar";
          bar.style.width = w + "px";
          bar.style.background = fills[n] || fills[fills.length - 1];
          bars.appendChild(bar);
        });
        el.appendChild(bars);
      }
      annotEl.appendChild(el);
    });
  }

  // ── The plate ────────────────────────────────────────────────────
  function show(p) {
    const current = stack.querySelector(".plate.is-on");
    if (current && current.getAttribute("src") === p.src) {
      current.alt = pick(p.alt);
      return;                                     // already on screen
    }

    const next = new Image();
    next.className = "plate";
    next.width = 924;
    next.height = 1072;
    next.alt = pick(p.alt);
    next.src = p.src;

    const reveal = () => {
      stack.appendChild(next);
      // One frame at opacity 0 so the transition has something to run from.
      requestAnimationFrame(() => {
        next.classList.add("is-on");
        if (current) {
          current.classList.remove("is-on");
          current.addEventListener("transitionend", () => current.remove(), { once: true });
          setTimeout(() => current.remove(), 2000);   // belt and braces
        }
      });
    };

    (next.decode ? next.decode().catch(() => {}) : Promise.resolve()).then(reveal);
  }

  function render() {
    const p = roster[i];
    document.documentElement.style.setProperty("--edge", p.edge);
    paintChrome(p);
    show(p);
    // Warm the next plate so its crossfade starts the moment it is asked for.
    const upcoming = roster[(i + 1) % roster.length];
    if (upcoming) new Image().src = upcoming.src;
  }

  render();
  document.addEventListener("i18n:changed", () => {
    paintChrome(roster[i]);
    const on = stack.querySelector(".plate.is-on");
    if (on) on.alt = pick(roster[i].alt);
  });

  if (reduceMotion || !scan) return;

  // Don't burn plates while the hero is scrolled out of view.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stack);
  }

  scan.addEventListener("animationiteration", () => {
    if (!visible) return;
    i = (i + 1) % roster.length;
    render();
  });
})();
