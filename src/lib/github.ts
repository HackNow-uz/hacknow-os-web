import configData from "@/../public/config.json";

const DOCS_REPO = "HackNow-uz/hacknow-os-docs";

const HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const REVALIDATE = 1800;

export interface ReleaseAsset {
  filename: string;
  arch: string;
  size: string;
  sha256: string;
}

export interface ReleaseInfo {
  tag: string;
  name: string;
  date: string;
  prerelease: boolean;
  changelog: string;
  assets: ReleaseAsset[];
}

export interface DocFile {
  name: string;
  path: string;
  size: number;
  html_url: string;
  download_url: string;
}

const RELEASES: ReleaseInfo[] = configData.releases;

export function getLatestRelease(): ReleaseInfo | null {
  return RELEASES[0] ?? null;
}

export function getAllReleases(): ReleaseInfo[] {
  return RELEASES;
}

export function getDownloadUrl(release: ReleaseInfo): string {
  const iso = release.assets.find((a) => a.filename.endsWith(".iso"));
  return iso ? `/releases/${iso.filename}` : "#download";
}

export function getIsoAsset(release: ReleaseInfo): ReleaseAsset | undefined {
  return release.assets.find((a) => a.filename.endsWith(".iso"));
}

export function getTorrentUrl(release: ReleaseInfo): string | null {
  const iso = release.assets.find((a) => a.filename.endsWith(".iso"));
  return iso ? `/releases/${iso.filename}.torrent` : null;
}

export function getZsyncUrl(release: ReleaseInfo): string | null {
  const iso = release.assets.find((a) => a.filename.endsWith(".iso"));
  return iso ? `/releases/${iso.filename}.zsync` : null;
}

async function ghFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getDocs(): Promise<DocFile[]> {
  type GhContent = {
    name: string;
    path: string;
    size: number;
    html_url: string;
    download_url: string;
    type: string;
  };
  const docs = await ghFetch<GhContent[]>(
    `https://api.github.com/repos/${DOCS_REPO}/contents/docs`
  );
  if (!docs) return [];
  return docs
    .filter((d) => d.type === "file" && d.name.endsWith(".md"))
    .map((d) => ({
      name: d.name,
      path: d.path,
      size: d.size,
      html_url: d.html_url,
      download_url: d.download_url,
    }));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("uz", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
