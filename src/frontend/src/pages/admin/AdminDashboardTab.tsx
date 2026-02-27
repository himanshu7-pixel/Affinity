import { motion } from "motion/react";
import { Users, TrendingUp, AlertTriangle, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAnalytics } from "../../hooks/useQueries";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function AdminDashboardTab() {
  const { data: analytics, isLoading } = useAdminAnalytics();

  const riskData = analytics
    ? [
        { level: "Low", count: Number(analytics.risk_alert_counts.low), fill: "oklch(0.68 0.18 160)" },
        { level: "Medium", count: Number(analytics.risk_alert_counts.medium), fill: "oklch(0.68 0.16 50)" },
        { level: "High", count: Number(analytics.risk_alert_counts.high), fill: "oklch(0.55 0.2 27)" },
      ]
    : [];

  const STATS = analytics
    ? [
        { label: "Total Users", value: Number(analytics.total_users), icon: Users, color: "text-primary", bg: "bg-primary/10" },
        { label: "Avg Mood Score", value: analytics.average_mood_score.toFixed(1), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Total Sessions", value: Number(analytics.chat_usage_stats.total_sessions), icon: MessageCircle, color: "text-accent", bg: "bg-accent/10" },
        { label: "Total Messages", value: Number(analytics.chat_usage_stats.total_messages), icon: MessageCircle, color: "text-blue-600", bg: "bg-blue-50" },
      ]
    : [];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading ? (
          ["s1","s2","s3","s4"].map((k) => <Skeleton key={k} className="h-24 rounded-2xl" />)
        ) : (
          STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className={`inline-flex p-2 rounded-xl ${stat.bg} mb-2`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="font-display font-bold text-2xl">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Risk chart */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Risk Alerts by Severity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : riskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={riskData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 220)" />
                <XAxis dataKey="level" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {riskData.map((entry) => (
                    <rect key={entry.level} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No analytics data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
