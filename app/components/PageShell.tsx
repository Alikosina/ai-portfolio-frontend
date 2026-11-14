"use client";

import { useMemo, useState, type ReactNode } from "react";
import ChatWidget from "./ChatWidget";
import { ChatContext } from "./ChatContext";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

// Header + footer + chat widget shared by every page of the site.
export default function PageShell({ children }: { children: ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);
  const chat = useMemo(() => ({ openChat: () => setChatOpen(true) }), []);
  return (
    <ChatContext.Provider value={chat}>
      <SiteHeader />
      {children}
      <SiteFooter />
      <ChatWidget open={chatOpen} onOpen={chat.openChat} onClose={() => setChatOpen(false)} />
    </ChatContext.Provider>
  );
}
