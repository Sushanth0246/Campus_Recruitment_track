import { Menu } from "lucide-react";

export default function Topbar({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-base/80 backdrop-blur px-5 py-5 md:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-ink-muted">
          <Menu size={22} />
        </button>
        <div>
          <h1 className="font-display text-xl md:text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-ink-faint mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
