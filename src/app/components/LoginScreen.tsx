"use client";

import { useState } from "react";
import { useUser, allUsers } from "../context/UserContext";

const TEAM_USERNAME = "blueroot";
const TEAM_PASSWORD = "brh2026";

export default function LoginScreen() {
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === TEAM_USERNAME && password === TEAM_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  }

  // Step 2: Pick your user profile after authenticating
  if (authenticated) {
    return (
      <div className="app-bg flex items-center justify-center p-4">
        <div className="modal-glass rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Blueroot Health</h1>
            <p className="text-sm text-gray-400 mt-2">Select your profile</p>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-auto pr-1">
            {allUsers.map((user) => (
              <button
                key={user.name}
                onClick={() => login(user)}
                className="flex items-center gap-2 p-3 rounded-lg border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-medium flex-none group-hover:bg-indigo-500/30">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{user.name}</p>
                  <p className="text-[10px] text-gray-500">{user.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Team login
  return (
    <div className="app-bg flex items-center justify-center p-4">
      <div className="modal-glass rounded-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Blueroot Health</h1>
          <p className="text-sm text-gray-400 mt-2">BRH New Products Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="dark-input w-full rounded-lg px-4 py-2.5 text-sm"
              placeholder="Enter team username"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dark-input w-full rounded-lg px-4 py-2.5 text-sm"
              placeholder="Enter team password"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
