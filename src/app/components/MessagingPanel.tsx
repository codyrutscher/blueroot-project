"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, allUsers } from "../context/UserContext";

export default function MessagingPanel({ onClose }: { onClose: () => void }) {
  const { currentUser, sendMessage, getConversation, getConversationList } = useUser();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewConvo, setShowNewConvo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = getConversationList();
  const activeConvo = selectedUser ? getConversation(selectedUser) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo.length]);

  function handleSend() {
    if (!selectedUser || !newMessage.trim()) return;
    sendMessage(selectedUser, newMessage);
    setNewMessage("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!currentUser) return null;

  const otherUsers = allUsers.filter((u) => u.name !== currentUser.name);

  return (
    <div className="fixed bottom-4 right-4 z-[90] w-[400px] h-[500px] modal-glass rounded-xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none px-4 py-3 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedUser && (
            <button onClick={() => setSelectedUser(null)} className="hover:bg-indigo-500 rounded p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <span className="font-medium text-sm">{selectedUser ? selectedUser : "Messages"}</span>
        </div>
        <button onClick={onClose} className="hover:bg-indigo-500 rounded p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Body */}
      {!selectedUser ? (
        <div className="flex-1 overflow-auto">
          {/* New conversation button */}
          <button
            onClick={() => setShowNewConvo(!showNewConvo)}
            className="w-full px-4 py-3 text-left text-sm text-indigo-400 font-medium hover:bg-white/5 border-b border-white/10 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Conversation
          </button>

          {/* New convo user picker */}
          {showNewConvo && (
            <div className="border-b border-white/10 max-h-40 overflow-auto">
              {otherUsers.map((user) => (
                <button
                  key={user.name}
                  onClick={() => { setSelectedUser(user.name); setShowNewConvo(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-200">{user.name}</p>
                    <p className="text-[10px] text-gray-500">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Conversation list */}
          {conversations.length === 0 && !showNewConvo ? (
            <p className="px-4 py-8 text-sm text-gray-500 text-center">No conversations yet. Start one above.</p>
          ) : (
            conversations.map(({ user, lastMessage }) => (
              <button
                key={user.name}
                onClick={() => setSelectedUser(user.name)}
                className="w-full px-4 py-3 text-left hover:bg-white/5 border-b border-white/5 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-medium flex-none">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-200">{user.name}</p>
                    <p className="text-[10px] text-gray-500">{lastMessage.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {lastMessage.from === currentUser.name ? "You: " : ""}{lastMessage.text}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-auto px-4 py-3 space-y-2">
            {activeConvo.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-8">No messages yet. Say hello!</p>
            )}
            {activeConvo.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === currentUser.name ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-lg px-3 py-2 ${msg.from === currentUser.name ? "bg-indigo-600 text-white" : "bg-white/10 text-gray-200"}`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-0.5 ${msg.from === currentUser.name ? "text-indigo-200" : "text-gray-500"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-none px-4 py-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="dark-input flex-1 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
