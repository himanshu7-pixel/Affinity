import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnonymizedChatSessions } from "../../hooks/useQueries";

export function AdminChatTab() {
  const { data: sessions, isLoading } = useAnonymizedChatSessions();

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Anonymized Chat Sessions</CardTitle>
            {sessions && (
              <Badge variant="secondary" className="text-xs">
                {sessions.length} sessions
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            All sessions are anonymized. User identities are not shown.
          </p>

          {isLoading ? (
            <div className="space-y-3">
              {["c1","c2","c3"].map((k) => <Skeleton key={k} className="h-16 rounded-xl" />)}
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No chat sessions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session, i) => (
                <motion.div
                  key={`session-${session.slice(0,20)}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-3 p-3 bg-muted/40 rounded-xl"
                >
                  <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80 font-mono break-all">{session}</p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
