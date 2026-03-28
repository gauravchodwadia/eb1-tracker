const DATA_REPO_NAME = "gc-tracker-data";

export { DATA_REPO_NAME };

// ---------------------------------------------------------------------------
// GitHub API helpers for the onboarding flow
// ---------------------------------------------------------------------------

const API = "https://api.github.com";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

// ---------------------------------------------------------------------------
// checkRepoExists — returns true if {username}/{repoName} exists and the
// token has access.
// ---------------------------------------------------------------------------
export async function checkRepoExists(
  token: string,
  username: string,
  repoName: string = DATA_REPO_NAME
): Promise<boolean> {
  const res = await fetch(`${API}/repos/${username}/${repoName}`, {
    headers: headers(token),
  });
  return res.ok; // 200 = exists, 404 = not found
}

// ---------------------------------------------------------------------------
// createRepo — creates a new repo under the authenticated user and returns
// the HTML URL.
// ---------------------------------------------------------------------------
export async function createRepo(
  token: string,
  name: string,
  description: string,
  isPrivate: boolean
): Promise<string> {
  const res = await fetch(`${API}/user/repos`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      name,
      description,
      private: isPrivate,
      auto_init: true, // creates an initial commit so we have a ref
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to create repo: ${res.status} ${res.statusText} — ${JSON.stringify(body)}`
    );
  }

  const data = await res.json();
  return data.html_url as string;
}

// ---------------------------------------------------------------------------
// pushMultipleFiles — creates a single commit with all provided files using
// the Git Data API (blobs → tree → commit → update ref).
//
// Handles both:
//   a) repos that already have a commit on `main` (PATCH ref)
//   b) brand-new repos where `main` doesn't exist yet (POST ref)
// ---------------------------------------------------------------------------
export async function pushMultipleFiles(
  token: string,
  repo: string, // "owner/repo"
  files: { path: string; content: string }[],
  message: string
): Promise<void> {
  const h = headers(token);

  // 1. Try to get the current ref for main
  let parentSha: string | null = null;
  let baseTreeSha: string | null = null;

  const refRes = await fetch(
    `${API}/repos/${repo}/git/ref/heads/main`,
    { headers: h }
  );

  if (refRes.ok) {
    const refData = await refRes.json();
    const commitSha = refData.object.sha as string;

    // Get the tree SHA from the commit
    const commitRes = await fetch(
      `${API}/repos/${repo}/git/commits/${commitSha}`,
      { headers: h }
    );
    if (!commitRes.ok) {
      throw new Error(`Failed to get commit: ${commitRes.status}`);
    }
    const commitData = await commitRes.json();
    baseTreeSha = commitData.tree.sha as string;
    parentSha = commitSha;
  }
  // If refRes is 404, repo is empty — we'll create the initial ref later.

  // 2. Create blobs for each file
  const treeItems: { path: string; mode: string; type: string; sha: string }[] =
    [];

  for (const file of files) {
    const blobRes = await fetch(`${API}/repos/${repo}/git/blobs`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        content: file.content,
        encoding: "utf-8",
      }),
    });

    if (!blobRes.ok) {
      throw new Error(
        `Failed to create blob for ${file.path}: ${blobRes.status}`
      );
    }

    const blobData = await blobRes.json();
    treeItems.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blobData.sha as string,
    });
  }

  // 3. Create a tree
  const treePayload: Record<string, unknown> = { tree: treeItems };
  if (baseTreeSha) {
    treePayload.base_tree = baseTreeSha;
  }

  const treeRes = await fetch(`${API}/repos/${repo}/git/trees`, {
    method: "POST",
    headers: h,
    body: JSON.stringify(treePayload),
  });

  if (!treeRes.ok) {
    throw new Error(`Failed to create tree: ${treeRes.status}`);
  }

  const treeData = await treeRes.json();
  const newTreeSha = treeData.sha as string;

  // 4. Create a commit
  const commitPayload: Record<string, unknown> = {
    message,
    tree: newTreeSha,
  };
  if (parentSha) {
    commitPayload.parents = [parentSha];
  } else {
    commitPayload.parents = [];
  }

  const newCommitRes = await fetch(`${API}/repos/${repo}/git/commits`, {
    method: "POST",
    headers: h,
    body: JSON.stringify(commitPayload),
  });

  if (!newCommitRes.ok) {
    throw new Error(`Failed to create commit: ${newCommitRes.status}`);
  }

  const newCommitData = await newCommitRes.json();
  const newCommitSha = newCommitData.sha as string;

  // 5. Update (or create) the ref
  if (parentSha) {
    // Existing ref — update it
    const updateRes = await fetch(
      `${API}/repos/${repo}/git/refs/heads/main`,
      {
        method: "PATCH",
        headers: h,
        body: JSON.stringify({ sha: newCommitSha }),
      }
    );
    if (!updateRes.ok) {
      throw new Error(`Failed to update ref: ${updateRes.status}`);
    }
  } else {
    // No existing ref — create it
    const createRefRes = await fetch(`${API}/repos/${repo}/git/refs`, {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        ref: "refs/heads/main",
        sha: newCommitSha,
      }),
    });
    if (!createRefRes.ok) {
      throw new Error(`Failed to create ref: ${createRefRes.status}`);
    }
  }
}
