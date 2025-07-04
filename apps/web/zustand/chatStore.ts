'use client';

import { create } from 'zustand';
import { RefObject, createRef } from 'react';
import { MessagesMap, User } from '../types/chatTypes';


type SetMessagesArg = MessagesMap | ((prev: MessagesMap) => MessagesMap);

interface ChatStore {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  messages: MessagesMap;
  setMessages: (messages: SetMessagesArg) => void;
  chatEndRef: RefObject<HTMLDivElement | null>;
}

export const useChatStore = create<ChatStore>((set) => ({
  selectedUser: null,
  setSelectedUser: (user: User | null) => set({ selectedUser: user }),

  messages: {},
  setMessages: (messagesOrUpdater: SetMessagesArg) =>
    set((state) => ({
      messages:
        typeof messagesOrUpdater === 'function'
          ? (messagesOrUpdater as (prev: MessagesMap) => MessagesMap)(state.messages)
          : messagesOrUpdater,
    })),

  chatEndRef: createRef(),
}));
