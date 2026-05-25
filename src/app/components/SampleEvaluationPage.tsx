"use client";
import { useState } from "react";
import { Product } from "../page";

interface Sample { id: number; date: string; evaluator: string; appearance: string; taste: string; texture: string; overall: string; notes: string; pass: string; }

export default function SampleEvaluationPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const [samples, setSamples] = useState<Sample[]>([]);

  function addSample() {
    setSamples(prev => [...prev, { id: Date.now(), date: new Date().toLocaleDateString(), evaluator: "", appearance: "", taste: "", texture: "", overall: "", notes: "", pass: "Pending" }]);
  }

  function updateSample(id: number, field: keyof Sample, value: string) {
    setSamples(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Sample Evaluation — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-6">{product.brand}</p>
      <div className="modal-glass rounded-lg overflow-auto">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-white/10">
            <th className="text-left px-3 py-2 text-gray-400">Date</th>
            <th className="text-left px-3 py-2 text-gray-400">Evaluator</th>
            <th className="text-left px-3 py-2 text-gray-400">Appearance</th>
            <th className="text-left px-3 py-2 text-gray-400">Taste</th>
            <th className="text-left px-3 py-2 text-gray-400">Texture</th>
            <th className="text-left px-3 py-2 text-gray-400">Overall</th>
            <th className="text-left px-3 py-2 text-gray-400">Notes</th>
            <th className="text-left px-3 py-2 text-gray-400">Pass/Fail</th>
          </tr></thead>
          <tbody>
            {samples.map(s => (
              <tr key={s.id} className="border-b border-white/5">
                <td className="px-2 py-1"><input value={s.date} onChange={(e) => updateSample(s.id, "date", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-2 py-1"><input value={s.evaluator} onChange={(e) => updateSample(s.id, "evaluator", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-2 py-1"><input value={s.appearance} onChange={(e) => updateSample(s.id, "appearance", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-2 py-1"><input value={s.taste} onChange={(e) => updateSample(s.id, "taste", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-2 py-1"><input value={s.texture} onChange={(e) => updateSample(s.id, "texture", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-2 py-1"><input value={s.overall} onChange={(e) => updateSample(s.id, "overall", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-2 py-1"><input value={s.notes} onChange={(e) => updateSample(s.id, "notes", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                <td className="px-2 py-1"><select value={s.pass} onChange={(e) => updateSample(s.id, "pass", e.target.value)} className="dark-select w-full rounded px-1 py-1 text-xs"><option>Pending</option><option>Pass</option><option>Fail</option></select></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3">
          <button onClick={addSample} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Evaluation
          </button>
        </div>
      </div>
    </main>
  );
}
