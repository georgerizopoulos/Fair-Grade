import "./design.css";

// New Fair Grade design (static for now). .fg-root holds the colour tokens
// and the light/dark switch that every page's sidebar renders.
export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return <div className="fg-root">{children}</div>;
}
