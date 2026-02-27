import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  MessageCircle,
  Heart,
  BarChart2,
  BookOpen,
  Users,
  HelpCircle,
  Info,
  Shield,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useUserProfile, useIsAdmin } from "../../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const USER_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/mood", label: "Mood Check", icon: Heart },
  { to: "/chat", label: "AI Chat", icon: MessageCircle },
  { to: "/tools", label: "Coping Tools", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: BarChart2 },
];

const INFO_NAV = [
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/help", label: "Help", icon: HelpCircle },
  { to: "/about", label: "About", icon: Info },
];

const ADMIN_NAV = [
  { to: "/admin", label: "Admin Panel", icon: Shield },
];

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: isAdmin } = useIsAdmin();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const initials = profile?.email
    ? profile.email.slice(0, 2).toUpperCase()
    : identity?.getPrincipal().toString().slice(0, 2).toUpperCase() ?? "?";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-64 shrink-0 bg-card border-r border-border flex flex-col shadow-sidebar z-10"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
              <img
                src="/assets/generated/affinity-logo-transparent.dim_200x200.png"
                alt="Affinity"
                className="h-9 w-9 object-contain"
              />
              <span className="font-display font-bold text-xl text-primary">Affinity</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Main
              </p>
              {USER_NAV.map(({ to, label, icon: Icon }) => {
                const isActive = currentPath === to || (to === "/dashboard" && currentPath === "/");
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}

              <div className="pt-2">
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Info
                </p>
                {INFO_NAV.map(({ to, label, icon: Icon }) => {
                  const isActive = currentPath === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </div>

              {isAdmin && (
                <div className="pt-2">
                  <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Admin
                  </p>
                  {ADMIN_NAV.map(({ to, label, icon: Icon }) => {
                    const isActive = currentPath.startsWith(to);
                    return (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-accent text-accent-foreground shadow-xs"
                            : "text-foreground/70 hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>

            {/* User info */}
            <div className="p-3 border-t border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-muted transition-colors text-left"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{profile?.email ?? "User"}</p>
                      <p className="text-xs text-muted-foreground">{isAdmin ? "Admin" : "Member"}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={clear} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border shrink-0 z-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {!sidebarOpen && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <img
                src="/assets/generated/affinity-logo-transparent.dim_200x200.png"
                alt="Affinity"
                className="h-7 w-7 object-contain"
              />
              <span className="font-display font-bold text-lg text-primary">Affinity</span>
            </Link>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <button type="button" className="p-2 rounded-xl hover:bg-muted transition-colors relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <p className="text-sm text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
