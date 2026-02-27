import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, HelpCircle, Info, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useUserProfile } from "../../hooks/useQueries";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/help", label: "Help", icon: HelpCircle },
  { to: "/about", label: "About", icon: Info },
];

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex flex-col h-dvh bg-background overflow-hidden">
      {/* Top AppBar */}
      <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-xs z-20 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src="/assets/generated/affinity-logo-transparent.dim_200x200.png"
            alt="Affinity"
            className="h-8 w-8 object-contain"
          />
          <span className="font-display font-bold text-lg text-primary">Affinity</span>
        </Link>

        <button
          type="button"
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      </header>

      {/* Slide-out drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-card shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display font-bold text-lg text-primary">Menu</span>
                <button type="button" onClick={() => setMenuOpen(false)} className="p-2 rounded-xl hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 border-b border-border">
                {identity ? (
                  <div>
                    <p className="text-sm text-muted-foreground">Signed in as</p>
                    <p className="font-medium text-sm truncate">{profile?.email ?? identity.getPrincipal().toString().slice(0, 16) + "..."}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not signed in</p>
                )}
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {[
                  { to: "/dashboard", label: "Dashboard" },
                  { to: "/mood", label: "Mood Check" },
                  { to: "/chat", label: "AI Chat" },
                  { to: "/tools", label: "Coping Tools" },
                  { to: "/progress", label: "Progress" },
                  { to: "/contacts", label: "Contacts" },
                  { to: "/help", label: "Help" },
                  { to: "/about", label: "About" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      currentPath === item.to
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {identity && (
                <div className="p-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { clear(); setMenuOpen(false); }}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="shrink-0 bg-card border-t border-border shadow-bottom-nav z-20">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = currentPath === to || (to === "/dashboard" && currentPath === "/");
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-1 flex-1 py-2 transition-colors"
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-primary/15" : ""}`}>
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
