import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, AlertTriangle, Shield, Lock } from "lucide-react";

const STEPS = [
  { title: "Create your account", desc: "Sign in with Internet Identity and register with your email. Your identity is secured by blockchain-based authentication." },
  { title: "Log your mood daily", desc: "Use the Mood Check tab to rate how you feel (1–10), pick an emotion label, and optionally write in your journal. Takes under 2 minutes." },
  { title: "Chat with Affinity", desc: "Open the Chat tab anytime to talk through what's on your mind. Affinity will listen, validate your feelings, and suggest coping strategies." },
  { title: "Explore coping tools", desc: "Browse the Tools library for guided breathing, grounding exercises, and gratitude practices you can do in as little as 5 minutes." },
  { title: "Track your progress", desc: "Visit the Progress tab to see mood trends over time and celebrate your consistency." },
];

const FAQS = [
  {
    q: "Is Affinity a replacement for therapy?",
    a: "No. Affinity is a mental wellness support tool designed to complement — not replace — professional mental health care. If you are struggling, please consult a licensed therapist or counselor.",
  },
  {
    q: "How is my data protected?",
    a: "Affinity runs on the Internet Computer blockchain. Your data is encrypted and stored decentralized. We never sell your data to third parties. You can delete your account at any time.",
  },
  {
    q: "What happens when Affinity detects high risk?",
    a: "If our risk engine detects signs of crisis (e.g., low mood scores, concerning chat messages), Affinity will show an immediate crisis overlay with emergency contact information. Admins will also be notified.",
  },
  {
    q: "How does the AI chat work?",
    a: "Affinity uses an AI model trained to provide empathetic, non-judgmental support. It will never diagnose, prescribe, or give medical advice. It will always recommend professional help for serious concerns.",
  },
  {
    q: "Can I use Affinity anonymously?",
    a: "Your principal identity is pseudonymous. You don't need to share your real name. However, an email is collected for account identification and account recovery.",
  },
  {
    q: "What if I'm in immediate crisis?",
    a: "Call 988 (Suicide & Crisis Lifeline) immediately, or text HOME to 741741. In a life-threatening emergency, call 911. Affinity's AI is not equipped to handle immediate crises.",
  },
];

export function HelpPage() {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Help & How to Use</h1>
        <p className="text-muted-foreground text-sm mt-1">Everything you need to get the most from Affinity</p>
      </motion.div>

      {/* How to use */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h2 className="font-display font-bold text-lg mb-3">Getting Started</h2>
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              className="flex gap-3"
            >
              <div                 className="shrink-0 h-7 w-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-amber-50 border-amber-200 shadow-xs">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-amber-800">Legal Disclaimer</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Affinity is a support tool, NOT a replacement for professional therapy, psychiatry,
                or emergency services. In a crisis, call 988 immediately. Affinity does not provide
                medical diagnoses, prescriptions, or emergency intervention.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="font-display font-bold text-lg mb-3">Privacy & Security</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: Shield, title: "Blockchain Security", desc: "Data stored on the Internet Computer — decentralized and tamper-resistant." },
            { icon: Lock, title: "No Data Selling", desc: "Your health data is never sold or shared with advertisers." },
            { icon: CheckCircle, title: "Pseudonymous", desc: "No real name required. Your identity is protected." },
            { icon: CheckCircle, title: "Delete Anytime", desc: "You can request account deletion at any time." },
          ].map((item) => (
            <Card key={item.title} className="shadow-card">
              <CardContent className="p-4 flex gap-3">
                <item.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display font-bold text-lg mb-3">Frequently Asked Questions</h2>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <Accordion type="single" collapsible className="space-y-0">
              {FAQS.map((faq, i) => (
                <AccordionItem key={faq.q} value={`item-${i}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="text-sm font-medium text-left py-3 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-3">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
