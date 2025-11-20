'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PLACEHOLDER) {
      setAuthenticated(true);
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <form onSubmit={handleLogin} className="space-y-4 rounded-xl bg-slate-900/70 p-6">
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-64 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none"
            placeholder="Enter admin password"
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
          >
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">OfferVerse Admin</h1>
        {/* Admin table, filters, and CRUD actions will go here */}
      </div>
    </main>
  );
}
