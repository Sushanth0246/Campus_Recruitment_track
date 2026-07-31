import { NavLink } from "react-router-dom";
import { LayoutDashboard, Brain, Code2, Users, Trophy, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/aptitude", label: "Aptitude", icon: Brain },
  { to: "/coding", label: "Coding Practice", icon: Code2 },
  { to: "/interview", label: "Mock Interview", icon: Users },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-surface">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="h-9 w-9 rounded-lg bg-amber flex items-center justify-center font-display font-bold text-base text-base">
          P
        </div>
        <div>
          <p className="font-display font-bold text-sm leading-tight">Placement Prep</p>
          <p className="text-[11px] text-ink-faint tracking-wide">Readiness Tracker</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-surfaceAlt text-amber border border-border"
                  : "text-ink-muted hover:text-ink hover:bg-surfaceAlt/60 border border-transparent"
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-display font-bold text-base"
            style={{ backgroundColor: user?.avatarColor || "#F5A623" }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-ink-faint truncate">{user?.targetRole}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted hover:text-coral hover:bg-surfaceAlt/60 transition-colors"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}
