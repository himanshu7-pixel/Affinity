# Affinity – Mental Health AI App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full-stack mental health support web app called "Affinity"
- User authentication with consent flow (register/login/logout)
- Role-based access: `user` and `admin` roles
- Mood tracking: submit mood score (1–10), emotion label, optional journal text
- AI Chat interface: empathetic, supportive AI assistant (Affinity persona) with coping suggestions
- Risk engine: rule-based scoring on mood entries and chat messages
  - mood_score ≤ 3 → +0.3 risk
  - Negative sentiment keywords → +0.3 risk
  - 3-day downward trend → +0.2 risk
  - Suicide/self-harm keywords → risk = 1.0 (auto high)
  - Risk levels: low (0–0.3), medium (0.3–0.7), high (0.7–1.0)
- Risk alerts: automatically created when risk threshold triggered, shown in crisis UI to user
- Coping tools library: breathing, grounding, gratitude categories with instructions and duration
- Progress dashboard: mood history chart, chat usage stats, active alerts
- Admin panel:
  - Dashboard: total users, avg mood, risk summary
  - Risk alerts list with severity filter and resolve action
  - Anonymized chat session monitor
  - Coping tools CRUD
  - Audit logs viewer
- Responsive layout: mobile-first with AppBar + Bottom Navigation (4 tabs: Home, Contacts, Help, About), desktop with top navbar and optional sidebar
- Crisis UI overlay triggered automatically on high-risk alert
- Legal disclaimer: "Affinity is a support tool, not a replacement for therapy"

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Select `authorization` component for role-based auth
2. Generate Motoko backend with:
   - Users (with role, consent_given)
   - MoodEntries (score, emotion, journal, sentiment_score, risk_score)
   - ChatSessions and ChatMessages (sender, text, sentiment_score, risk_score)
   - RiskAlerts (source, severity, trigger_reason, resolved)
   - CopingTools (title, category, content, duration)
   - AdminLogs (admin_id, action)
   - Risk engine logic (rule-based scoring)
   - Admin endpoints for monitoring, tool management, alert resolution
3. Build React frontend:
   - Landing page (desktop): hero, features, CTA, navbar
   - Auth pages: register (with consent checkbox), login
   - User dashboard: mood summary cards, active risk alert banner
   - Mood check page: slider + emotion wheel + journal textarea
   - AI Chat page: message thread UI, typing indicator, inline coping suggestion cards, crisis overlay for high risk
   - Coping tools library page: filterable cards
   - Analytics/progress page: mood trend chart, chat stats
   - Admin panel pages: dashboard, risk alerts, chat monitor, tools CRUD, audit logs
   - Responsive: mobile AppBar + BottomNav (Home, Contacts, Help, About), desktop top navbar + sidebar
