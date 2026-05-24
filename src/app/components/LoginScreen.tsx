"use client";

import { useUser, allUsers } from "../context/UserContext";

export default function LoginScreen() {
  const { login } = useUser();

  return (
    <div className="app-bg flex items-center justify-center p-4">
      <div className="modal-glass rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Blueroot Health</h1>
          <p className="text-sm text-gray-400 mt-2">BRH New Products Portal</p>
        </div>

        <p className="text-sm text-gray-300 mb-4">Select your account to log in:</p>

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
