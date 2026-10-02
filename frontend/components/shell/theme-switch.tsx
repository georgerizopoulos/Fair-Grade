"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "./icons";
import { THEME_KEY } from "./theme";
import { AccessibilityMenu } from "./accessibility-menu";

// <html data-theme> is the single source of truth; every switch on the page follows it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}
const isDark = () => document.documentElement.dataset.theme === "dark";

// Light/dark switch. The colour tokens in design.css follow
// <html data-theme="dark">; the choice is kept in localStorage.
export function ThemeSwitch() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  function toggle(next: boolean) {
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // private mode / storage blocked: the switch still works for this page
    }
  }

  return (
    <div className="fg-display-controls">
      <AccessibilityMenu />
      <label
        className="fg-theme-switch fg-press"
        title="Light or dark"
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          width: "62px",
          height: "32px",
          padding: "3px",
          borderRadius: "999px",
          background: "rgba(var(--ink-rgb), 0.06)",
          boxShadow: "inset 0 0 0 1px rgba(var(--ink-rgb), 0.06)",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <input
          type="checkbox"
          className="fg-theme-input"
          aria-label="Dark mode"
          checked={dark}
          onChange={(e) => toggle(e.target.checked)}
        />
        <span
          className="fg-theme-thumb"
          style={{
            position: "absolute",
            left: "3px",
            top: "3px",
            width: "26px",
            height: "26px",
            borderRadius: "999px",
            background: "var(--raised)",
            boxShadow:
              "0 1px 2px rgba(var(--shadow-rgb), 0.14), 0 0 0 1px rgba(var(--ink-rgb), 0.06)",
          }}
        />
        <span
          className="fg-theme-sun"
          style={{
            position: "relative",
            width: "26px",
            height: "26px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="sun" size={15} strokeWidth={1.6} />
        </span>
        <span
          className="fg-theme-moon"
          style={{
            position: "relative",
            width: "26px",
            height: "26px",
            marginLeft: "2px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="moon" size={14} strokeWidth={1.6} />
        </span>
      </label>
    </div>
  );
}
