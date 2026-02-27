import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LoginPage() {
  const { login, isLoggingIn, identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && identity) {
      void navigate({ to: "/dashboard" });
    }
  }, [identity, isInitializing, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/assets/generated/affinity-logo-transparent.dim_200x200.png"
            alt="Affinity"
            className="h-8 w-8 object-contain"
          />
          <span className="font-display font-bold text-xl text-primary">Affinity</span>
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
                <img
                  src="/assets/generated/affinity-logo-transparent.dim_200x200.png"
                  alt="Affinity"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <h1 className="font-display text-2xl font-bold mb-2">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Sign in to your Affinity account</p>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 rounded-xl p-4 flex gap-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Secure Authentication</p>
                  <p className="text-xs text-muted-foreground">
                    Affinity uses Internet Identity — a secure, privacy-preserving authentication system.
                    No password required.
                  </p>
                </div>
              </div>

              <Button
                className="w-full h-12 gap-2 text-base"
                onClick={login}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                    Connecting...
                  </>
                ) : (
                  "Sign In with Internet Identity"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Create one here
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                By signing in, you agree that Affinity is a support tool,
                not a replacement for professional therapy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
