import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { readAllData } from "@/lib/storage";

export async function GET() {
  const session = await auth();
  const ctx =
    session?.accessToken && session?.username
      ? { token: session.accessToken, username: session.username }
      : undefined;

  const data = await readAllData(ctx);
  const bundle = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
  return new NextResponse(JSON.stringify(bundle, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="eb1a-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
