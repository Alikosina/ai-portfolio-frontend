"use client";

import { createContext, useContext } from "react";

type ChatContextValue = { openChat: () => void };

export const ChatContext = createContext<ChatContextValue>({ openChat: () => {} });

export function useChatControls(): ChatContextValue {
  return useContext(ChatContext);
}
