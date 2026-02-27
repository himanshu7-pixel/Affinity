import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  MessageCircle,
  Heart,
  BookOpen,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

const FEATURES = [
  {
    icon: MessageCircle,
    title: "AI Wellness Chat",
    desc: "Talk to Affinity — your empathetic AI companion available 24/7. Get coping strategies and feel heard.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Heart,
    title: "Mood Tracking",
    desc: "Log how you feel daily. Affinity detects patterns and surfaces insights to help you understand your mental health.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    icon: BookOpen,
    title: "Coping Tools Library",
    desc: "Access guided breathing, grounding exercises, and gratitude practices whenever you need them.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Risk Monitoring",
    desc: "Affinity automatically detects distress signals and connects you with emergency resources when it matters most.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const STEPS = [
  { num: "01", title: "Sign Up & Consent", desc: "Create your private account and agree to our transparent data policies." },
  { num: "02", title: "Check In Daily", desc: "Rate your mood and journal your thoughts. It only takes 2 minutes." },
  { num: "03", title: "Chat with Affinity", desc: "Talk through what's on your mind. Affinity listens without judgment." },
  { num: "04", title: "Track Your Progress", desc: "See mood trends and celebrate your growth over time." },
];

const TESTIMONIALS = [
  { quote: "Affinity helped me recognize when I was spiraling before it got bad. The mood check-ins are genuinely useful.", author: "Sarah M.", role: "Graduate Student" },
  { quote: "I use the breathing exercises before every presentation now. Game changer for my anxiety.", author: "David K.", role: "Software Engineer" },
  { quote: "Finally an app that feels like it actually listens. The AI responses are warm and thoughtful.", author: "Priya T.", role: "Teacher" },
];

export function LandingPage() {
  const { identity, isInitializing, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing && identity) {
      void navigate({ to: "/dashboard" });
    }
  }, [identity, isInitializing, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/assets/generated/affinity-logo-transparent.dim_200x200.png"
              alt="Affinity"
              className="h-9 w-9 object-contain"
            />
            <span className="font-display font-bold text-xl text-primary">Affinity</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/70">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Stories</a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={login} disabled={isLoggingIn}>
              Sign In
            </Button>
            <Button size="sm" onClick={login} disabled={isLoggingIn} className="gap-1.5">
              {isLoggingIn ? "Connecting..." : "Get Started"}
              {!isLoggingIn && <ArrowRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url('/assets/generated/hero-bg.dim_1200x600.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-background/85" />

        {/* Decorative blobs */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl -z-10" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-accent/10 blur-3xl -z-10" />

        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI-Powered Mental Wellness
            </div>

            <h1 className="font-display text-5xl md:text-6xl font-extrabold text-foreground leading-[1.1] mb-6">
              Your Mental
              <br />
              <span className="text-primary">Wellness</span>
              <br />
              Companion
            </h1>

            <p className="text-lg text-foreground/70 leading-relaxed mb-8 max-w-xl">
              Affinity combines empathetic AI conversation, science-backed mood tracking, and
              proactive risk monitoring — so you never have to navigate your mental health alone.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Button size="lg" onClick={login} disabled={isLoggingIn} className="gap-2 px-7">
                {isLoggingIn ? "Connecting..." : "Get Started Free"}
                {!isLoggingIn && <ArrowRight className="h-4 w-4" />}
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">Learn More</a>
              </Button>
            </div>

            <div className="flex items-center gap-5 text-sm text-foreground/60">
              {["Free to use", "Private & secure", "No diagnosis"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-y border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-3 text-center">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Affinity is a support tool, not a replacement for professional therapy. If you are in crisis, please call 988 (Suicide & Crisis Lifeline).
          </p>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to thrive
            </h2>
            <p className="text-foreground/60 max-w-md mx-auto">
              Affinity combines multiple evidence-based tools into one calming, private space.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all group"
              >
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-display font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-muted/40">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-foreground/60">Simple. Private. Effective.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative"
              >
                <div className="text-5xl font-display font-black text-primary/15 mb-3">{step.num}</div>
                <h3 className="font-display font-bold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">What users say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card"
              >
                <div className="flex gap-0.5 mb-4">
                  {["s1","s2","s3","s4","s5"].map((k) => (
                    <Star key={k} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5 border-y border-primary/10">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to begin your wellness journey?</h2>
          <p className="text-foreground/60 mb-8">Join thousands who use Affinity every day to support their mental health.</p>
          <Button size="lg" onClick={login} disabled={isLoggingIn} className="gap-2 px-8">
            {isLoggingIn ? "Connecting..." : "Start for Free"}
            {!isLoggingIn && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/affinity-logo-transparent.dim_200x200.png"
                alt="Affinity"
                className="h-6 w-6 object-contain"
              />
              <span className="font-display font-bold text-primary">Affinity</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Affinity is a support tool, not a replacement for professional therapy. If in crisis, call 988.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
