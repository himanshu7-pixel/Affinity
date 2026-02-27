import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, ChevronDown, ChevronUp, Wind, Leaf, Heart } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCopingTools } from "../hooks/useQueries";
import type { CopingTool } from "../backend.d";

// Fallback seed data so the app never looks empty
const SEED_TOOLS: (CopingTool & { id: number })[] = [
  {
    id: 1,
    title: "4-7-8 Breathing",
    category: "breathing",
    content: "Inhale through your nose for 4 counts. Hold your breath for 7 counts. Exhale completely through your mouth for 8 counts. Repeat 4 cycles. This technique activates the parasympathetic nervous system and can reduce anxiety within minutes.",
    duration: BigInt(5),
  },
  {
    id: 2,
    title: "Box Breathing",
    category: "breathing",
    content: "Inhale slowly for 4 seconds. Hold for 4 seconds. Exhale for 4 seconds. Hold for 4 seconds. Repeat. Used by Navy SEALs, this technique calms the nervous system and improves focus.",
    duration: BigInt(5),
  },
  {
    id: 3,
    title: "5-4-3-2-1 Grounding",
    category: "grounding",
    content: "Name 5 things you can see. 4 things you can physically feel. 3 things you can hear. 2 things you can smell. 1 thing you can taste. This technique anchors you to the present moment and interrupts anxiety spirals.",
    duration: BigInt(5),
  },
  {
    id: 4,
    title: "Body Scan Meditation",
    category: "grounding",
    content: "Lie down comfortably. Close your eyes. Slowly bring attention to each part of your body from toes to crown. Notice sensations without judgment. Release tension as you breathe out. This practice cultivates mindful awareness.",
    duration: BigInt(10),
  },
  {
    id: 5,
    title: "Three Good Things",
    category: "gratitude",
    content: "Write down three things that went well today, no matter how small. For each one, answer: Why did this happen? This evidence-based intervention from positive psychology builds resilience over time.",
    duration: BigInt(5),
  },
  {
    id: 6,
    title: "Gratitude Letter",
    category: "gratitude",
    content: "Think of someone who has positively impacted your life. Write them a sincere letter describing what they did and how it affected you. Studies show this increases happiness and decreases depressive symptoms for up to a month.",
    duration: BigInt(15),
  },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  breathing: Wind,
  grounding: Leaf,
  gratitude: Heart,
};

const CATEGORY_COLORS: Record<string, string> = {
  breathing: "bg-blue-50 text-blue-600 border-blue-100",
  grounding: "bg-emerald-50 text-emerald-600 border-emerald-100",
  gratitude: "bg-rose-50 text-rose-600 border-rose-100",
};

const TABS = ["all", "breathing", "grounding", "gratitude"] as const;
type Tab = typeof TABS[number];

function ToolCard({ tool }: { tool: CopingTool & { id: number } }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = CATEGORY_ICONS[tool.category] ?? Wind;
  const colorClass = CATEGORY_COLORS[tool.category] ?? "bg-muted text-foreground";

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl border ${colorClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">{tool.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-[10px] capitalize px-2 py-0">
                  {tool.category}
                </Badge>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {Number(tool.duration)} min
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 pb-4">
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-sm text-foreground/80 leading-relaxed">{tool.content}</p>
              </div>
              <button
                type="button"
                className={`mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors border ${colorClass}`}
              >
                Start This Exercise
              </button>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function ToolsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const { data: tools, isLoading } = useCopingTools();

  // Merge backend tools with seed tools, de-duplicating by title
  const allTools: (CopingTool & { id: number })[] = (() => {
    if (!tools || tools.length === 0) return SEED_TOOLS;
    const backendTools = tools.map((t, i) => ({ ...t, id: i + 100 }));
    return [...backendTools, ...SEED_TOOLS.filter(
      (s) => !backendTools.some((b) => b.title.toLowerCase() === s.title.toLowerCase())
    )];
  })();

  const filtered = activeTab === "all"
    ? allTools
    : allTools.filter((t) => t.category === activeTab);

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Coping Tools</h1>
        <p className="text-muted-foreground text-sm mt-1">Science-backed techniques for your wellbeing</p>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Tools list */}
      <div className="space-y-3">
        {isLoading ? (
          ["sk1","sk2","sk3","sk4"].map((k) => (
            <Skeleton key={k} className="h-20 w-full rounded-2xl" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-sm">No tools found for this category</p>
          </div>
        ) : (
          filtered.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
