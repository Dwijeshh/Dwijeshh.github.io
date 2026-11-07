import { mkdir, readFile, writeFile } from "node:fs/promises";

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is required");

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "User-Agent": "dwijeshh-pages-repos",
};

const publicRepos = [];
for (let page = 1; page <= 10 && publicRepos.length < 6; page += 1) {
  const url = new URL("https://api.github.com/users/Dwijeshh/repos");
  url.searchParams.set("type", "owner");
  url.searchParams.set("sort", "updated");
  url.searchParams.set("direction", "desc");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("page", String(page));

  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub API returned ${response.status} on page ${page}`);
  const batch = await response.json();
  if (!Array.isArray(batch)) throw new Error("Unexpected GitHub API response");

  for (const repo of batch) {
    if (repo.fork || repo.private) continue;
    publicRepos.push({
      name: repo.name,
      description: repo.description || null,
      stars: repo.stargazers_count ?? 0,
      language: repo.language || null,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      fork: false,
    });
  }
  if (batch.length < 100) break;
}

publicRepos.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
const output = JSON.stringify({ repos: publicRepos.slice(0, 6) }, null, 2) + "\n";
const path = "data/repos.json";
await mkdir("data", { recursive: true });
const previous = await readFile(path, "utf8").catch(() => "");
if (output !== previous) await writeFile(path, output, "utf8");
