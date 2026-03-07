import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSelector from "./LanguageSelector";
import { Home, Grid3X3, MessageCircle, LayoutDashboard, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { tr } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: tr("home"), icon: Home },
    { to: "/schemes", label: tr("schemes"), icon: Grid3X3 },
    { to: "/assistant", label: tr("assistant"), icon: MessageCircle },
    { to: "/dashboard", label: tr("dashboard"), icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-saffron flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">स</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground">Sarkar Saathi</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-4 w-4" />
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-saffron text-primary-foreground text-sm font-semibold transition-opacity hover:opacity-90"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2 animate-slide-up">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium ${
                location.pathname === l.to
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <l.icon className="h-5 w-5" />
              {l.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            <LanguageSelector />
            {user ? (
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground w-full"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium gradient-saffron text-primary-foreground"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
