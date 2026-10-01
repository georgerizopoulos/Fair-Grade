// Kept out of theme-switch.tsx: constants exported from a "use client" file
// can't be read by server components.
export const THEME_KEY = "fairgrade_theme";

// Runs before the page paints (see app/(design)/layout.tsx), so a dark choice
// doesn't flash light on navigation or refresh.
export const THEME_BOOT_SCRIPT = `try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;
