import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveRiskAlerts, useResolveRiskAlert } from "../../hooks/useQueries";
import { RiskLevel } from "../../backend.d";
import { toast } from "sonner";

const SEVERITY_COLORS: Record<string, string> = {
  [RiskLevel.low]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [RiskLevel.medium]: "bg-amber-50 text-amber-700 border-amber-200",
  [RiskLevel.high]: "bg-red-50 text-red-700 border-red-200",
  [RiskLevel.extreme]: "bg-red-900 text-red-100 border-red-800",
};

type AlertFilter = "all" | RiskLevel;

export function AdminRiskAlertsTab() {
  const { data: alerts, isLoading } = useActiveRiskAlerts();
  const resolveAlert = useResolveRiskAlert();
  const [filter, setFilter] = useState<AlertFilter>("all");

  const filtered = (alerts ?? []).filter(
    (a) => filter === "all" || a.severity === filter
  );

  type AlertItem = NonNullable<typeof alerts>[number];
  async function handleResolve(alert: AlertItem, idx: number) {
    try {
      await resolveAlert.mutateAsync({ user: alert.user_id, alertIndex: BigInt(idx) });
      toast.success("Alert resolved");
    } catch {
      toast.error("Could not resolve alert");
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", RiskLevel.low, RiskLevel.medium, RiskLevel.high, RiskLevel.extreme] as AlertFilter[]).map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        ["a1","a2","a3"].map((k) => <Skeleton key={k} className="h-20 rounded-2xl" />)
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
          <p className="font-medium">No active alerts</p>
          <p className="text-xs mt-1">All users are doing well</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert, i) => (
            <motion.div
              key={`${alert.user_id.toString()}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className={`shadow-xs border ${SEVERITY_COLORS[alert.severity] ?? ""}`}>
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-xs">
                          User: {alert.user_id.toString().slice(0, 12)}...
                        </p>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 capitalize">
                          {alert.severity}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                          {alert.source}
                        </Badge>
                      </div>
                      <p className="text-xs mt-1 opacity-80">{alert.trigger_reason}</p>
                      <p className="text-[10px] mt-0.5 opacity-60">
                        {new Date(Number(alert.created_at) / 1_000_000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!alert.resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs shrink-0"
                      onClick={() => void handleResolve(alert, i)}
                      disabled={resolveAlert.isPending}
                    >
                      Resolve
                    </Button>
                  )}
                  {alert.resolved && (
                    <Badge className="text-[9px] bg-emerald-100 text-emerald-700 border-emerald-200">
                      Resolved
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
