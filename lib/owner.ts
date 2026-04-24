import type { NextRequest } from "next/server";

export const OWNER_COOKIE = "selectedOwner";

function isValidGitHubLogin(s: string): boolean {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(s);
}

export function resolveSelectedOwner(
  req: NextRequest,
  sessionUsername: string
): string {
  const fromUrl = req.nextUrl.searchParams.get("owner");
  if (fromUrl && isValidGitHubLogin(fromUrl)) return fromUrl;

  const fromCookie = req.cookies.get(OWNER_COOKIE)?.value;
  if (fromCookie && isValidGitHubLogin(fromCookie)) return fromCookie;

  return sessionUsername;
}
