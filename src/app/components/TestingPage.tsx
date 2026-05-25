"use client";
import { useState } from "react";
import { Product } from "../page";

interface TestRecord { id: number; testType: string; lab: string; dateSubmitted: string; dateCompleted: string; result: string; status: string; notes: string; }
const statusOpts = ["Not Started", "In Progress", "Awaiting Results", "Completed", "Failed"];

export default function TestingPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const [tests, setTests] = useState<TestRecord[]>([]);

  function addTest() {
    setTests(prev => [...prev, { id: Date.now(), testType: "", lab: "", dateSubmitted: "", dateCompleted: "", result: "", status: "Not Started", notes: "" }]);
  }

  function updateTest(id: number, field: keyof TestRecord, value: string) {
    setTests(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  }

  function deleteTest(id: number) { setTests(prev => prev.filter(t => t.id !== id)); }

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Testing — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-6">{product.brand}</p>
      <div className="modal-glass rounded-lg overflow-auto">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-white/10">
            <th className="text-left px-3 py-2 text-gray-400">Test Type</th>
            <th className="text-left px-3 py-2 text-gray-400">Lab</th>
            <th className="text-left px-3 py-2 text-gray-400">Submitted</th>
            <th className="text-left px-3 py-2 text-gray-400">Completed</th>
            <th className="text-left px-3 py-2 text-gray-400">Result</th>
            <th className="text-left px-3 py-2 text-gray-400">Status</th>
            <th className="text-left px-3 py-2 text-gray-400">Notes</th>
            <th className="w-6"></th>
          </tr></thead>
          <tbody>
            {tests.map(t => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-2 py-1"><input value={t.testType} onChange={(e) => updateTest(t.id, "testType", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="e.g. Stability, Micro" /></td>
                <td className="px-2 py-1"><input value={t.lab} onChange={(e) => updateTest(t.id, "lab", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-2 py-1"><input value={t.dateSubmitted} onChange={(e) => updateTest(t.id, "dateSubmitted", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="M/D/YYYY" /></td>
                <td className="px-2 py-1"><input value={t.dateCompleted} onChange={(e) => updateTest(t.id, "dateCompleted", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="M/D/YYYY" /></td>
                <td className="px-2 py-1"><input value={t.result} onChange={(e) => updateTest(t.id, "result", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-2 py-1"><select value={t.status} onChange={(e) => updateTest(t.id, "status", e.target.value)} className="dark-select w-full rounded px-1 py-1 text-xs">{statusOpts.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
                <td className="px-2 py-1"><input value={t.notes} onChange={(e) => updateTest(t.id, "notes", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-1 py-1"><button onClick={() => deleteTest(t.id)} className="text-red-500/50 hover:text-red-400">&times;</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3">
          <button onClick={addTest} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Test
          </button>
        </div>
      </div>
    </main>
  );
}
