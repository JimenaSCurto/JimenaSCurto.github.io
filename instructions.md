# Portfolio — Editing Guide

> **One rule**: all content lives in `data/content.js`. You never need to touch `index.html`, `css/style.css`, or `js/main.js` to update content.

---

## Directory Structure

```
portfolio/
├── index.html              ← Skeleton. Do not edit for content.
├── css/
│   └── style.css           ← All styles. Edit only for design changes.
├── js/
│   └── main.js             ← All rendering logic. Do not edit.
├── data/
│   └── content.js          ← ✅ YOUR ONLY EDITING FILE
└── README.md               ← This file.
```

---

## How to Edit Each Section

### 1 · Personal info (Hero)

In `data/content.js`, find `hero: { ... }` and update `name`, `tagline`, `description`, and `links`.

To add a social link:
```js
{ label: "Twitter", icon: "mail", url: "https://twitter.com/handle" }
```
Supported icon values: `github`, `linkedin`, `mail`.

---

### 2 · Noteworthy Projects (Featured Gallery)

Find `noteworthy: [ ... ]`. Each object is one featured card.

**Add a project:**
```js
{
  id: "proj-004",                    // unique ID, any string
  title: "My New Project",
  summary: "One sentence description.",
  tags: ["Tag1", "Tag2"],
  link: "https://github.com/...",    // or "#" for no link
  collectionId: "col-elections",     // optional: links to a collection
},
```

**Remove a project:** delete its object from the array.

**Reorder:** drag the objects into the order you want.

---

### 3 · Collections

Find `collections: [ ... ]`. Each collection has a `title`, `description`, and a `projects` array.

**Add a new collection:**
```js
{
  id: "col-newtheme",                // unique ID
  title: "New Research Theme",
  description: "Short paragraph about what unites these projects.",
  color: "#004c00",
  projects: [
    {
      id: "col-newtheme-01",
      title: "Project Title",
      description: "Full project description (2–4 sentences).",
      tags: ["Method", "Tool", "Domain"],
      link: "#",
      year: 2025,
    },
  ],
},
```

**Add a project to an existing collection:** append an object inside the collection's `projects` array.

**Remove a collection:** delete the entire collection object.

---

### 4 · Skills in Context

Find `skills: [ ... ]`. Each category has `items`, each with a `name` and a `projectIds` array.

`projectIds` must match the `id` values defined in `noteworthy` or `collections[].projects`.

**Add a new skill:**
```js
{ name: "Network Analysis", projectIds: ["col-social-01"] },
```

**Remove a skill:** delete its object.

**Add a new category:**
```js
{
  category: "Software",
  items: [
    { name: "QGIS", projectIds: [] },
  ],
},
```

---

### 5 · Insights / Mini Case Studies

Find `insights: [ ... ]`.

**Add a new insight:**
```js
{
  id: "ins-004",                     // unique ID
  title: "Your Post Title",
  category: "Methods",               // e.g. Methods, Fieldwork, Data, Results
  date: "2025-01",                   // YYYY-MM
  readTime: "5 min",
  summary: "One or two sentence teaser shown on the card.",
  body: `
    <p>Your full article text here. HTML is supported.</p>
    <h3>A subheading</h3>
    <p>More text...</p>
  `,
},
```

**Remove an insight:** delete its object.

---

## Deploying to GitHub Pages

1. Push all files to your repository (keep the structure intact).
2. Go to **Settings → Pages** → set source to `main` branch, `/ (root)`.
3. GitHub Pages will serve `index.html` automatically.

Every time you push changes to `data/content.js`, the live site updates within ~1 minute.

---

## Quick Cheatsheet

| What I want to do                  | Where to go                        |
|------------------------------------|------------------------------------|
| Update my bio / tagline            | `data/content.js` → `hero`         |
| Feature a new project              | `data/content.js` → `noteworthy`   |
| Add a project to a collection      | `data/content.js` → `collections`  |
| Create a new research area         | `data/content.js` → `collections`  |
| Link a skill to a project          | `data/content.js` → `skills`       |
| Publish a new insight post         | `data/content.js` → `insights`     |
| Change accent colour               | `css/style.css` → `--accent`       |
| Change fonts                       | `css/style.css` → `--font-*`       |
