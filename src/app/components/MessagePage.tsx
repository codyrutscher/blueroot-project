"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Product } from "../page";

interface ProductMessage {
  id: number;
  from: string;
  text: string;
  timestamp: Date;
}

export default function MessagePage({ product, onBack }: { product: Product; onBack: () => void }) {
  const { currentUser } = useUser();
  const [messages, setMessages] = useState<ProductMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  function sendMessage() {
    if (!newMessage.trim() || !currentUser) return;
    setMessages((prev) => [...prev, {
      id: Date.now(),
      from: currentUser.name,
      text: newMessage.trim(),
      timestamp: new Date(),
    }]);
    setNewMessage("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  // Filter and sort
  let displayMessages = [...messages];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayMessages = displayMessages.filter(m => m.text.toLowerCase().includes(q) || m.from.toLowerCase().includes(q));
  }
  displayMessages.sort((a, b) => sortBy === "newest" ? b.timestamp.getTime() - a.timestamp.getTime() : a.timestamp.getTime() - b.timestamp.getTime());

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Messages — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-4">{product.brand} · Gate {product.gate}</p>

      {/* Search and Sort */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="dark-input flex-1 rounded-lg px-3 py-2 text-sm"
          placeholder="Search messages..."
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")} className="dark-select rounded-lg px-3 py-2 text-sm">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Messages */}
      <div className="modal-glass rounded-lg p-4 mb-4 min-h-[300px] max-h-[500px] overflow-auto">
        {displayMessages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">No messages yet. Start the conversation below.</p>
        ) : (
          <div className="space-y-3">
            {displayMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === currentUser?.name ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.from === currentUser?.name ? "bg-indigo-600 text-white" : "bg-white/10 text-gray-200"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{msg.from}</span>
                    <span className={`text-[10px] ${msg.from === currentUser?.name ? "text-indigo-200" : "text-gray-500"}`}>
                      {msg.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="dark-input flex-1 rounded-lg px-4 py-2.5 text-sm"
          placeholder="Type a message about this product..."
        />
        <button onClick={sendMessage} disabled={!newMessage.trim()} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg px-4 py-2.5 text-sm font-medium">
          Send
        </button>
      </div>
    </main>
  );
}
