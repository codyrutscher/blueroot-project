"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface UserNotification {
  id: number;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Message {
  id: number;
  from: string;
  to: string;
  text: string;
  timestamp: Date;
}

export interface User {
  name: string;
  role: string;
}

export const allUsers: User[] = [
  { name: "John", role: "Product Development" },
  { name: "Matt", role: "Product Development" },
  { name: "Shefali", role: "Regulatory" },
  { name: "Dana", role: "Product Development" },
  { name: "Britt", role: "Purchasing" },
  { name: "Cheryl", role: "Finance" },
  { name: "Mckenzie", role: "Operations" },
  { name: "Florian/Erin P.", role: "Manufacturing" },
  { name: "Marketing", role: "Marketing" },
  { name: "Brand Manager", role: "Marketing" },
  { name: "Digital Marketing", role: "Marketing" },
  { name: "Label Team", role: "Label" },
  { name: "Quality", role: "Quality" },
];

interface UserContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  notifications: UserNotification[];
  addNotification: (forUser: string, message: string) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  unreadCount: number;
  // Messaging
  messages: Message[];
  sendMessage: (to: string, text: string) => void;
  getConversation: (otherUser: string) => Message[];
  getUnreadMessageCount: () => number;
  getConversationList: () => { user: User; lastMessage: Message; unreadCount: number }[];
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allNotifications, setAllNotifications] = useState<Record<string, UserNotification[]>>({});
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  function login(user: User) { setCurrentUser(user); }
  function logout() { setCurrentUser(null); }

  function addNotification(forUser: string, message: string) {
    setAllNotifications((prev) => ({
      ...prev,
      [forUser]: [...(prev[forUser] || []), { id: Date.now() + Math.random(), message, timestamp: new Date(), read: false }],
    }));
  }

  function markRead(id: number) {
    if (!currentUser) return;
    setAllNotifications((prev) => ({
      ...prev,
      [currentUser.name]: (prev[currentUser.name] || []).map((n) => n.id === id ? { ...n, read: true } : n),
    }));
  }

  function markAllRead() {
    if (!currentUser) return;
    setAllNotifications((prev) => ({
      ...prev,
      [currentUser.name]: (prev[currentUser.name] || []).map((n) => ({ ...n, read: true })),
    }));
  }

  function sendMessage(to: string, text: string) {
    if (!currentUser || !text.trim()) return;
    setAllMessages((prev) => [...prev, {
      id: Date.now() + Math.random(),
      from: currentUser.name,
      to,
      text: text.trim(),
      timestamp: new Date(),
    }]);
  }

  function getConversation(otherUser: string): Message[] {
    if (!currentUser) return [];
    return allMessages.filter(
      (m) => (m.from === currentUser.name && m.to === otherUser) || (m.from === otherUser && m.to === currentUser.name)
    );
  }

  function getUnreadMessageCount(): number {
    if (!currentUser) return 0;
    // Count messages sent TO current user (simple: all received messages are "unread" for badge purposes)
    // In a real app you'd track read state per message per user
    return allMessages.filter((m) => m.to === currentUser.name).length > 0 ? allMessages.filter((m) => m.to === currentUser.name).length : 0;
  }

  function getConversationList(): { user: User; lastMessage: Message; unreadCount: number }[] {
    if (!currentUser) return [];
    const userMessages = allMessages.filter((m) => m.from === currentUser.name || m.to === currentUser.name);
    const otherUsers = new Set<string>();
    userMessages.forEach((m) => {
      if (m.from === currentUser.name) otherUsers.add(m.to);
      else otherUsers.add(m.from);
    });

    return Array.from(otherUsers).map((name) => {
      const user = allUsers.find((u) => u.name === name) || { name, role: "" };
      const convo = userMessages.filter((m) => m.from === name || m.to === name);
      const lastMessage = convo[convo.length - 1];
      const unread = convo.filter((m) => m.to === currentUser.name).length;
      return { user, lastMessage, unreadCount: unread };
    }).sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime());
  }

  const notifications = currentUser ? (allNotifications[currentUser.name] || []) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const messages = currentUser ? allMessages.filter((m) => m.from === currentUser.name || m.to === currentUser.name) : [];

  return (
    <UserContext.Provider value={{
      currentUser, login, logout,
      notifications, addNotification, markRead, markAllRead, unreadCount,
      messages, sendMessage, getConversation, getUnreadMessageCount, getConversationList,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
