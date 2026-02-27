import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Users, AlertTriangle, MessageCircle, BarChart2, BookOpen, FileText, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsAdmin } from "../../hooks/useQueries";
import { AdminDashboardTab } from "./AdminDashboardTab";
import { AdminRiskAlertsTab } from "./AdminRiskAlertsTab";
import { AdminChatTab } from "./AdminChatTab";
import { AdminToolsTab } from "./AdminToolsTab";
import { AdminLogsTab } from "./AdminLogsTab";

const ADMIN_TABS = [
  { value: "dashboard", label: "Dashboard", icon: BarChart2 },
  { value: "alerts", label: "Risk Alerts", icon: AlertTriangle },
  { value: "chat", label: "Chat Monitor", icon: MessageCircle },
  { value: "tools", label: "Coping Tools", icon: BookOpen },
  { value: "logs", label: "Audit Logs", icon: FileText },
];

export function AdminPage() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAdmin === false) {
      void navigate({ to: "/dashboard" });
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-5 w-5 text-accent" />
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Admin Panel</p>
        </div>
        <h1 className="font-display text-2xl font-bold">Administration</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor users, alerts, and app health</p>
      </motion.div>

      <Tabs defaultValue="dashboard">
        <TabsList className="flex flex-wrap gap-1 h-auto bg-muted/60 p-1 rounded-xl">
          {ADMIN_TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center gap-1.5 text-xs rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard" className="mt-4">
          <AdminDashboardTab />
        </TabsContent>
        <TabsContent value="alerts" className="mt-4">
          <AdminRiskAlertsTab />
        </TabsContent>
        <TabsContent value="chat" className="mt-4">
          <AdminChatTab />
        </TabsContent>
        <TabsContent value="tools" className="mt-4">
          <AdminToolsTab />
        </TabsContent>
        <TabsContent value="logs" className="mt-4">
          <AdminLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
