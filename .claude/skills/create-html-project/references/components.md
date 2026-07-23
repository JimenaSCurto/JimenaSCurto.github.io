# Components — copy-paste building blocks

Self-contained HTML/CSS/JS you can drop into a project page. Everything here is vanilla
(no build step, no required CDN) so it works as a static file on GitHub Pages. Adapt
class names, colors, and data to the project — these are starting points, not a fixed
kit. Put the CSS in the page's `<head>` `<style>` (or a sibling `projects/<slug>.css`)
and the JS just before the closing `</body>`, after the `header.js` script.

## Table of contents
1. Page scaffold (new pages)
2. Theme tokens
3. Section structure & title strip
4. Plain-language aside & "decode" toggle
5. Insight pop-up card
6. Figure + caption
7. SVG bar chart (hover to read)
8. SVG timeline / line
9. Network diagram (nodes + edges)
10. Scroll reveal

---

## 1. Page scaffold (new pages)

Only needed when `projects/<slug>.html` doesn't exist yet. Mirror the existing stubs:
set `<title>` and the `Project · <slug>` label, keep the four header lines and the two
design markers. Reference images as `../images/...`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>PROJECT TITLE — Jimena Sánchez Curto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/header.css">
  <style>/* page tokens + styles go here — see §2 */</style>
</head>
<body>
  <div id="site-header"></div>

  <!-- ▼▼▼ YOUR UNIQUE PROJECT DESIGN GOES HERE ▼▼▼ -->
  <main class="project"> ... </main>
  <!-- ▲▲▲ END OF YOUR DESIGN ▲▲▲ -->

  <div id="project-nav"></div>
  <script src="../js/header.js"></script>
  <!-- page JS goes here -->
</body>
</html>
```

## 2. Theme tokens

Drop these into the page's `<style>` so the design stays in the portfolio family. Change
`--accent` per project for stylistic independence.

```css
:root{
  --parchment:#f6f1e8; --ink:#1a1610; --gold:#b8902a;
  --muted:#8a7a6a; --line:rgba(26,22,16,.12);
  --accent:var(--gold);              /* swap per project */
  --serif:"Cormorant Garamond",Georgia,serif;
  --mono:"JetBrains Mono",ui-monospace,monospace;
  --body:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
body{margin:0;background:var(--parchment);color:var(--ink);font-family:var(--body);
  line-height:1.65;}
.project{max-width:820px;margin:0 auto;padding:72px 24px 96px;}
.project h1{font-family:var(--serif);font-weight:400;font-size:clamp(38px,6vw,60px);
  line-height:1.05;margin:0;}
.project h2{font-family:var(--serif);font-weight:600;font-style:italic;
  font-size:30px;margin:64px 0 8px;}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--accent);}
.project p{margin:16px 0;}
```

## 3. Section structure & title strip

```html
<main class="project">
  <header class="project-head">
    <div class="eyebrow">NLP · Politics · 2024</div>
    <h1>Mapping the Rhetoric</h1>
    <p class="lede">The Spanish Congress through network analysis and NLP.</p>
  </header>

  <section id="context">
    <div class="eyebrow">01 · Context &amp; Objective</div>
    <h2>Why this project</h2>
    <p>…</p>
  </section>

  <section id="methodology">
    <div class="eyebrow">02 · Methodology</div>
    <h2>How it was done</h2>
    <p>…</p>
  </section>

  <section id="findings">
    <div class="eyebrow">03 · Findings</div>
    <h2>What we learned</h2>
    <p>…</p>
  </section>
</main>
```

## 4. Plain-language aside & "decode" toggle

For the dual-register methodology. The **aside** is always visible; the **toggle** hides
optional depth behind a click.

```html
<p>We reduced the TF-IDF matrix with truncated SVD before k-means clustering.</p>
<p class="plain"><span>In plain terms</span> we shrank each speech's long list of
word-scores down to its most informative directions, then let the computer group
speeches that "talk alike."</p>

<!-- optional deeper gloss, collapsed by default -->
<details class="decode">
  <summary>What is silhouette score?</summary>
  <p>A number from −1 to 1 measuring how cleanly points sit inside their own cluster
  versus the nearest other cluster — we used it to pick how many groups to look for.</p>
</details>
```

```css
.plain{border-left:2px solid var(--accent);padding:2px 0 2px 16px;color:#4a4034;
  font-size:.97em;}
.plain span{font-family:var(--mono);font-size:10px;letter-spacing:.1em;
  text-transform:uppercase;color:var(--accent);display:block;margin-bottom:2px;}
.decode{margin:12px 0;font-size:.95em;}
.decode summary{cursor:pointer;font-family:var(--mono);font-size:11px;
  letter-spacing:.05em;color:var(--accent);}
.decode[open] summary{margin-bottom:6px;}
```

## 5. Insight pop-up card

For compressed findings. A real `<button>` (keyboard-accessible) that reveals a punchy
takeaway. Put several inline in the findings prose.

```html
<button class="insight" aria-expanded="false">
  <span class="insight-tag">insight</span>
  <span class="insight-teaser">Who defects most?</span>
  <span class="insight-body" hidden>Members whose speeches fell in Bloc C voted against
    their own party <strong>3×</strong> more often than the chamber average.</span>
</button>
```

```css
.insight{display:inline-block;text-align:left;max-width:520px;cursor:pointer;
  background:rgba(184,144,42,.08);border:1px solid rgba(184,144,42,.4);
  padding:10px 14px;margin:10px 0;font:inherit;color:var(--ink);border-radius:2px;
  transition:background .15s;}
.insight:hover,.insight:focus-visible{background:rgba(184,144,42,.16);
  outline:2px solid var(--accent);outline-offset:1px;}
.insight-tag{font-family:var(--mono);font-size:9px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--accent);margin-right:8px;}
.insight-teaser{font-family:var(--serif);font-size:20px;}
.insight-body{display:block;margin-top:8px;}
```

```js
document.querySelectorAll('.insight').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const body=btn.querySelector('.insight-body');
    const open=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',String(!open));
    body.hidden=open;
  });
});
```

## 6. Figure + caption

```html
<figure class="fig">
  <div class="fig-media"><!-- SVG / img (../images/…) --></div>
  <figcaption>Speeches cluster into three rhetorical blocs; Bloc C sits between the
  two major parties.</figcaption>
</figure>
```

```css
.fig{margin:32px 0;}
.fig-media{background:#fff;border:1px solid var(--line);padding:16px;overflow-x:auto;}
.fig figcaption{font-size:.9em;color:var(--muted);margin-top:8px;}
```

## 7. SVG bar chart (hover to read)

Hand-built, dependency-free. Feed it real `[label, value]` data.

```html
<figure class="fig"><div class="fig-media"><svg id="bars" viewBox="0 0 480 240"
  role="img" aria-label="Votes by bloc"></svg></div>
  <figcaption id="bars-cap">Hover a bar to read its value.</figcaption></figure>
<script>
(function(){
  const data=[["Bloc A",42],["Bloc B",37],["Bloc C",21]];   // real data here
  const svg=document.getElementById('bars'),cap=document.getElementById('bars-cap');
  const W=480,H=240,pad=32,max=Math.max(...data.map(d=>d[1]));
  const bw=(W-pad*2)/data.length*0.6, gap=(W-pad*2)/data.length;
  data.forEach((d,i)=>{
    const h=(H-pad*2)*d[1]/max, x=pad+i*gap+gap*0.2, y=H-pad-h;
    const r=document.createElementNS('http://www.w3.org/2000/svg','rect');
    r.setAttribute('x',x);r.setAttribute('y',y);r.setAttribute('width',bw);
    r.setAttribute('height',h);r.setAttribute('fill','#b8902a');
    r.style.cursor='pointer';
    r.addEventListener('mouseenter',()=>cap.textContent=`${d[0]}: ${d[1]}`);
    r.addEventListener('mouseleave',()=>cap.textContent='Hover a bar to read its value.');
    svg.appendChild(r);
    const t=document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x',x+bw/2);t.setAttribute('y',H-pad+14);
    t.setAttribute('text-anchor','middle');t.setAttribute('font-size','10');
    t.setAttribute('fill','#8a7a6a');t.textContent=d[0];svg.appendChild(t);
  });
})();
</script>
```

## 8. SVG timeline / line

Same idea for change-over-time; map `[t, value]` points to a polyline and add a moving
readout on `mousemove`. Keep axes labeled and the readout in the caption. (Adapt from the
bar pattern: compute `x` from the time index, `y` from value; draw a `<polyline>` with
`fill:none;stroke:var(--accent)`.)

## 9. Network diagram (nodes + edges)

Common for NLP (co-occurrence, vote agreement, citations). For a small graph, place nodes
by precomputed coordinates and draw edges as `<line>`; highlight a node's neighbors on
hover. For a larger graph, load D3 from a CDN in this one page and use a force layout —
that's an acceptable use of an external library. Either way, color by cluster and let
hover reveal labels; a static legend carries the meaning.

## 10. Scroll reveal

Gentle progressive reveal as sections enter view. Honors reduced-motion.

```css
.reveal{opacity:0;transform:translateY(14px);transition:opacity .5s,transform .5s;}
.reveal.in{opacity:1;transform:none;}
@media (prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none;}}
```

```js
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
```
