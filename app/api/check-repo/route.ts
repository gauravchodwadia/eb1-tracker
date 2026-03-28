import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRepoExists, DATA_REPO_NAME } from "@/lib/github";

export async function GET() {
  // Authenticate
  const session = await auth();
  if (!session?.accessToken || !session?.username) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { accessToken: token, username } = session;

  const exists = await checkRepoExists(token, username);

  if (exists) {
    return NextResponse.json({
      exists: true,
      repoUrl: `https://github.com/${username}/${DATA_REPO_NAME}`,
    });
  }

  return NextResponse.json({ exists: false });
}
