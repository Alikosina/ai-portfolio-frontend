"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

// Proxied through app/chat/route.ts so the browser never calls the upstream
// LLM API directly (avoids CORS and keeps the upstream URL server-side).
// Deliberately NOT under /api — that path is already routed by Nginx to a
// separate backend service on the same domain.
const CHAT_API_URL = "/chat";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatWidgetProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const headingWeight = "var(--font-heading-weight)" as CSSProperties["fontWeight"];

const bubbleBase: CSSProperties = {
  fontSize: 13.5,
  lineHeight: 1.55,
  maxWidth: "88%",
  padding: "var(--space-3) var(--space-4)",
  borderRadius: "var(--radius-md)",
};

const userBubble: CSSProperties = {
  ...bubbleBase,
  alignSelf: "flex-end",
  background: "var(--color-accent-900)",
  color: "var(--color-accent-100)",
};

const assistantBubble: CSSProperties = {
  ...bubbleBase,
  alignSelf: "flex-start",
  background: "color-mix(in srgb, var(--color-text) 6%, transparent)",
};

export default function ChatWidget({ open, onOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { response?: string } = await res.json();
      const reply = data.response ?? "Sorry, I didn't get a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setError("Couldn't reach the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!open) {
    return (
      <button
        className="btn btn-primary btn-icon"
        onClick={onOpen}
        title="Ask the AI assistant"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          zIndex: 50,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <i className="ph ph-chat-circle-text" style={{ fontSize: 22 }}></i>
      </button>
    );
  }

  return (
    <aside
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        width: 360,
        background: "var(--color-surface)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: 480,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          padding: "var(--space-4) var(--space-5)",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <i className="ph ph-sparkle" style={{ color: "var(--color-accent-300)", fontSize: 18 }}></i>
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: headingWeight, fontSize: 14, marginRight: "auto" }}>
          AI Assistant
        </span>
        <button className="btn btn-icon btn-ghost" onClick={onClose}>
          <i className="ph ph-x"></i>
        </button>
      </div>

      <div
        ref={listRef}
        style={{
          flex: 1,
          padding: "var(--space-5)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {messages.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--color-neutral-500)", margin: 0 }}>
            Ask me anything about my experience and projects.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "msg-ai" : undefined} style={m.role === "user" ? userBubble : assistantBubble}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="msg-ai" style={assistantBubble}>
            <i className="ph ph-circle-notch" style={{ animation: "spin 1s linear infinite" }}></i>
          </div>
        )}
        {error && (
          <p style={{ fontSize: 12.5, color: "#e5484d", margin: 0 }}>{error}</p>
        )}
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)", padding: "var(--space-4)", borderTop: "1px solid var(--color-divider)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          style={{
            flex: 1,
            background: "var(--color-bg)",
            border: "1px solid var(--color-divider)",
            borderRadius: "var(--radius-md)",
            padding: "0 var(--space-4)",
            color: "var(--color-text)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
          }}
          placeholder="Ask about my work..."
        />
        <button className="btn btn-primary btn-icon" onClick={sendMessage} disabled={loading || !input.trim()}>
          <i className="ph ph-arrow-up"></i>
        </button>
      </div>
    </aside>
  );
}
