# Dwijesh P. — personal site

A single-page profile site for `https://dwijeshh.github.io/`. It uses plain HTML, CSS, and JavaScript, with no build step or client-side API requests. The visual identity is warm paper, deep teal, mint, coral, and serif headings.

## Files

```text
.
├── index.html
├── styles.css
├── script.js
├── data/
│   └── repos.json
├── scripts/
│   └── fetch-repos.mjs
└── .github/
    └── workflows/
        ├── deploy.yml
        └── refresh-repos.yml
```

## Publish with GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`, or open **Actions → Deploy profile site → Run workflow**.
5. When the deployment completes, open `https://dwijeshh.github.io/`.

The deploy workflow publishes on every push to `main`. The repository refresh workflow runs each Monday at 03:17 UTC and can also be run manually under **Actions → Refresh public repositories → Run workflow**. It uses the built-in `GITHUB_TOKEN` to fetch public, non-fork repositories and writes the six most recently updated to `data/repos.json`. It commits changed data and deploys the updated site itself, since commits made with `GITHUB_TOKEN` do not trigger the push workflow.

## Fill in

- Replace `[CITY, COUNTRY]` in `index.html` with your location.
- Replace `[UNIVERSITY, DEGREE, YEARS]` in `index.html` with your education details.
- Replace `[internships / full-time roles / collaboration]` in `index.html` with the opportunities you want to show.
- Optional: add `resume.pdf` at the repository root. The Download resume button stays hidden until that file exists and is served as a PDF.

There are no other required secrets or dependencies. The repository list has an initial snapshot so the section can render before the first scheduled refresh. If the data file is unavailable, the page shows a link to GitHub instead of failing.

