"use client";

import { Accessibility, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import {
  ACCESSIBILITY_KEY,
  DEFAULT_ACCESSIBILITY,
  applyPreferences,
  normalizePreferences,
  type AccessibilityPreferences,
} from "./accessibility";

const OPTIONS = [
  ["bold", "Heavier text", "Make letters more prominent."],
  [
    "contrast",
    "High contrast",
    "Stronger text and control borders in either theme.",
  ],
  [
    "spacing",
    "Comfortable spacing",
    "More room between lines and navigation items.",
  ],
  [
    "motion",
    "Reduce motion",
    "Limit animations and transitions. Your device preference is also respected.",
  ],
] as const;

export function AccessibilityMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_ACCESSIBILITY);

  function open() {
    const root = document.documentElement;
    setPreferences(
      normalizePreferences({
        size: root.dataset.a11ySize,
        bold: root.dataset.a11yBold === "true",
        contrast: root.dataset.a11yContrast === "true",
        spacing: root.dataset.a11ySpacing === "true",
        motion: root.dataset.a11yMotion === "true",
      }),
    );
    dialog.current?.showModal();
    setIsOpen(true);
  }

  function update(next: AccessibilityPreferences) {
    setPreferences(next);
    applyPreferences(next);
    try {
      localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(next));
    } catch {
      // Preferences still apply when browser storage is unavailable.
    }
  }

  return (
    <>
      <button
        type="button"
        className="fg-accessibility-trigger fg-press"
        aria-label="Accessibility settings"
        ref={trigger}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={id}
        title="Accessibility settings"
        onClick={open}
      >
        <Accessibility size={19} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        className="fg-accessibility-dialog"
        id={id}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onClose={() => {
          setIsOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              dialog.current?.close();
          }
        }}
      >
        <div className="fg-accessibility-heading">
          <h2 id={`${id}-title`}>Accessibility</h2>
          <button
            type="button"
            className="fg-accessibility-trigger"
            aria-label="Close accessibility settings"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <p id={`${id}-description`} className="fg-accessibility-intro">
          Make Fair Grade comfortable to read and use. Changes apply immediately
          and are saved in this browser.
        </p>
        <label className="fg-accessibility-size">
          <span>Text &amp; interface size</span>
          <select
            value={preferences.size}
            onChange={(event) =>
              update({ ...preferences, size: event.target.value })
            }
          >
            <option value="100">Default — 100%</option>
            <option value="125">Large — 125%</option>
            <option value="150">Extra large — 150%</option>
            <option value="200">Largest — 200%</option>
          </select>
        </label>
        {OPTIONS.map(([key, title, description]) => (
          <label className="fg-accessibility-option" key={key}>
            <span>
              <strong id={`${id}-${key}`}>{title}</strong>
              <small id={`${id}-${key}-help`}>{description}</small>
            </span>
            <input
              type="checkbox"
              aria-labelledby={`${id}-${key}`}
              aria-describedby={`${id}-${key}-help`}
              checked={preferences[key]}
              onChange={(event) =>
                update({ ...preferences, [key]: event.target.checked })
              }
            />
          </label>
        ))}
        <button
          type="button"
          className="fg-accessibility-reset"
          onClick={() => update({ ...DEFAULT_ACCESSIBILITY })}
        >
          Reset accessibility preferences
        </button>
      </dialog>
    </>
  );
}
