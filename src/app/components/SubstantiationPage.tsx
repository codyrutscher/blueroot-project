"use client";
import { useState } from "react";
import { Product } from "../page";

interface SubstantiationEntry { id: number; claim: string; reference: string; studyType: string; summary: string; status: string; }
const statusOpts = ["Draft", "Under Review", "Approved", "Needs Revision"];

export default function SubstantiationPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const [entries, setEntries] = useState<SubstantiationEntry[]>([]);

  function addEntry() {
    setEntries(prev => [...prev, { id: Date.now(), claim: "", reference: "", studyType: "", summary: "", status: "Draft" }]);
  }

  function updateEntry(id: number, field: keyof SubstantiationEntry, value: string) {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  }

  function deleteEntry(id: number) { setEntries(prev => prev.filter(e => e.id !== id)); }

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Substantiation — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-6">{product.brand} · Structure/Function Claims & References</p>
      <div className="modal-glass rounded-lg overflow-auto">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-white/10">
            <th className="text-left px-3 py-2 text-gray-400">Claim</th>
            <th className="text-left px-3 py-2 text-gray-400">Reference / Citation</th>
            <th className="text-left px-3 py-2 text-gray-400">Study Type</th>
            <th className="text-left px-3 py-2 text-gray-400">Summary</th>
            <th className="text-left px-3 py-2 text-gray-400">Status</th>
            <th className="w-6"></th>
          </tr></thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-2 py-1"><input value={e.claim} onChange={(ev) => updateEntry(e.id, "claim", ev.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="Structure/function claim" /></td>
                <td className="px-2 py-1"><input value={e.reference} onChange={(ev) => updateEntry(e.id, "reference", ev.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="Author, Year, Journal" /></td>
                <td className="px-2 py-1"><input value={e.studyType} onChange={(ev) => updateEntry(e.id, "studyType", ev.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="RCT, Meta-analysis..." /></td>
                <td className="px-2 py-1"><input value={e.summary} onChange={(ev) => updateEntry(e.id, "summary", ev.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="Key findings" /></td>
                <td className="px-2 py-1"><select value={e.status} onChange={(ev) => updateEntry(e.id, "status", ev.target.value)} className="dark-select w-full rounded px-1 py-1 text-xs">{statusOpts.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
                <td className="px-1 py-1"><button onClick={() => deleteEntry(e.id)} className="text-red-500/50 hover:text-red-400">&times;</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3">
          <button onClick={addEntry} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Claim
          </button>
        </div>
      </div>
    </main>
  );
}
