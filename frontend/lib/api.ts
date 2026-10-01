// Owner: Γιώργος — single shared HTTP wrapper
// Responsibilities: NEXT_PUBLIC_API_URL base, Authorization: Bearer <token>,
// JSON parsing, API error parsing, 401 → logout + redirect to /login
export async function apiFetch<T>(_path: string, _init?: RequestInit): Promise<T> {
  throw new Error("apiFetch not implemented");
}
