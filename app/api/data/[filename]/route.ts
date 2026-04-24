import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAllowedFile, readData } from "@/lib/storage";
import { resolveSelectedOwner } from "@/lib/owner";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!isAllowedFile(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  // Check for authenticated session (GitHub token)
  const session = await auth();
  const ctx =
    session?.accessToken && session?.username
      ? {
          token: session.accessToken,
          username: session.username,
          owner: resolveSelectedOwner(req, session.username),
        }
      : undefined;

  try {
    const data = await readData(filename, ctx);
    return NextResponse.json(data);
  } catch (err) {
    console.error(`Failed to read ${filename}:`, err);
    return NextResponse.json(
      { error: "Failed to load data" },
      { status: 500 }
    );
  }
}
