import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MoodEntry {
    emotion_label: string;
    sentiment_score: number;
    created_at: bigint;
    journal_text?: string;
    user_id: Principal;
    risk_score: number;
    mood_score: bigint;
}
export interface AdminAnalytics {
    total_users: bigint;
    risk_alert_counts: {
        low: bigint;
        high: bigint;
        medium: bigint;
    };
    chat_usage_stats: {
        total_sessions: bigint;
        total_messages: bigint;
    };
    average_mood_score: number;
}
export interface RiskAlert {
    resolved: boolean;
    source: string;
    created_at: bigint;
    user_id: Principal;
    trigger_reason: string;
    severity: RiskLevel;
}
export interface ChatMessage {
    session_id: bigint;
    sentiment_score: number;
    created_at: bigint;
    sender: MessageSender;
    risk_score: number;
    message_text: string;
}
export interface AdminLog {
    action: string;
    admin_id: Principal;
    timestamp: bigint;
}
export interface CopingTool {
    title: string;
    duration: bigint;
    content: string;
    category: string;
}
export interface UserProfile {
    role: string;
    created_at: bigint;
    email: string;
    consent_given: boolean;
}
export enum MessageSender {
    ai = "ai",
    user = "user"
}
export enum RiskLevel {
    low = "low",
    high = "high",
    extreme = "extreme",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChatSession(): Promise<bigint>;
    createCopingTool(tool: CopingTool): Promise<bigint>;
    deleteCopingTool(toolId: bigint): Promise<void>;
    endChatSession(sessionId: bigint): Promise<void>;
    getActiveRiskAlerts(): Promise<Array<RiskAlert>>;
    getAdminAnalytics(): Promise<AdminAnalytics>;
    getAdminLogs(): Promise<Array<AdminLog>>;
    getAllCopingTools(): Promise<Array<CopingTool>>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getAnonymizedChatSessions(): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessages(sessionId: bigint): Promise<Array<ChatMessage>>;
    getMoodHistory(user: Principal): Promise<Array<MoodEntry>>;
    getMoodTrend(): Promise<Array<[bigint, number]>>;
    getRiskAlertsByUser(user: Principal): Promise<Array<RiskAlert>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(email: string, consentGiven: boolean): Promise<void>;
    resolveRiskAlert(user: Principal, alertIndex: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendChatMessage(sessionId: bigint, messageText: string): Promise<string>;
    submitMoodEntry(moodScore: bigint, emotionLabel: string, journalText: string | null): Promise<void>;
    updateCopingTool(toolId: bigint, updatedTool: CopingTool): Promise<void>;
}
