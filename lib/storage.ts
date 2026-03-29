import { getDefault } from "./defaults";

const GITHUB_DATA_BRANCH = process.env.GITHUB_DATA_BRANCH || "main";
const GITHUB_DATA_PATH = process.env.GITHUB_DATA_PATH || "data";
const DATA_REPO_NAME = process.env.DATA_REPO_NAME || "eb1-tracker-data";

const ALLOWED_FILES = [
  "criteria",
  "evidence",
  "checklist",
  "timeline",
  "budget",
  "letters",
  "activity",
  "resources",
  "reviewers",
  "settings",
] as const;

export type AllowedFile = (typeof ALLOWED_FILES)[number];

export function isAllowedFile(filename: string): filename is AllowedFile {
  return ALLOWED_FILES.includes(filename as AllowedFile);
}

export interface GitHubContext {
  token: string;
  username: string;
}

// === GitHub backend ===

async function readFromGitHub(
  filename: string,
  ctx: GitHubContext
): Promise<unknown> {
  const repo = `${ctx.username}/${DATA_REPO_NAME}`;
  const url = `https://api.github.com/repos/${repo}/contents/${GITHUB_DATA_PATH}/${filename}.json?ref=${GITHUB_DATA_BRANCH}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ctx.token}`,
      Accept: "application/vnd.github.raw+json",
    },
    next: { revalidate: 10 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// === Filesystem backend (local dev fallback) ===

async function readFromFilesystem(filename: string): Promise<unknown> {
  const fs = await import("fs/promises");
  const path = await import("path");
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");

  await fs.mkdir(dataDir, { recursive: true });
  const fp = path.join(dataDir, `${filename}.json`);

  try {
    const raw = await fs.readFile(fp, "utf-8");
    return JSON.parse(raw);
  } catch {
    const defaults = getDefault(filename);
    if (defaults !== null) {
      await fs.writeFile(fp, JSON.stringify(defaults, null, 2), "utf-8");
    }
    return defaults;
  }
}

// === Public API ===

export async function readData(
  filename: AllowedFile,
  ctx?: GitHubContext
): Promise<unknown> {
  if (ctx) {
    const data = await readFromGitHub(filename, ctx);
    if (data !== null) return data;
    return getDefault(filename);
  }
  // Local dev fallback
  return readFromFilesystem(filename);
}

export async function readAllData(
  ctx?: GitHubContext
): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};
  for (const file of ALLOWED_FILES) {
    result[file] = await readData(file, ctx);
  }
  return result;
}
