import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Brain, Globe } from "lucide-react";

const VALUES = [
  { icon: Heart, title: "Compassion First", desc: "Every feature is designed with empathy at its core. We believe mental health support should feel human." },
  { icon: Shield, title: "Privacy & Trust", desc: "Built on the Internet Computer blockchain — decentralized, private, and user-owned." },
  { icon: Brain, title: "Evidence-Based", desc: "Our coping tools and risk assessment are rooted in clinical psychology and peer-reviewed research." },
  { icon: Globe, title: "Accessible Always", desc: "Mental health support shouldn't depend on geography, income, or availability. Affinity is always on." },
];

export function AboutPage() {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
        <img
          src="/assets/generated/affinity-logo-transparent.dim_200x200.png"
          alt="Affinity"
          className="h-20 w-20 object-contain mx-auto mb-4"
        />
        <h1 className="font-display text-3xl font-bold">About Affinity</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed max-w-md mx-auto">
          A compassionate AI companion built to make mental wellness support accessible, private, and human.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-5">
            <h2 className="font-display font-bold text-lg mb-2">Our Mission</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              We believe that everyone deserves a safe space to talk about their mental health —
              without stigma, without judgment, and without waiting weeks for an appointment.
              Affinity bridges the gap between moments of struggle and professional support,
              offering compassionate AI guidance and evidence-based tools when you need them most.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Values */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="font-display font-bold text-lg mb-3">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <Card className="shadow-card h-full">
                <CardContent className="p-4 flex gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 shrink-0 self-start">
                    <v.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{v.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{v.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Technology */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="shadow-card">
          <CardContent className="p-5">
            <h2 className="font-display font-bold text-lg mb-2">Technology</h2>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              Affinity is built on the <strong>Internet Computer Protocol (ICP)</strong> — a
              decentralized blockchain that enables truly sovereign, user-owned applications.
              Your data lives in smart contracts (canisters), not on centralized servers that
              can be hacked or monetized without your knowledge.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Blockchain", value: "ICP" },
                { label: "AI Model", value: "LLM" },
                { label: "Privacy", value: "End-to-End" },
              ].map((t) => (
                <div key={t.label} className="bg-muted/50 rounded-xl p-3">
                  <p className="font-bold text-sm text-primary">{t.value}</p>
                  <p className="text-[10px] text-muted-foreground">{t.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Disclaimer */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="bg-muted/50 rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> Affinity is a support tool, not a replacement for professional therapy.
            It does not provide medical diagnoses or emergency crisis intervention.
            Always consult a licensed mental health professional for clinical care.
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center pb-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Affinity. Built with ♥ using{" "}
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
  );
}
