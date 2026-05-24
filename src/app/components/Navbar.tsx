"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import MessagingPanel from "./MessagingPanel";

export default function Navbar() {
  const { currentUser, logout, notifications, unreadCount, markRead, markAllRead, getUnreadMessageCount } = useUser();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  if (!currentUser) return null;

  const msgCount = getUnreadMessageCount();

  return (
    <>
      <nav className="nav-glass px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Blueroot Health</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Messages Button */}
          <button
            onClick={() => { setShowMessages(!showMessages); setShowNotifs(false); }}
            className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
            title="Messages"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {msgCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {msgCount > 9 ? "9+" : msgCount}
              </span>
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifs(!showNotifs); setShowMessages(false); }}
              className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 modal-glass rounded-lg shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-indigo-400 hover:text-indigo-300">Mark all read</button>
                  )}
                </div>
                <div className="max-h-80 overflow-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications yet</p>
                  ) : (
                    [...notifications].reverse().map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markRead(notif.id)}
                        className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/5 ${!notif.read ? "bg-indigo-500/10" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-none"></span>}
                          <div>
                            <p className="text-xs text-gray-300">{notif.message}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{notif.timestamp.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-medium">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-200">{currentUser.name}</p>
              <p className="text-[10px] text-gray-500">{currentUser.role}</p>
            </div>
          </div>

          {/* Logout */}
          <button onClick={logout} className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded hover:bg-white/10 ml-2">
            Logout
          </button>
        </div>
      </nav>

      {/* Messaging Panel */}
      {showMessages && <MessagingPanel onClose={() => setShowMessages(false)} />}
    </>
  );
}
