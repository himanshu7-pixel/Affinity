import { motion } from "motion/react";
import { Phone, MessageSquare, Globe, Heart, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HOTLINES = [
  {
    name: "Suicide & Crisis Lifeline",
    contact: "988",
    type: "Call or Text",
    available: "24/7",
    icon: Phone,
    color: "bg-red-50 border-red-100",
    badge: "bg-red-100 text-red-700",
    action: "tel:988",
    cta: "Call 988",
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    type: "Text",
    available: "24/7",
    icon: MessageSquare,
    color: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
    action: "sms:741741?body=HOME",
    cta: "Text Now",
  },
  {
    name: "SAMHSA Helpline",
    contact: "1-800-662-4357",
    type: "Call",
    available: "24/7, Free",
    icon: Phone,
    color: "bg-emerald-50 border-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
    action: "tel:18006624357",
    cta: "Call Now",
  },
  {
    name: "Trevor Project (LGBTQ+)",
    contact: "1-866-488-7386",
    type: "Call or Text",
    available: "24/7",
    icon: Heart,
    color: "bg-purple-50 border-purple-100",
    badge: "bg-purple-100 text-purple-700",
    action: "tel:18664887386",
    cta: "Call Now",
  },
  {
    name: "Veterans Crisis Line",
    contact: "988, Press 1",
    type: "Call",
    available: "24/7",
    icon: Phone,
    color: "bg-amber-50 border-amber-100",
    badge: "bg-amber-100 text-amber-700",
    action: "tel:988",
    cta: "Call 988",
  },
  {
    name: "IASP Global Directory",
    contact: "findahelpline.com",
    type: "Web",
    available: "Global resource",
    icon: Globe,
    color: "bg-teal-50 border-teal-100",
    badge: "bg-teal-100 text-teal-700",
    action: "https://findahelpline.com",
    cta: "Visit Site",
  },
];

const THERAPIST_FINDERS = [
  { name: "Psychology Today", url: "https://www.psychologytoday.com/us/therapists", desc: "Find local therapists by specialty, insurance, and more" },
  { name: "Open Path Collective", url: "https://openpathcollective.org", desc: "Affordable therapy for those with financial need" },
  { name: "BetterHelp", url: "https://www.betterhelp.com", desc: "Online therapy accessible from anywhere" },
  { name: "NAMI Helpline", url: "https://www.nami.org/help", desc: "National Alliance on Mental Illness support" },
];

export function ContactsPage() {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Contacts & Resources</h1>
        <p className="text-muted-foreground text-sm mt-1">You are not alone. Help is always available.</p>
      </motion.div>

      {/* Emergency banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="bg-red-600 text-white rounded-2xl p-4 text-center"
      >
        <p className="font-bold text-lg">In Immediate Danger?</p>
        <p className="text-red-100 text-sm mt-1 mb-3">If you or someone else is in immediate danger, call emergency services.</p>
        <a
          href="tel:911"
          className="inline-flex items-center gap-2 bg-white text-red-700 font-bold px-6 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
        >
          <Phone className="h-4 w-4" />
          Call 911
        </a>
      </motion.div>

      {/* Crisis hotlines */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="font-display font-bold text-lg mb-3">Crisis Hotlines</h2>
        <div className="space-y-3">
          {HOTLINES.map((h, i) => (
            <motion.div
              key={h.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
            >
              <Card className={`shadow-xs border ${h.color}`}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/80 shrink-0">
                    <h.icon className="h-4 w-4 text-foreground/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{h.name}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${h.badge}`}>
                        {h.available}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/70 mt-0.5">{h.contact}</p>
                    <p className="text-xs text-muted-foreground">{h.type}</p>
                  </div>
                  <a
                    href={h.action}
                    target={h.action.startsWith("http") ? "_blank" : undefined}
                    rel={h.action.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="shrink-0 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold border border-current/20 hover:bg-gray-50 transition-colors text-foreground"
                  >
                    {h.cta}
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Therapist finders */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="font-display font-bold text-lg mb-3">Find a Therapist</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {THERAPIST_FINDERS.map((f) => (
            <Card key={f.name} className="shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{f.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Emergency contacts section */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="shadow-card bg-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Emergency Contact Reminder</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>• Save at least one trusted person&apos;s number as "ICE" (In Case of Emergency)</p>
            <p>• Share your Affinity wellness status with someone you trust</p>
            <p>• Keep your therapist&apos;s after-hours line accessible</p>
            <p className="text-xs pt-2 text-muted-foreground/60">
              Affinity is a support tool, not a replacement for professional care.
            </p>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
