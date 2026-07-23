# Page Blueprint — structure & writing voice

This is the shape every project page takes and the voice it's written in. Adapt the
proportions to the project, but keep the three-act spine and the dual-register habit.

## Table of contents
1. The three acts
2. Act I — Context & Objective
3. Act II — Methodology (dual-register writing)
4. Act III — Findings (paragraphs + pop-ups + visuals)
5. Tone & house style

---

## 1. The three acts

A project page tells one story in three movements, always in this order:

1. **Context & Objective** — the question and why it matters.
2. **Methodology** — how it was actually done, in detail.
3. **Findings** — what was learned, delivered for impact.

Give each a clear section with a heading. A short title strip at the very top (project
title, a one-line descriptor, maybe tags/date) orients the reader before Act I begins.

## 2. Act I — Context & Objective

Purpose: in ~30 seconds a reader knows *what this is* and *why anyone should care*.

- Open with the real-world stakes or the puzzle, not the method. ("Parliamentary debate
  looks chaotic — but does the language of Spain's Congress cluster into coherent
  blocs, and do those blocs predict how members actually vote?")
- State the objective crisply: the question(s) the project set out to answer.
- Keep it to a few tight paragraphs. No methods yet.

## 3. Act II — Methodology (dual-register writing)

This is the detailed core and the part Jimena cares most about. Write it so that **two
readers succeed at once**: a machine-learning practitioner who wants precision, and a
curious non-technical reader who must never fall off.

**The dual-register pattern.** Write the main line in expert voice — name the model,
the features, the metric, the design choice, exactly. Then, wherever you introduce a
technical concept, attach a **plain-language gloss** that explains the same idea in
everyday terms and *why it was the right tool*. Two ways to render the gloss (see
`components.md`):

- **Inline plain-language aside** — a visually distinct sentence or two right after the
  technical claim ("In plain terms: …").
- **Decode toggle / pop-up** — a small "what does this mean?" control the reader can
  expand on demand, so experts can skip it and beginners can open it.

Prefer the inline aside for load-bearing ideas the whole argument depends on; use the
toggle for optional depth so the prose doesn't get cluttered.

**Example (expert line + gloss):**

> We represented each speech as a TF-IDF vector over lemmatized unigrams and bigrams,
> then reduced to 50 dimensions with truncated SVD before clustering with k-means
> (k chosen by silhouette score).
>
> *In plain terms:* we turned every speech into a list of numbers describing which
> words it leans on, squeezed those long lists down to their 50 most informative
> directions so patterns aren't drowned out by noise, and then let the computer sort
> the speeches into groups where members of a group "talk alike." We picked the number
> of groups by testing which choice gives the cleanest, least-overlapping clusters.

**Be honest and specific.** Include the things that make methodology trustworthy:
- the data (source, size, time span, how it was cleaned/labeled),
- the actual models/algorithms and key hyperparameters,
- how success was measured (metrics, baselines, validation scheme),
- limitations and threats to validity — state them plainly; they build credibility.

Never dress up a simple method as fancier than it was, and never wave away a complex one.

## 4. Act III — Findings (paragraphs + pop-ups + visuals)

Purpose: deliver the payoff so it lands. Three ingredients, used together:

**Paragraphs that argue.** Write findings as connected prose that builds a case —
claim, evidence, interpretation — not a bulleted list of outputs. Each paragraph should
advance the story: what was found, then what it *means*. Lead with meaning.

**Pop-up insight cards for compressed insights.** When a finding compresses to a sharp
one-liner or a single number, surface it as an interactive **insight pop-up**: a chip or
marker the reader clicks/taps to reveal the punchy takeaway ("Members whose speeches
clustered in Bloc C voted against their own party 3× more often than average"). These
are the moments that stick — use them for the 2–5 sharpest points, not for everything.
The component is in `components.md`.

**Interactive visualizations wherever a picture wins.** If a relationship is easier to
*see* than to read, show it, and let the reader poke at it:
- distributions / comparisons → bar or dot charts with hover-to-read values,
- change over time → a line/timeline with a movable readout,
- relationships / structure (very common in NLP: co-occurrence, citation, vote
  networks) → a node–edge diagram with hover highlighting,
- text specifics → highlighted excerpts, keyword-in-context, small heatmaps.

Build them from the real data. Consult the `dataviz` skill for color, axes, and labels.
Keep each figure legible at a glance and captioned with the one thing it proves.

End Act III with a brief synthesis: the through-line of what the project establishes,
and (if apt) where it points next.

## 5. Tone & house style

- **Editorial and archival**, matching the portfolio: confident, literate, unhurried.
  Cormorant Garamond for display/headings, JetBrains Mono for labels/metadata, a clean
  serif or system font for body copy.
- **Meaning before machinery.** Say what something shows before how it was computed.
- **Concrete over grand.** Real numbers, named methods, specific examples beat adjectives.
- **Respect the reader's time.** Tight paragraphs; every sentence earns its place.
- **Accessibility:** interactive elements are real buttons/links, keyboard-operable,
  with visible focus and `aria` state; charts have text alternatives or captions that
  carry the finding; honor `prefers-reduced-motion` for any animation.
- **Stylistic independence is welcome** — a distinct accent color, a bespoke layout, a
  signature motif per project — as long as it stays in the portfolio's palette/type
  family and the shared header still reads as the same site.
