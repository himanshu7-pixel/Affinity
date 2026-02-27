import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMobileDetect } from "../../hooks/useMobileDetect";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const isMobile = useMobileDetect();
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && requireAuth && !identity) {
      void navigate({ to: "/login" });
    }
  }, [identity, isInitializing, requireAuth, navigate]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/assets/generated/affinity-logo-transparent.dim_200x200.png"
            alt="Affinity"
            className="h-16 w-16 object-contain animate-pulse"
          />
          <p className="text-muted-foreground text-sm">Loading Affinity...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !identity) return null;

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return <DesktopLayout>{children}</DesktopLayout>;
}
