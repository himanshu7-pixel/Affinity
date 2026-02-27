import { motion } from "motion/react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminLogs } from "../../hooks/useQueries";

export function AdminLogsTab() {
  const { data: logs, isLoading } = useAdminLogs();

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Audit Logs</CardTitle>
            {logs && (
              <span className="text-xs text-muted-foreground">{logs.length} entries</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {["l1","l2","l3","l4"].map((k) => <Skeleton key={k} className="h-14 rounded-xl" />)}
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No audit logs yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, i) => (
                <motion.div
                  key={`log-${log.admin_id.toString()}-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-3 p-3 bg-muted/40 rounded-xl"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{log.action}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {log.admin_id.toString().slice(0, 16)}...
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(Number(log.timestamp) / 1_000_000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
