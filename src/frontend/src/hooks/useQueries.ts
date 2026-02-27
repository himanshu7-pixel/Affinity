import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { CopingTool, UserProfile } from "../backend.d";
import type { Principal } from "@icp-sdk/core/principal";

// ── Auth / User ──────────────────────────────────────────────────────────────

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return "guest";
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, consentGiven }: { email: string; consentGiven: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerUser(email, consentGiven);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userRole"] });
    },
  });
}

// ── Mood ─────────────────────────────────────────────────────────────────────

export function useMoodTrend() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["moodTrend"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMoodTrend();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMoodHistory(user: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["moodHistory", user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getMoodHistory(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}

export function useSubmitMoodEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      moodScore,
      emotionLabel,
      journalText,
    }: {
      moodScore: bigint;
      emotionLabel: string;
      journalText: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitMoodEntry(moodScore, emotionLabel, journalText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moodTrend"] });
      queryClient.invalidateQueries({ queryKey: ["moodHistory"] });
      queryClient.invalidateQueries({ queryKey: ["activeRiskAlerts"] });
    },
  });
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export function useCreateChatSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createChatSession();
    },
  });
}

export function useSendChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId, messageText }: { sessionId: bigint; messageText: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendChatMessage(sessionId, messageText);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages", variables.sessionId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["activeRiskAlerts"] });
    },
  });
}

export function useChatMessages(sessionId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["chatMessages", sessionId?.toString()],
    queryFn: async () => {
      if (!actor || sessionId === null) return [];
      return actor.getChatMessages(sessionId);
    },
    enabled: !!actor && !isFetching && sessionId !== null,
  });
}

export function useEndChatSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (sessionId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.endChatSession(sessionId);
    },
  });
}

// ── Coping Tools ─────────────────────────────────────────────────────────────

export function useCopingTools() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["copingTools"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCopingTools();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCopingTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tool: CopingTool) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCopingTool(tool);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["copingTools"] }),
  });
}

export function useUpdateCopingTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ toolId, updatedTool }: { toolId: bigint; updatedTool: CopingTool }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCopingTool(toolId, updatedTool);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["copingTools"] }),
  });
}

export function useDeleteCopingTool() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (toolId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCopingTool(toolId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["copingTools"] }),
  });
}

// ── Risk Alerts ───────────────────────────────────────────────────────────────

export function useActiveRiskAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["activeRiskAlerts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveRiskAlerts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useResolveRiskAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, alertIndex }: { user: Principal; alertIndex: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.resolveRiskAlert(user, alertIndex);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["activeRiskAlerts"] }),
  });
}

// ── Admin ──────────────────────────────────────────────────────────────────────

export function useAdminAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminLogs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["adminLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnonymizedChatSessions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["anonymizedChatSessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnonymizedChatSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
