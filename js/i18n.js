/* ──────────────────────────────────────────────────────────────────
   English / Spanish switch.

   English lives in the HTML — it is the source of truth. This file
   only holds the Spanish, keyed by the data-i18n attribute on each
   element. Switching back to English restores what the markup said,
   so an element with no Spanish entry simply stays as written.

     <p data-i18n="hero.tagline">…english…</p>
     <img data-i18n-alt="hero.alt" alt="…english…">
     <div data-i18n-aria="hero.label" aria-label="…english…">

   The choice lives in localStorage and sets <html lang>, so the next
   visit — and any screen reader — gets the same language.

   Project cards come from data/projects.json and are not translated
   yet; they stay in English in both modes.
   ────────────────────────────────────────────────────────────────── */

(function () {
  const ES = {
    // Nav (injected by header.js)
    "nav.work": "trabajo_",
    "nav.about": "perfil_",
    "nav.contact": "contacto_",

    // Dateline + hero
    "dateline.city": "Madrid, España",
    "hero.aria": "Introducción",
    "hero.eyebrow": "ANALISTA_DE_DATOS",
    "hero.location": "MADRID, ESPAÑA",
    "hero.tagline":
      "Usar la estadística para entendernos. En la intersección entre datos, política y humanidades — a través del PLN.",
    "hero.cta.work": "ver_trabajo()",
    "hero.cta.about": "sobre_mí",
    "hero.scan": "MIRADA ALGORÍTMICA · ESCANEO ACTIVO",
    "hero.cropped": "Obra apaisada, recortada al marco",

    "edition.head": "En este número",
    "edition.works": "Obra seleccionada",
    "edition.profile": "Perfil",
    "edition.contact": "Correspondencia",

    // Ticker
    "tick.nlp": "Procesamiento de Lenguaje Natural",
    "tick.network": "Análisis de redes",
    "tick.stance": "Detección de postura y encuadre",
    "tick.stats": "Modelización estadística",
    "tick.ts": "Predicción de series temporales · RNN",
    "tick.listening": "Escucha social",
    "tick.ml": "Aprendizaje automático",
    "tick.tools": "Python · R · Tableau",
    "tick.research": "Investigación política y de mercado",
    "tick.humanities": "Humanidades computacionales",

    // Sections
    "work.title": "Obra seleccionada",
    "work.loading": "Componiendo…",
    "work.group.standalone": "Artículos sueltos",
    "work.group.series": "Temas",
    "work.filter.aria": "Filtrar proyectos",

    "about.title": "Perfil",
    "about.count": "Madrid",
    "about.kicker": "La analista como lectora",
    "about.headline.1": "Leer los datos como",
    "about.headline.2": "un humanista lee un texto.",
    "about.deck":
      "Por su estructura, por su subtexto — y por lo que los números dejan sin decir.",
    "about.p1":
      "Jimena Sánchez Curto cursa quinto año del doble grado en Filosofía, Política, Derecho y Economía y en Data & Business Analytics en IE University, y es Data Consultant en GAD3 (Madrid), donde aplica ciencia de datos a la investigación política y de mercado.",
    "about.p2":
      "Su trabajo se sitúa donde el rigor cuantitativo se encuentra con el matiz interpretativo: pipelines de machine learning que siguen cómo se encuadran los argumentos públicos y cómo cobran impulso los temas, modelos de predicción pensados para quien decide, y procesamiento de lenguaje natural que trata la lengua como evidencia.",
    "about.p3":
      "Formada entre Europa y América Latina y bilingüe en español e inglés, aporta formación en análisis filosófico, político, jurídico e histórico a cada modelo que construye — eligiendo el método según la pregunta, y no por inercia.",
    "about.pullquote": "«Métodos ajustados al problema — no aplicados por defecto.»",

    "record.experience": "Experiencia",
    "record.education": "Formación",
    "record.toolkit": "Herramientas",
    "record.credentials": "Acreditaciones",
    "record.aria": "Trayectoria",

    "exp.gad3.when": "Jun 2025 — Actualidad",
    "exp.gad3.what": "Data Consultant · ",
    "exp.gad3.where": "Madrid · antes Data Consultant Intern",
    "exp.gad3.1":
      "Creó un observatorio sectorial en tiempo real que devuelve inteligencia lista para decidir en segundos — hoy en uso en toda la empresa.",
    "exp.gad3.2":
      "Lideró la construcción técnica de un producto de escucha social: un pipeline de ML que rastrea cambios en el encuadre de los argumentos y el impulso de los temas públicos.",
    "exp.gad3.3":
      "Modelos de predicción que combinan series temporales con redes neuronales recurrentes.",
    "exp.gad3.4":
      "Sustituyó flujos manuales por pipelines reproducibles — una tarea semanal de 2–3 horas pasó a ser un proceso de 15 minutos en segundo plano.",
    "exp.hikko.when": "Ago 2024",
    "exp.hikko.what": "Intern, Salesforce Data Cloud · ",
    "exp.hikko.where": "Montevideo",
    "exp.hikko.1":
      "Se ocupó de la dimensión de datos de una implantación de Data Cloud; la documentó para equipos futuros, construyó demos y presentó el proyecto al CFO.",

    "edu.ie.dt": "IE University",
    "edu.ie.when": "prev. 2027",
    "edu.ie.dd":
      "Doble grado en Filosofía, Política, Derecho y Economía + Data & Business Analytics. Matrícula de honor en Probabilidad y Estadística y en Fundamentos de IA y Machine Learning.",
    "edu.ib.dt": "Bachillerato Internacional",
    "edu.ib.dd": "International College of Punta del Este",

    "kit.network": "Análisis de redes",
    "kit.ml": "Machine learning",
    "kit.forecast": "Predicción · RNN",
    "kit.stats": "Modelización estadística",

    "cred.salesforce": "Salesforce Certified Data Cloud Consultant",
    "cred.langs": "Español e inglés",
    "cred.langs.val": "bilingüe",
    "cred.internship": "Abierta a convenios de prácticas vía IE University",

    "contact.title": "Correspondencia",
    "contact.count": "Se agradecen las cartas",
    "contact.lede.1": "¿Trabajas donde se cruzan",
    "contact.lede.2": "lengua, política y datos?",
    "contact.essays": "Ensayos y notas",
    "contact.code": "Código",

    "footer.left": "Jimena Sánchez Curto · ANALISTA DE DATOS · PLN",
    "footer.right": "DATOS × LENGUA × PINTURA",

    "gallery.project": "proyecto",
    "gallery.projects": "proyectos",
    "gallery.works": "piezas",
    "gallery.empty": "Aquí todavía no hay nada.",
    "gallery.forthcoming": "en preparación",
    "gallery.status.completed": "Terminado",
    "gallery.status.in-progress": "En curso",
    "gallery.status.idea": "Previsto",

    "lang.aria": "Idioma",
    "locale": "es-ES",
  };

  const KEY = "jsc-lang";
  const original = new WeakMap();          // element → { text, alt, aria }

  function remember(el) {
    if (!original.has(el)) {
      original.set(el, {
        text: el.textContent,
        alt: el.getAttribute("alt"),
        aria: el.getAttribute("aria-label"),
      });
    }
    return original.get(el);
  }

  function apply(lang, root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      const was = remember(el);
      const es = ES[el.dataset.i18n];
      el.textContent = lang === "es" && es != null ? es : was.text;
    });
    scope.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const was = remember(el);
      const es = ES[el.dataset.i18nAlt];
      el.setAttribute("alt", lang === "es" && es != null ? es : was.alt || "");
    });
    scope.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const was = remember(el);
      const es = ES[el.dataset.i18nAria];
      el.setAttribute("aria-label", lang === "es" && es != null ? es : was.aria || "");
    });
  }

  let current = "en";
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "es" || saved === "en") current = saved;
  } catch (_) { /* private mode — fall back to English */ }

  function set(lang, persist) {
    current = lang === "es" ? "es" : "en";
    document.documentElement.lang = current;
    apply(current);
    document.querySelectorAll(".lang-switch button").forEach((b) => {
      const on = b.dataset.lang === current;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    if (persist) {
      try { localStorage.setItem(KEY, current); } catch (_) {}
    }
    document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: current } }));
  }

  // Public surface: other scripts read i18n.lang and re-apply after
  // they inject markup of their own (the nav, the painting roster).
  window.i18n = {
    get lang() { return current; },
    set,
    apply: (root) => apply(current, root),
    t: (key, fallback) => (current === "es" && ES[key] != null ? ES[key] : fallback),
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-switch button");
    if (btn) set(btn.dataset.lang, true);
  });

  set(current, false);
  document.addEventListener("header:rendered", () => apply(current));
})();
