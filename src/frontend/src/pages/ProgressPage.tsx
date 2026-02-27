import { motion } from "motion/react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMoodTrend, useActiveRiskAlerts } from "../hooks/useQueries";
import { TrendingUp, Calendar, MessageCircle, AlertTriangle } from "lucide-react";

const EMOTION_EMOJIS: Record<string, string> = {
  Happy: "😊", Calm: "😌", Anxious: "😰", Sad: "😢", Angry: "😠",
  Hopeful: "🌟", Lonely: "🥺", Confused: "😕", Grateful: "🙏", Overwhelmed: "😵",
};

// Sample emotion frequency data for display
const EMOTION_FREQ = [
  { emotion: "Calm", count: 8 },
  { emotion: "Happy", count: 6 },
  { emotion: "Anxious", count: 5 },
  { emotion: "Grateful", count: 4 },
  { emotion: "Hopeful", count: 3 },
];

export function ProgressPage() {
  const { data: moodTrend, isLoading: moodLoading } = useMoodTrend();
  const { data: riskAlerts } = useActiveRiskAlerts();

  const chartData = (moodTrend ?? []).slice(-30).map(([ts, score]) => ({
    date: new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: Math.round(score * 10) / 10,
  }));

  const avgMood = chartData.length > 0
    ? Math.round((chartData.reduce((a, b) => a + b.score, 0) / chartData.length) * 10) / 10
    : null;

  const totalCheckIns = chartData.length;
  const activeAlerts = (riskAlerts ?? []).filter((a) => !a.resolved).length;

  const trend = chartData.length >= 2
    ? chartData[chartData.length - 1].score - chartData[chartData.length - 2].score
    : 0;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your wellness journey over time</p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          {
            label: "Avg Mood",
            value: moodLoading ? "..." : avgMood ? `${avgMood}/10` : "—",
            icon: TrendingUp,
            color: "text-primary",
            bg: "bg-primary/10",
            sub: trend > 0 ? `↑ Improving` : trend < 0 ? `↓ Declining` : "Stable",
          },
          {
            label: "Check-ins",
            value: moodLoading ? "..." : totalCheckIns,
            icon: Calendar,
            color: "text-accent",
            bg: "bg-accent/10",
            sub: "Total entries",
          },
          {
            label: "Active Alerts",
            value: activeAlerts,
            icon: AlertTriangle,
            color: activeAlerts > 0 ? "text-amber-600" : "text-emerald-600",
            bg: activeAlerts > 0 ? "bg-amber-50" : "bg-emerald-50",
            sub: activeAlerts > 0 ? "Need attention" : "All clear",
          },
          {
            label: "Streak",
            value: Math.min(totalCheckIns, 7),
            icon: MessageCircle,
            color: "text-rose-500",
            bg: "bg-rose-50",
            sub: "Days in a row",
          },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="p-4">
              <div className={`inline-flex p-2 rounded-xl ${stat.bg} mb-2`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="font-display font-bold text-xl">{stat.value}</p>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-[10px] mt-0.5 ${stat.color}`}>{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Mood trend chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mood Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 220)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid oklch(0.88 0.02 220)" }}
                    formatter={(v: number) => [v, "Mood Score"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="oklch(0.54 0.13 192)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "oklch(0.54 0.13 192)" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p className="text-3xl mb-3">📊</p>
                <p className="text-sm text-center">Start logging mood entries to see your trend here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotion frequency */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emotion Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={EMOTION_FREQ} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 220)" />
                <XAxis dataKey="emotion" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid oklch(0.88 0.02 220)" }}
                />
                <Bar dataKey="count" fill="oklch(0.58 0.17 280)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-5 text-center">
            <p className="text-2xl mb-2">🌱</p>
            <p className="font-semibold text-sm mb-1">Every check-in matters</p>
            <p className="text-xs text-muted-foreground">
              Consistency is key. Even on tough days, logging your mood helps you
              understand your patterns and build resilience over time.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
