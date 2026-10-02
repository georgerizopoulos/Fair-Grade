export const ACCESSIBILITY_KEY = "fairgrade_accessibility";
export const DEFAULT_ACCESSIBILITY = {
  size: "100",
  bold: false,
  contrast: false,
  spacing: false,
  motion: false,
};
export type AccessibilityPreferences = typeof DEFAULT_ACCESSIBILITY;

export function normalizePreferences(value: unknown): AccessibilityPreferences {
  const saved = (value && typeof value === "object" ? value : {}) as Record<
    string,
    unknown
  >;
  return {
    size: ["100", "125", "150", "200"].includes(String(saved.size))
      ? String(saved.size)
      : "100",
    bold: saved.bold === true,
    contrast: saved.contrast === true,
    spacing: saved.spacing === true,
    motion: saved.motion === true,
  };
}

export function applyPreferences(preferences: AccessibilityPreferences) {
  for (const [key, value] of Object.entries(preferences)) {
    document.documentElement.setAttribute(`data-a11y-${key}`, String(value));
  }
}

// Restore before paint, alongside the theme. Invalid or unavailable storage is harmless.
export const ACCESSIBILITY_BOOT_SCRIPT = `try{const p=(${normalizePreferences.toString()})(JSON.parse(localStorage.getItem("${ACCESSIBILITY_KEY}")||"null"));for(const [k,v] of Object.entries(p))document.documentElement.setAttribute("data-a11y-"+k,String(v))}catch(e){}`;
