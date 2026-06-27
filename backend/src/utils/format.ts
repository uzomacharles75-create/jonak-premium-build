export function normalizeOrigin(value: string) {
  return value.replace(/\/$/, "");
}

export function buildBackendUrl(pathname: string) {
  const base = normalizeOrigin(process.env.BACKEND_URL ?? "http://localhost:4000");
  return `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function safeFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function formatSlugSource(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
