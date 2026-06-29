/* ──────────────────────────────────────────────────────────────────
   Admin editor for data/projects.json.
   Pure client-side: load a JSON file (or the live one from the repo),
   edit fields in the UI, reorder by drag, then download the result
   to commit back into the repo. No server, no auto-save.
   ────────────────────────────────────────────────────────────────── */

const FIELD_KEYS = ["num", "cat", "catLabel", "tags", "title", "desc", "img", "alt"];

let projects = [];

const listEl = document.getElementById("admin-list");
const template = document.getElementById("card-template");
const statusEl = document.getElementById("status");
const fileInput = document.getElementById("file-input");

function setStatus(msg) {
  statusEl.textContent = msg;
  if (msg) {
    setTimeout(() => {
      if (statusEl.textContent === msg) statusEl.textContent = "";
    }, 3500);
  }
}

function render() {
  listEl.innerHTML = "";
  projects.forEach((project, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.index = String(index);

    node.querySelector(".card-index").textContent = `project ${index + 1}`;

    FIELD_KEYS.forEach((key) => {
      const field = node.querySelector(`[data-field="${key}"]`);
      if (!field) return;
      field.value = project[key] || "";
      field.addEventListener("input", () => {
        project[key] = field.value;
        updatePreview(node, project);
      });
    });

    node.querySelector(".remove-btn").addEventListener("click", () => {
      if (confirm(`Remove "${project.title || "this project"}"?`)) {
        projects.splice(index, 1);
        render();
      }
    });

    attachDragHandlers(node);
    updatePreview(node, project);
    listEl.appendChild(node);
  });
}

function updatePreview(node, project) {
  const preview = node.querySelector(".admin-preview");
  preview.textContent = JSON.stringify(project);
}

function attachDragHandlers(node) {
  node.addEventListener("dragstart", () => {
    node.classList.add("dragging");
  });
  node.addEventListener("dragend", () => {
    node.classList.remove("dragging");
    syncOrderFromDom();
  });
  node.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = listEl.querySelector(".dragging");
    if (!dragging || dragging === node) return;
    const rect = node.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    listEl.insertBefore(dragging, before ? node : node.nextSibling);
  });
}

function syncOrderFromDom() {
  const newOrder = [];
  listEl.querySelectorAll(".admin-card").forEach((node) => {
    const idx = Number(node.dataset.index);
    newOrder.push(projects[idx]);
  });
  projects = newOrder;
  render();
}

document.getElementById("add-project").addEventListener("click", () => {
  projects.push({
    num: String(projects.length + 1).padStart(2, "0"),
    cat: "nlp-politics",
    catLabel: "NLP · Politics",
    tags: "",
    title: "New project",
    desc: "",
    img: "images/",
    alt: "",
  });
  render();
  setStatus("Added a new project — fill in the details.");
});

document.getElementById("load-file").addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error("File must contain a JSON array");
    projects = data;
    render();
    setStatus(`Loaded ${data.length} projects from ${file.name}`);
  } catch (err) {
    alert("Could not read that file as a projects array: " + err.message);
  }
  fileInput.value = "";
});

document.getElementById("download-file").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "projects.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  setStatus("Downloaded — move it into data/projects.json and commit.");
});

async function init() {
  try {
    const res = await fetch("../data/projects.json");
    projects = await res.json();
    setStatus(`Loaded ${projects.length} projects from data/projects.json`);
  } catch (err) {
    console.error(err);
    projects = [];
    setStatus("Could not auto-load data/projects.json — use 'Load projects.json…' instead.");
  }
  render();
}

init();
