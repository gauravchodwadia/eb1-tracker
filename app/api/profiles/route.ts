import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { DATA_REPO_NAME } from "@/lib/github";

export interface Profile {
  owner: string;
  avatarUrl: string | null;
  isSelf: boolean;
}

interface GitHubRepo {
  name: string;
  owner: { login: string; avatar_url: string };
}

export async function GET() {
  const session = await auth();
  if (!session?.accessToken || !session?.username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `GitHub API error: ${res.status}` },
      { status: 502 }
    );
  }

  const repos = (await res.json()) as GitHubRepo[];
  const seen = new Set<string>();
  const profiles: Profile[] = [];

  for (const repo of repos) {
    if (repo.name !== DATA_REPO_NAME) continue;
    const owner = repo.owner.login;
    if (seen.has(owner)) continue;
    seen.add(owner);
    profiles.push({
      owner,
      avatarUrl: repo.owner.avatar_url,
      isSelf: owner === session.username,
    });
  }

  profiles.sort((a, b) => {
    if (a.isSelf) return -1;
    if (b.isSelf) return 1;
    return a.owner.localeCompare(b.owner);
  });

  return NextResponse.json({ profiles });
}
