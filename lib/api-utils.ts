export function parseApiError(data: unknown, fallback = "Something went wrong"): string {
  if (!data || typeof data !== "object") return fallback;
  const obj = data as Record<string, unknown>;
  if (typeof obj.error === "string") return obj.error;
  if (obj.error && typeof obj.error === "object") {
    const flat = obj.error as { fieldErrors?: Record<string, string[]>; formErrors?: string[] };
    const fieldMsg = flat.fieldErrors && Object.values(flat.fieldErrors).flat()[0];
    if (fieldMsg) return fieldMsg;
    if (flat.formErrors?.[0]) return flat.formErrors[0];
  }
  return fallback;
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, init);
    const data = await res.json();
    if (!res.ok) return { data: null, error: parseApiError(data) };
    return { data: data as T, error: null };
  } catch {
    return { data: null, error: "Network error. Please try again." };
  }
}
