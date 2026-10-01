// Owner: Γιώργος — shared auth helpers
// login(), logout(), getCurrentUser() (GET /auth/me #4 on page load), useRequireRole(role)
export type Role = "instructor" | "ta";

export async function login(_email: string, _password: string): Promise<void> {
  throw new Error("login not implemented");
}

export function logout(): void {
  throw new Error("logout not implemented");
}

export async function getCurrentUser(): Promise<unknown> {
  throw new Error("getCurrentUser not implemented");
}

export function useRequireRole(_role: Role): void {
  throw new Error("useRequireRole not implemented");
}
