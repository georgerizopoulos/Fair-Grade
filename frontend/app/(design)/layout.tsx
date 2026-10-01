import { THEME_BOOT_SCRIPT } from "@/components/shell";
import "./design.css";

// New Fair Grade design. .fg-root holds the colour tokens; dark mode is
// <html data-theme="dark">, restored from localStorage before first paint.
export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      <div className="fg-root">{children}</div>
    </>
  );
}
