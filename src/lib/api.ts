import type { MediaAsset, Product, ProductUpsertPayload } from "@/lib/products";

export type ApiErrorShape = {
  message: string;
  details?: unknown;
  code?: string;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = "ApiError";
  }
}

function resolveApiBase() {
  if (typeof window === "undefined") {
    const nodeProcess = (
      globalThis as typeof globalThis & {
        process?: { env?: Record<string, string | undefined> };
      }
    ).process;
    const serverBase =
      nodeProcess?.env?.BACKEND_URL || nodeProcess?.env?.VITE_API_URL || "http://localhost:4000";
    return `${serverBase.replace(/\/$/, "")}/api`;
  }

  const rawApiBase = import.meta.env.VITE_API_URL as string | undefined;
  if (rawApiBase) {
    return `${rawApiBase.replace(/\/$/, "")}/api`;
  }

  if (import.meta.env.DEV) {
    return `http://${window.location.hostname}:4000/api`;
  }

  return "/api";
}

const apiBase = resolveApiBase();

export function buildApiUrl(path: string) {
  return `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseError(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as ApiErrorShape;
  }

  return { message: response.statusText || "Request failed" };
}

export async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const hasFormData = init.body instanceof FormData;

  if (init.body != null && !hasFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(buildApiUrl(path), {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError(0, "Unable to reach the admin server. Check your connection and try again.");
  }

  if (!response.ok) {
    const errorPayload = await parseError(response);
    throw new ApiError(response.status, errorPayload.message, errorPayload.details);
  }

  if (response.status === 204) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  throw new ApiError(
    response.status,
    "The admin server returned an unexpected response. It may not be connected yet.",
  );
}

export async function fetchPublicProducts() {
  return apiRequest<{ products: Product[] }>("/products");
}

export async function fetchAdminProducts() {
  return apiRequest<{ products: Product[] }>("/admin/products");
}

export async function fetchAdminProduct(id: string) {
  return apiRequest<{ product: Product }>(`/admin/products/${id}`);
}

export async function loginAdmin(payload: { email: string; password: string }) {
  return apiRequest<{ user: { id: string; name: string; email: string; role: string } }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function logoutAdmin() {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}

export async function fetchCurrentUser() {
  return apiRequest<{ user: { id: string; name: string; email: string; role: string } }>(
    "/auth/me",
  );
}

export async function uploadAdminMedia(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return apiRequest<{ media: MediaAsset[] }>("/admin/media/upload", {
    method: "POST",
    body: formData,
  });
}

export async function fetchAdminMedia() {
  return apiRequest<{ media: MediaAsset[] }>("/admin/media");
}

export async function deleteAdminMedia(id: string) {
  return apiRequest<null>(`/admin/media/${id}`, {
    method: "DELETE",
  });
}

export async function saveAdminProduct(values: ProductUpsertPayload, productId?: string) {
  const path = productId ? `/admin/products/${productId}` : "/admin/products";
  return apiRequest<{ product: Product }>(path, {
    method: productId ? "PATCH" : "POST",
    body: JSON.stringify(values),
  });
}

export async function deleteAdminProduct(id: string) {
  return apiRequest<null>(`/admin/products/${id}`, {
    method: "DELETE",
  });
}
