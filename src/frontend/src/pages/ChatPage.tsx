import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, RefreshCw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateChatSession, useSendChatMessage } from "../hooks/useQueries";
import { toast } from "sonner";
import { CrisisOverlay } from "../components/CrisisOverlay";

interface LocalMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  riskHigh?: boolean;
}

const CRISIS_KEYWORDS = [
  "suicide", "suicidal", "kill myself", "end my life", "self-harm",
  "cut myself", "hurt myself", "want to die", "don't want to live",
];

function containsCrisisKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

const COPING_SUGGESTIONS = [
  { title: "4-7-8 Breathing", category: "Breathing", emoji: "🌬️" },
  { title: "5-4-3-2-1 Grounding", category: "Grounding", emoji: "🌱" },
  { title: "Gratitude Journal", category: "Gratitude", emoji: "📔" },
];

const WELCOME_MESSAGE: LocalMessage = {
  id: "welcome",
  sender: "ai",
  text: "Hi there! I'm Affinity, your mental wellness companion 💙\n\nI'm here to listen, support you, and suggest coping strategies. What's on your mind today?\n\n*Remember: I'm a support tool, not a replacement for professional therapy. In a crisis, call 988.*",
  timestamp: new Date(),
};

export function ChatPage() {
  const [messages, setMessages] = useState<LocalMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<bigint | null>(null);
  const [showCrisis, setShowCrisis] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createSession = useCreateChatSession();
  const sendMessage = useSendChatMessage();

  const startNewSession = useCallback(async () => {
    setSessionLoading(true);
    try {
      const id = await createSession.mutateAsync();
      setSessionId(id);
    } catch {
      toast.error("Could not start chat session");
    } finally {
      setSessionLoading(false);
    }
  }, [createSession]);

  // Create session on mount
  useEffect(() => { void startNewSession(); }, [startNewSession]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  async function handleSend() {
    const text = inputText.trim();
    if (!text || !sessionId || sendMessage.isPending) return;

    const isCrisis = containsCrisisKeywords(text);

    const userMsg: LocalMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    if (isCrisis) {
      setShowCrisis(true);
    }

    try {
      const aiResponse = await sendMessage.mutateAsync({ sessionId, messageText: text });

      const isHighRisk = containsCrisisKeywords(aiResponse) || isCrisis;

      const aiMsg: LocalMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponse,
        timestamp: new Date(),
        riskHigh: isHighRisk,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (isHighRisk) {
        setShowCrisis(true);
      }
    } catch {
      const errorMsg: LocalMessage = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  async function handleNewSession() {
    setMessages([WELCOME_MESSAGE]);
    setShowCrisis(false);
    await startNewSession();
  }

  return (
    <>
      {showCrisis && <CrisisOverlay />}

      <div className="flex flex-col h-full md:h-[calc(100vh-73px)]">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/assets/generated/affinity-avatar-transparent.dim_100x100.png" alt="Affinity AI" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-card" />
            </div>
            <div>
              <p className="font-semibold text-sm">Affinity</p>
              <p className="text-xs text-emerald-600 font-medium">Online · AI Wellness Companion</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewSession}
            disabled={sessionLoading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${sessionLoading ? "animate-spin" : ""}`} />
            New Session
          </Button>
        </div>

        {/* Crisis hotline bar */}
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-amber-50 border-b border-amber-100 shrink-0">
          <Phone className="h-3 w-3 text-amber-600" />
          <p className="text-xs text-amber-700">
            In crisis? Call <a href="tel:988" className="font-bold hover:underline">988</a> or text HOME to <a href="sms:741741?body=HOME" className="font-bold hover:underline">741741</a>
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {sessionLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <div className="flex justify-center gap-1 mb-2">
                {["d1","d2","d3"].map((k) => (
                  <div key={k} className="h-2 w-2 rounded-full bg-primary typing-dot" />
                ))}
              </div>
              Starting session...
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.sender === "ai" && (
                  <Avatar className="h-8 w-8 shrink-0 mt-1">
                    <AvatarImage src="/assets/generated/affinity-avatar-transparent.dim_100x100.png" alt="Affinity" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold">
                      A
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[80%] space-y-1 ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : msg.riskHigh
                        ? "bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-sm"
                        : "bg-card border border-border text-foreground rounded-tl-sm shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-start"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src="/assets/generated/affinity-avatar-transparent.dim_100x100.png" alt="Affinity" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs font-bold">A</AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs">
                <div className="flex gap-1 items-center h-4">
                  {["d1","d2","d3"].map((k) => (
                    <div key={k} className="h-2 w-2 rounded-full bg-primary/40 typing-dot" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Coping suggestions after some messages */}
          {messages.length >= 3 && messages.length % 6 === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="ml-11"
            >
              <p className="text-xs text-muted-foreground mb-2 font-medium">💡 Coping suggestions for you:</p>
              <div className="flex flex-wrap gap-2">
                {COPING_SUGGESTIONS.map((tool) => (
                  <Card key={tool.title} className="shadow-xs hover:shadow-card transition-shadow cursor-pointer">
                    <CardContent className="p-3 flex items-center gap-2">
                      <span>{tool.emoji}</span>
                      <div>
                        <p className="text-xs font-medium">{tool.title}</p>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 mt-0.5">
                          {tool.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 bg-card border-t border-border shrink-0">
          <div className="flex items-end gap-3">
            <Textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="resize-none text-sm min-h-[44px] max-h-[120px] flex-1 rounded-xl"
              rows={1}
              disabled={sessionLoading}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!inputText.trim() || sendMessage.isPending || sessionLoading}
              className="h-11 w-11 rounded-xl shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center">
            Affinity is an AI support tool · Not a crisis service · Press Enter to send
          </p>
        </div>
      </div>
    </>
  );
}
