document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

function closeMenu() {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
document.addEventListener("click", (event) => {
  if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeMenu();
});

const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: "0px 0px -24px 0px", threshold: 0.06 });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

const resumeLink = document.getElementById("resume-link");
fetch("/resume.pdf", { method: "HEAD" })
  .then((response) => {
    if (response.ok && response.headers.get("content-type")?.includes("pdf")) {
      resumeLink.hidden = false;
    }
  })
  .catch(() => { /* Resume is optional. */ });

const repoGrid = document.getElementById("repo-grid");

function repositoryCard(repo) {
  const card = document.createElement("article");
  card.className = "repo-card";

  const heading = document.createElement("h3");
  const link = document.createElement("a");
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = repo.name;
  heading.append(link);

  const description = document.createElement("p");
  description.textContent = repo.description || "No description provided.";

  const meta = document.createElement("div");
  meta.className = "repo-meta";
  const language = document.createElement("span");
  language.textContent = repo.language || "Language not listed";
  const stars = document.createElement("span");
  stars.textContent = `${Number.isFinite(repo.stars) ? repo.stars : 0} stars`;
  const updated = document.createElement("span");
  const date = new Date(repo.updated_at);
  updated.textContent = Number.isNaN(date.getTime())
    ? "Update date unavailable"
    : `Updated ${new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date)}`;
  meta.append(language, stars, updated);
  card.append(heading, description, meta);
  return card;
}

function fallback(message) {
  const note = document.createElement("p");
  note.className = "repo-status";
  note.textContent = message;
  repoGrid.replaceChildren(note);
}

fetch("./data/repos.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Repository data unavailable");
    return response.json();
  })
  .then((data) => {
    const repos = Array.isArray(data.repos) ? data.repos : [];
    const valid = repos
      .filter((repo) => {
        if (!repo || typeof repo.name !== "string" || typeof repo.html_url !== "string") return false;
        try {
          const url = new URL(repo.html_url);
          return url.protocol === "https:" && url.hostname === "github.com" && repo.fork !== true;
        } catch {
          return false;
        }
      })
      .sort((a, b) => Date.parse(b.updated_at || 0) - Date.parse(a.updated_at || 0))
      .slice(0, 6);

    if (valid.length === 0) {
      fallback("Repository details are temporarily unavailable. Use the All repositories link above.");
      return;
    }
    repoGrid.replaceChildren(...valid.map(repositoryCard));
  })
  .catch(() => fallback("Repository details are temporarily unavailable. Use the All repositories link above."));
