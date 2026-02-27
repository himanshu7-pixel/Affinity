import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module CopingTool {
    public type CopingTool = {
      title : Text;
      category : Text;
      content : Text;
      duration : Nat;
    };
  };

  module MoodEntry {
    public type MoodEntry = {
      user_id : Principal;
      mood_score : Nat;
      emotion_label : Text;
      journal_text : ?Text;
      sentiment_score : Float;
      risk_score : Float;
      created_at : Int;
    };
  };

  module RiskAlert {
    public type RiskLevel = {
      #low;
      #medium;
      #high;
      #extreme;
    };

    public type RiskAlert = {
      user_id : Principal;
      source : Text;
      severity : RiskLevel;
      trigger_reason : Text;
      resolved : Bool;
      created_at : Int;
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type MoodScore = Nat;

  public type EmotionLabel = Text;

  public type MoodEntry = MoodEntry.MoodEntry;

  public type RiskAlert = RiskAlert.RiskAlert;

  public type CopingTool = CopingTool.CopingTool;

  public type UserProfile = {
    email : Text;
    role : Text;
    consent_given : Bool;
    created_at : Int;
  };

  public type ChatSession = {
    id : Nat;
    user_id : Principal;
    started_at : Int;
    ended_at : ?Int;
  };

  public type MessageSender = {
    #user;
    #ai;
  };

  public type ChatMessage = {
    session_id : Nat;
    sender : MessageSender;
    message_text : Text;
    sentiment_score : Float;
    risk_score : Float;
    created_at : Int;
  };

  public type AdminLog = {
    admin_id : Principal;
    action : Text;
    timestamp : Int;
  };

  public type AdminAnalytics = {
    total_users : Nat;
    average_mood_score : Float;
    risk_alert_counts : {
      low : Nat;
      medium : Nat;
      high : Nat;
    };
    chat_usage_stats : {
      total_sessions : Nat;
      total_messages : Nat;
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let copingTools = Map.empty<Nat, CopingTool.CopingTool>();
  let moodEntries = Map.empty<Principal, [MoodEntry.MoodEntry]>();
  let riskAlerts = Map.empty<Principal, [RiskAlert.RiskAlert]>();
  let chatSessions = Map.empty<Nat, ChatSession>();
  let chatMessages = Map.empty<Nat, [ChatMessage]>();
  let adminLogs = Map.empty<Nat, AdminLog>();

  var copingToolCounter = 0;
  var chatSessionCounter = 0;
  var adminLogCounter = 0;

  // Helper function to calculate risk score
  private func calculateRiskScore(moodScore : Nat, text : Text) : Float {
    var risk : Float = 0.0;

    // Suicide/self-harm keywords set risk = 1.0 immediately
    let criticalKeywords = ["suicide", "kill myself", "end my life", "self-harm", "hurt myself", "die"];
    for (keyword in criticalKeywords.vals()) {
      if (text.contains(#text keyword)) {
        return 1.0;
      };
    };

    // mood_score <= 3 adds 0.3 risk
    if (moodScore <= 3) {
      risk += 0.3;
    };

    // negative keywords add 0.3
    let negativeKeywords = ["sad", "depressed", "hopeless", "anxious", "worthless", "alone"];
    for (keyword in negativeKeywords.vals()) {
      if (text.contains(#text keyword)) {
        risk += 0.3;
      };
    };

    // Cap at 1.0
    if (risk > 1.0) {
      risk := 1.0;
    };

    risk;
  };

  // Helper function to create risk alert
  private func createRiskAlert(user : Principal, source : Text, riskScore : Float, triggerReason : Text) : () {
    let severity = if (riskScore >= 0.7) {
      #high;
    } else if (riskScore >= 0.3) {
      #medium;
    } else {
      #low;
    };

    let alert : RiskAlert.RiskAlert = {
      user_id = user;
      source = source;
      severity = severity;
      trigger_reason = triggerReason;
      resolved = false;
      created_at = Time.now();
    };

    let existingAlerts = switch (riskAlerts.get(user)) {
      case (null) { [] };
      case (?alerts) { alerts };
    };

    riskAlerts.add(user, existingAlerts.concat([alert]));
  };

  // Helper function to log admin action
  private func logAdminAction(admin : Principal, action : Text) : () {
    adminLogCounter += 1;
    let log : AdminLog = {
      admin_id = admin;
      action = action;
      timestamp = Time.now();
    };
    adminLogs.add(adminLogCounter, log);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User Registration
  public shared ({ caller }) func registerUser(email : Text, consentGiven : Bool) : async () {
    if (not consentGiven) {
      Runtime.trap("User must give consent to register");
    };

    let profile : UserProfile = {
      email = email;
      role = "user";
      consent_given = consentGiven;
      created_at = Time.now();
    };

    userProfiles.add(caller, profile);
  };

  // Mood Entry Management
  public shared ({ caller }) func submitMoodEntry(
    moodScore : Nat,
    emotionLabel : Text,
    journalText : ?Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit mood entries");
    };

    let text = switch (journalText) {
      case (null) { "" };
      case (?t) { t };
    };

    let riskScore = calculateRiskScore(moodScore, emotionLabel # " " # text);

    let entry : MoodEntry.MoodEntry = {
      user_id = caller;
      mood_score = moodScore;
      emotion_label = emotionLabel;
      journal_text = journalText;
      sentiment_score = 0.0; // Placeholder for AI calculation
      risk_score = riskScore;
      created_at = Time.now();
    };

    let existingEntries = switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) { entries };
    };

    moodEntries.add(caller, existingEntries.concat([entry]));

    // Create risk alert if needed
    if (riskScore >= 0.3) {
      let reason = if (riskScore >= 1.0) {
        "Critical keywords detected";
      } else if (moodScore <= 3) {
        "Low mood score";
      } else {
        "Negative sentiment detected";
      };
      createRiskAlert(caller, "mood", riskScore, reason);
    };
  };

  public query ({ caller }) func getMoodHistory(user : Principal) : async [MoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve mood history");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own mood history");
    };

    switch (moodEntries.get(user)) {
      case (null) { [] };
      case (?entries) { entries };
    };
  };

  public query ({ caller }) func getMoodTrend() : async [(Int, Float)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve mood trends");
    };

    switch (moodEntries.get(caller)) {
      case (null) { [] };
      case (?entries) {
        Array.tabulate<(Int, Float)>(entries.size(), func(i) { (entries[i].created_at, entries[i].mood_score.toFloat()) });
      };
    };
  };

  // Chat Session Management
  public shared ({ caller }) func createChatSession() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create chat sessions");
    };

    chatSessionCounter += 1;
    let session : ChatSession = {
      id = chatSessionCounter;
      user_id = caller;
      started_at = Time.now();
      ended_at = null;
    };

    chatSessions.add(chatSessionCounter, session);
    chatMessages.add(chatSessionCounter, []);
    chatSessionCounter;
  };

  public shared ({ caller }) func sendChatMessage(sessionId : Nat, messageText : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    let session = switch (chatSessions.get(sessionId)) {
      case (null) { Runtime.trap("Chat session not found") };
      case (?s) { s };
    };

    if (session.user_id != caller) {
      Runtime.trap("Unauthorized: Can only send messages in your own session");
    };

    let riskScore = calculateRiskScore(5, messageText);

    let userMessage : ChatMessage = {
      session_id = sessionId;
      sender = #user;
      message_text = messageText;
      sentiment_score = 0.0;
      risk_score = riskScore;
      created_at = Time.now();
    };

    let existingMessages = switch (chatMessages.get(sessionId)) {
      case (null) { [] };
      case (?msgs) { msgs };
    };

    chatMessages.add(sessionId, existingMessages.concat([userMessage]));

    // Create risk alert if needed
    if (riskScore >= 0.3) {
      let reason = if (riskScore >= 1.0) {
        "Critical keywords in chat";
      } else {
        "Concerning chat content";
      };
      createRiskAlert(caller, "chat", riskScore, reason);
    };

    // Generate AI response
    let aiResponse = "I'm Affinity, your empathetic mental wellness assistant. I'm here to support you. How are you feeling today?";

    let aiMessage : ChatMessage = {
      session_id = sessionId;
      sender = #ai;
      message_text = aiResponse;
      sentiment_score = 0.5;
      risk_score = 0.0;
      created_at = Time.now();
    };

    let newUserMessages = existingMessages.concat([userMessage]);
    let newAiMessages = newUserMessages.concat([aiMessage]);
    chatMessages.add(sessionId, newAiMessages);

    aiResponse;
  };

  public query ({ caller }) func getChatMessages(sessionId : Nat) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view chat messages");
    };

    let session = switch (chatSessions.get(sessionId)) {
      case (null) { Runtime.trap("Chat session not found") };
      case (?s) { s };
    };

    if (session.user_id != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own chat messages");
    };

    switch (chatMessages.get(sessionId)) {
      case (null) { [] };
      case (?msgs) { msgs };
    };
  };

  public shared ({ caller }) func endChatSession(sessionId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can end chat sessions");
    };

    let session = switch (chatSessions.get(sessionId)) {
      case (null) { Runtime.trap("Chat session not found") };
      case (?s) { s };
    };

    if (session.user_id != caller) {
      Runtime.trap("Unauthorized: Can only end your own session");
    };

    let updatedSession = {
      session with
      ended_at = ?Time.now();
    };

    chatSessions.add(sessionId, updatedSession);
  };

  // Coping Tools Management
  public query ({ caller }) func getAllCopingTools() : async [CopingTool.CopingTool] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can read coping tools");
    };
    copingTools.values().toArray();
  };

  public shared ({ caller }) func createCopingTool(tool : CopingTool.CopingTool) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create coping tools");
    };
    copingToolCounter += 1;
    copingTools.add(copingToolCounter, tool);
    logAdminAction(caller, "Created coping tool: " # tool.title);
    copingToolCounter;
  };

  public shared ({ caller }) func updateCopingTool(toolId : Nat, updatedTool : CopingTool.CopingTool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update coping tools");
    };
    switch (copingTools.get(toolId)) {
      case (null) { Runtime.trap("Coping tool not found") };
      case (?_) {
        copingTools.add(toolId, updatedTool);
        logAdminAction(caller, "Updated coping tool ID: " # toolId.toText());
      };
    };
  };

  public shared ({ caller }) func deleteCopingTool(toolId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete coping tools");
    };
    switch (copingTools.get(toolId)) {
      case (null) { Runtime.trap("Coping tool not found") };
      case (?_) {
        copingTools.remove(toolId);
        logAdminAction(caller, "Deleted coping tool ID: " # toolId.toText());
      };
    };
  };

  // Risk Alert Management
  public query ({ caller }) func getRiskAlertsByUser(user : Principal) : async [RiskAlert.RiskAlert] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own risk alerts");
    };

    switch (riskAlerts.get(user)) {
      case (null) { [] };
      case (?alerts) { alerts };
    };
  };

  public query ({ caller }) func getActiveRiskAlerts() : async [RiskAlert.RiskAlert] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all risk alerts");
    };

    let allAlerts = riskAlerts.values().toArray();
    if (allAlerts.size() > 0) {
      allAlerts[0]
        .concat(allAlerts.sliceToArray(1, allAlerts.size()))
        .filter<RiskAlert.RiskAlert>(
          func(alert) { not alert.resolved }
        );
    } else { [] };
  };

  public shared ({ caller }) func resolveRiskAlert(user : Principal, alertIndex : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can resolve risk alerts");
    };

    switch (riskAlerts.get(user)) {
      case (null) {
        Runtime.trap("No risk alerts found for user");
      };
      case (?alerts) {
        if (alertIndex >= alerts.size()) {
          Runtime.trap("Alert index out of bounds");
        };
        let updatedAlerts = Array.tabulate(
          alerts.size(),
          func(idx : Nat) : RiskAlert.RiskAlert {
            if (idx == alertIndex) {
              { alerts[idx] with resolved = true };
            } else {
              alerts[idx];
            };
          }
        );
        riskAlerts.add(user, updatedAlerts);
        logAdminAction(caller, "Resolved risk alert for user");
      };
    };
  };

  // Admin Features
  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    userProfiles.entries().toArray();
  };

  public query ({ caller }) func getAnonymizedChatSessions() : async [Text] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view anonymized sessions");
    };

    let chatSessionsValues = chatSessions.values().toArray();
    if (chatSessionsValues.size() == 0) {
      return [];
    };

    Array.tabulate<Text>(
      chatSessionsValues.size(),
      func(i) {
        "Session " # chatSessionsValues[i].id.toText() # " - User Hash: REDACTED";
      },
    );
  };

  public query ({ caller }) func getAdminAnalytics() : async AdminAnalytics {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let totalUsers = userProfiles.size();

    var totalMoodScore : Float = 0.0;
    var moodCount : Nat = 0;
    for (entries in moodEntries.values()) {
      for (entry in entries.vals()) {
        totalMoodScore += entry.mood_score.toFloat();
        moodCount += 1;
      };
    };

    let avgMood = if (moodCount > 0) {
      totalMoodScore / moodCount.toFloat();
    } else {
      0.0;
    };

    var lowCount : Nat = 0;
    var mediumCount : Nat = 0;
    var highCount : Nat = 0;

    for (alerts in riskAlerts.values()) {
      for (alert in alerts.vals()) {
        switch (alert.severity) {
          case (#low) { lowCount += 1 };
          case (#medium) { mediumCount += 1 };
          case (#high) { highCount += 1 };
          case (#extreme) { highCount += 1 };
        };
      };
    };

    let totalSessions = chatSessions.size();
    var totalMessages : Nat = 0;
    for (msgs in chatMessages.values()) {
      totalMessages += msgs.size();
    };

    {
      total_users = totalUsers;
      average_mood_score = avgMood;
      risk_alert_counts = {
        low = lowCount;
        medium = mediumCount;
        high = highCount;
      };
      chat_usage_stats = {
        total_sessions = totalSessions;
        total_messages = totalMessages;
      };
    };
  };

  public query ({ caller }) func getAdminLogs() : async [AdminLog] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view audit logs");
    };

    adminLogs.values().toArray();
  };
};
