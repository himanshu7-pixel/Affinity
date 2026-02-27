import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterUser, useSaveUserProfile } from "../hooks/useQueries";
import { toast } from "sonner";

export function RegisterPage() {
  const { login, identity, isInitializing, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const registerUser = useRegisterUser();
  const saveProfile = useSaveUserProfile();

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [formError, setFormError] = useState("");
  const [pendingRegistration, setPendingRegistration] = useState(false);

  const doRegister = useCallback(
    async (emailVal: string, consentVal: boolean) => {
      try {
        await registerUser.mutateAsync({ email: emailVal.trim(), consentGiven: consentVal });
        await saveProfile.mutateAsync({
          email: emailVal.trim(),
          consent_given: consentVal,
          role: "user",
          created_at: BigInt(Date.now()) * BigInt(1_000_000),
        });
        setRegistered(true);
        setPendingRegistration(false);
        toast.success("Account created! Welcome to Affinity.");
        setTimeout(() => void navigate({ to: "/dashboard" }), 1500);
      } catch {
        setPendingRegistration(false);
        toast.error("Something went wrong. Please try again.");
      }
    },
    [registerUser, saveProfile, navigate]
  );

  // After login completes, if we have a pending registration, do it
  useEffect(() => {
    if (!isInitializing && identity && pendingRegistration && !registered) {
      void doRegister(email, consent);
    }
  }, [identity, isInitializing, pendingRegistration, registered, email, consent, doRegister]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setFormError("Please enter a valid email address");
      return;
    }
    if (!consent) {
      setFormError("You must agree to the terms to continue");
      return;
    }
    setFormError("");

    if (!identity) {
      // Mark pending, then trigger login — useEffect will fire after identity set
      setPendingRegistration(true);
      login();
    } else {
      void doRegister(email, consent);
    }
  }

  if (registered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">You're all set!</h2>
          <p className="text-muted-foreground">Taking you to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
              <h1 className="font-display text-2xl font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground text-sm">Begin your wellness journey with Affinity</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {formError}
                </div>
              )}

              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the terms of service and consent to data processing.
                  I understand Affinity is a <strong>support tool</strong>, not a replacement for
                  professional therapy.
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 gap-2 text-base"
                disabled={isLoggingIn || registerUser.isPending || saveProfile.isPending}
              >
                {(isLoggingIn || registerUser.isPending || saveProfile.isPending) ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full inline-block" />
                    Creating Account...
                  </>
                ) : (
                  identity ? "Create Account" : "Continue with Internet Identity"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
