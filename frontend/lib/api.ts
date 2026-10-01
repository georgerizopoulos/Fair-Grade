// Every backend call goes through apiFetch(). It:
//   - prefixes NEXT_PUBLIC_API_URL
//   - attaches the token as Authorization: Bearer <token>
//   - turns the API_SPEC error shape into a thrown Error with a readable message
//   - on any 401 clears the token and sends the user to /login
//
// Usage (client components only — it reads localStorage):
//   const { rubrics } = await apiFetch<{ rubrics: Rubric[] }>('/rubrics');
//   await apiFetch('/answers/bulk', { method: 'POST', body: { rubricId, answers } });

export const TOKEN_KEY = "fairgrade_token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiFetch<T = unknown>(
  path: string,
  { body, headers, ...init }: ApiOptions = {},
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  // FormData (file uploads) goes as is; the browser sets the multipart header.
  const isForm = body instanceof FormData;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(isForm ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      `Can't reach the backend at ${API_URL}. Is it running?`,
    );
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const code: string = data?.error?.code ?? "INTERNAL_ERROR";
    const message: string =
      data?.error?.message ?? `Request failed (${res.status})`;

    // A failed login is also a 401, but it should show "wrong password" on the
    // form, not bounce back to /login.
    if (res.status === 401 && path !== "/auth/login") {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    throw new ApiError(res.status, code, message);
  }

  return data as T;
}
