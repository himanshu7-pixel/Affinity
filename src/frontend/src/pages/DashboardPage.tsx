import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, MessageCircle, BookOpen, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile, useMoodTrend, useActiveRiskAlerts } from "../hooks/useQueries";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { CrisisOverlay } from "../components/CrisisOverlay";
import { RiskLevel } from "../backend.d";

const MOOD_EMOJIS: Record<number, string> = {
  1: "😢", 2: "😞", 3: "😟", 4: "😐", 5: "😶",
  6: "🙂", 7: "😊", 8: "😄", 9: "😁", 10: "🤩",
};

function getMoodEmoji(score: number): string {
  const rounded = Math.min(10, Math.max(1, Math.round(score)));
  return MOOD_EMOJIS[rounded] ?? "😶";
}

const QUICK_ACTIONS = [
  { to: "/mood", label: "Mood Check", icon: Heart, color: "bg-rose-50 text-rose-600 hover:bg-rose-100" },
  { to: "/chat", label: "Open Chat", icon: MessageCircle, color: "bg-primary/10 text-primary hover:bg-primary/20" },
  { to: "/tools", label: "Coping Tools", icon: BookOpen, color: "bg-accent/10 text-accent hover:bg-accent/20" },
  { to: "/progress", label: "Progress", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
];

export function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: moodTrend, isLoading: moodLoading } = useMoodTrend();
  const { data: riskAlerts, isLoading: alertsLoading } = useActiveRiskAlerts();

  const displayName = profile?.email
    ? profile.email.split("@")[0]
    : identity?.getPrincipal().toString().slice(0, 8) ?? "there";

  const activeAlerts = riskAlerts?.filter((a) => !a.resolved) ?? [];
  const highRiskAlerts = activeAlerts.filter(
    (a) => a.severity === RiskLevel.high || a.severity === RiskLevel.extreme
  );

  // Build chart data
  const chartData = (moodTrend ?? []).slice(-7).map(([ts, score]) => ({
    time: new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    score: Math.round(score * 10) / 10,
  }));

  const latestMood = chartData.length > 0 ? chartData[chartData.length - 1].score : null;

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      {/* Crisis overlay if any high-risk alerts */}
      {highRiskAlerts.length > 0 && <CrisisOverlay />}

      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-5">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-2"
        >
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-bold mt-1">
            {greeting}, {profileLoading ? "..." : displayName}! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">How are you feeling today?</p>
        </motion.div>

        {/* Risk alerts banner */}
        {!alertsLoading && activeAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border ${
              highRiskAlerts.length > 0
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {highRiskAlerts.length > 0 ? "High Risk Alert" : "Wellness Check"}
              </p>
              <p className="text-xs mt-0.5 opacity-80">
                {highRiskAlerts.length > 0
                  ? "We detected signs of distress. Please reach out for support."
                  : `${activeAlerts.length} active wellness alert${activeAlerts.length > 1 ? "s" : ""} — take care of yourself today.`}
              </p>
              {highRiskAlerts.length > 0 && (
                <p className="text-xs font-bold mt-1">Call 988 — Suicide & Crisis Lifeline</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Mood card + chart */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Today's mood */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="shadow-card h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today&apos;s Mood</CardTitle>
              </CardHeader>
              <CardContent>
                {moodLoading ? (
                  <Skeleton className="h-14 w-full" />
                ) : latestMood ? (
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getMoodEmoji(latestMood)}</span>
                    <div>
                      <p className="font-display font-bold text-3xl">{latestMood}</p>
                      <p className="text-xs text-muted-foreground">out of 10</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl mb-1">🌱</p>
                    <p className="text-sm text-muted-foreground">No check-in yet today</p>
                    <Link to="/mood">
                      <Button size="sm" variant="outline" className="mt-3 text-xs">
                        Check In Now
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Trend chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-card h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">7-Day Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {moodLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={80}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="time" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8 }}
                        formatter={(v: number) => [v, "Mood"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="oklch(0.54 0.13 192)"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "oklch(0.54 0.13 192)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Log mood entries to see trends
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <p className="text-xs font-semibold text-foreground/60 mb-3 uppercase tracking-wide">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon, color }) => (
              <Link key={to} to={to}>
                <button
                  type="button"
                  className={`w-full flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95 min-h-[80px] ${color}`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-semibold text-center leading-tight">{label}</span>
                </button>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Wellness tip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Daily Wellness Tip</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Even 5 minutes of mindful breathing can significantly reduce cortisol levels.
                  Try the 4-7-8 technique: inhale for 4 seconds, hold for 7, exhale for 8.
                </p>
              </div>
              <Link to="/tools">
                <Button size="sm" variant="ghost" className="shrink-0 text-primary">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="pt-4 pb-2 text-center">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
