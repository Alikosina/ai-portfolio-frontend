"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

// Proxied through app/chat/route.ts so the browser never calls the upstream
// LLM API directly (avoids CORS and keeps the upstream URL server-side).
// Deliberately NOT under /api — that path is already routed by Nginx to a
// separate backend service on the same domain.
const CHAT_API_URL = "/chat";

// 2 previous exchanges (user message + assistant reply) == 4 messages.
const HISTORY_MESSAGES_TO_SEND = 4;

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

// Gap between the custom scrollbar thumb and the top/bottom of the list.
const THUMB_INSET = 4;
const THUMB_MIN_HEIGHT = 24;

type Thumb = { top: number; height: number } | null;

export default function ChatWidget({ open, onOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<Thumb>(null);
  const [scrolling, setScrolling] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ y: number; scrollTop: number } | null>(null);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateThumb = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const { clientHeight, scrollHeight, scrollTop } = el;
    if (scrollHeight <= clientHeight) {
      setThumb(null);
      return;
    }
    const track = clientHeight - THUMB_INSET * 2;
    const height = Math.max(THUMB_MIN_HEIGHT, (track * clientHeight) / scrollHeight);
    const top = THUMB_INSET + ((track - height) * scrollTop) / (scrollHeight - clientHeight);
    setThumb({ top, height });
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    updateThumb();
  }, [messages, loading, error, updateThumb]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateThumb);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, updateThumb]);

  useEffect(() => () => clearTimeout(scrollIdleTimer.current), []);

  function handleScroll() {
    updateThumb();
    setScrolling(true);
    clearTimeout(scrollIdleTimer.current);
    scrollIdleTimer.current = setTimeout(() => setScrolling(false), 800);
  }

  function handleThumbPointerDown(e: PointerEvent<HTMLDivElement>) {
    const el = listRef.current;
    if (!el) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { y: e.clientY, scrollTop: el.scrollTop };
    setDragging(true);
  }

  function handleThumbPointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = listRef.current;
    if (!el || !dragStart.current || !thumb) return;
    const track = el.clientHeight - THUMB_INSET * 2;
    const ratio = (el.scrollHeight - el.clientHeight) / (track - thumb.height);
    el.scrollTop = dragStart.current.scrollTop + (e.clientY - dragStart.current.y) * ratio;
  }

  function handleThumbPointerUp(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragStart.current = null;
    setDragging(false);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    // Last 2 exchanges (user + assistant pairs) sent as context for the next turn.
    const history = messages.slice(-HISTORY_MESSAGES_TO_SEND);

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ text, history }),
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
          padding: "var(--space-4) var(--space-6)",
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

      <div className="scroll-area" style={{ flex: 1, minHeight: 0, display: "flex" }}>
        <div
          ref={listRef}
          className="scroll-area-viewport"
          onScroll={handleScroll}
          style={{
            flex: 1,
            padding: "var(--space-6)",
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
              <i className="ph ph-circle-notch" style={{ display: "inline-block", animation: "spin 1s linear infinite" }}></i>
            </div>
          )}
          {error && (
            <p style={{ fontSize: 12.5, color: "#e5484d", margin: 0 }}>{error}</p>
          )}
        </div>
        {thumb && (
          <div
            className={`scroll-area-thumb${scrolling || dragging ? " is-active" : ""}${dragging ? " is-dragging" : ""}`}
            style={{ top: thumb.top, height: thumb.height }}
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            onPointerCancel={handleThumbPointerUp}
          />
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
