import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubmitMoodEntry } from "../hooks/useQueries";
import { toast } from "sonner";

const EMOTIONS = [
  { label: "Happy", emoji: "😊" },
  { label: "Calm", emoji: "😌" },
  { label: "Anxious", emoji: "😰" },
  { label: "Sad", emoji: "😢" },
  { label: "Angry", emoji: "😠" },
  { label: "Hopeful", emoji: "🌟" },
  { label: "Lonely", emoji: "🥺" },
  { label: "Confused", emoji: "😕" },
  { label: "Grateful", emoji: "🙏" },
  { label: "Overwhelmed", emoji: "😵" },
];

const MOOD_LABELS: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: "Very Bad", emoji: "😢", color: "text-red-600" },
  2: { label: "Pretty Bad", emoji: "😞", color: "text-red-500" },
  3: { label: "Bad", emoji: "😟", color: "text-orange-600" },
  4: { label: "Not Great", emoji: "😐", color: "text-orange-500" },
  5: { label: "Okay", emoji: "😶", color: "text-yellow-600" },
  6: { label: "Decent", emoji: "🙂", color: "text-yellow-500" },
  7: { label: "Good", emoji: "😊", color: "text-green-500" },
  8: { label: "Pretty Good", emoji: "😄", color: "text-green-500" },
  9: { label: "Great", emoji: "😁", color: "text-emerald-500" },
  10: { label: "Excellent", emoji: "🤩", color: "text-emerald-600" },
};

export function MoodPage() {
  const [moodScore, setMoodScore] = useState(5);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [journalText, setJournalText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [riskFeedback, setRiskFeedback] = useState<"low" | "medium" | "high" | null>(null);

  const submitMood = useSubmitMoodEntry();

  async function handleSubmit() {
    if (!selectedEmotion) {
      toast.error("Please select an emotion label");
      return;
    }

    try {
      await submitMood.mutateAsync({
        moodScore: BigInt(moodScore),
        emotionLabel: selectedEmotion,
        journalText: journalText.trim() || null,
      });

      // Simple risk assessment for UI feedback
      if (moodScore <= 3) {
        setRiskFeedback("high");
      } else if (moodScore <= 5) {
        setRiskFeedback("medium");
      } else {
        setRiskFeedback("low");
      }

      setSubmitted(true);
    } catch {
      toast.error("Could not save mood entry. Please try again.");
    }
  }

  const moodInfo = MOOD_LABELS[moodScore];

  if (submitted) {
    return (
      <div className="p-4 md:p-6 max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          {riskFeedback === "high" ? (
            <>
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">We hear you</h2>
              <p className="text-muted-foreground mb-4">
                It sounds like today is really tough. You don&apos;t have to face this alone.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-amber-800 mb-1">Resources available now:</p>
                <p className="text-sm text-amber-700">• Call 988 — Suicide &amp; Crisis Lifeline</p>
                <p className="text-sm text-amber-700">• Text HOME to 741741</p>
              </div>
            </>
          ) : riskFeedback === "medium" ? (
            <>
              <span className="text-5xl block mb-4">💙</span>
              <h2 className="font-display text-2xl font-bold mb-2">Check-in saved</h2>
              <p className="text-muted-foreground mb-4">
                You&apos;re doing okay. Remember to be gentle with yourself today.
                Try a coping exercise to lift your spirits.
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-2">Great check-in! 🌟</h2>
              <p className="text-muted-foreground mb-4">
                Wonderful — keep up the positive momentum. Your wellness streak continues!
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={() => { setSubmitted(false); setSelectedEmotion(""); setJournalText(""); }}>
              Log Another Entry
            </Button>
            <Button variant="outline" asChild>
              <a href="/chat">Chat with Affinity</a>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Mood Check-In</h1>
        <p className="text-muted-foreground text-sm mt-1">How are you feeling right now?</p>
      </motion.div>

      {/* Mood slider */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mood Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-5xl">{moodInfo.emoji}</span>
              <p className={`font-display font-bold text-2xl mt-2 ${moodInfo.color}`}>
                {moodScore}/10
              </p>
              <p className={`text-sm font-medium ${moodInfo.color}`}>{moodInfo.label}</p>
            </div>
            <Slider
              value={[moodScore]}
              min={1}
              max={10}
              step={1}
              onValueChange={([v]) => setMoodScore(v)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very bad</span>
              <span>Excellent</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotion picker */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emotion Label</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {EMOTIONS.map(({ label, emoji }) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => setSelectedEmotion(label)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                    selectedEmotion === label
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted hover:bg-muted/80 text-foreground/70"
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="leading-tight text-center" style={{ fontSize: "9px" }}>{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Journal */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Journal <span className="text-xs font-normal">(optional)</span></CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How are you feeling today? What's on your mind?"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              className="resize-none text-sm min-h-[100px]"
              rows={4}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Button
          className="w-full h-12 text-base"
          onClick={handleSubmit}
          disabled={submitMood.isPending || !selectedEmotion}
        >
          {submitMood.isPending ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full inline-block mr-2" />
              Saving...
            </>
          ) : (
            "Save Check-In"
          )}
        </Button>
      </motion.div>
    </div>
  );
}
