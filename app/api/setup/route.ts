import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  checkRepoExists,
  createRepo,
  pushMultipleFiles,
  DATA_REPO_NAME,
} from "@/lib/github";
import { getTemplateFiles } from "@/lib/defaults-template";

export async function POST(request: Request) {
  // 1. Authenticate
  const session = await auth();
  if (!session?.accessToken || !session?.username) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { accessToken: token, username } = session;

  // 2. Parse body
  let body: { name?: string; field?: string; targetDate?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { name, field, targetDate } = body;
  if (!name || !field) {
    return NextResponse.json(
      { error: "name and field are required" },
      { status: 400 }
    );
  }

  // 3. Check if repo already exists
  const exists = await checkRepoExists(token, username);
  if (exists) {
    return NextResponse.json(
      {
        error: "Data repository already exists",
        repoUrl: `https://github.com/${username}/${DATA_REPO_NAME}`,
      },
      { status: 409 }
    );
  }

  // 4. Create private repo
  let repoUrl: string;
  try {
    repoUrl = await createRepo(
      token,
      DATA_REPO_NAME,
      "Private data repository for EB-1A Tracker",
      true
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to create repository: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  // 5. Wait for GitHub to initialize the repo (auto_init creates initial commit)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 6. Push all template files in a single commit
  const repo = `${username}/${DATA_REPO_NAME}`;
  const files = getTemplateFiles(
    name,
    field,
    targetDate || null,
    username
  );

  try {
    await pushMultipleFiles(
      token,
      repo,
      files,
      `Initial setup for ${name} — ${field}`
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to push template files: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  // 7. Return success
  return NextResponse.json({ success: true, repoUrl });
}
