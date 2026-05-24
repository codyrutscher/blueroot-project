"use client";

import { useState } from "react";
import { Product } from "../page";

interface RawMaterial {
  id: number;
  ingredient: string;
  supplier: string;
  partNumber: string;
  costPerKg: string;
  qtyPerBatch: string;
  leadTimeDays: string;
  status: string;
  notes: string;
}

const statusOptions = ["Approved", "Pending Approval", "Sourcing", "Not Started"];

export default function RawMaterialsPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const [materials, setMaterials] = useState<RawMaterial[]>([
    { id: 1, ingredient: "", supplier: "", partNumber: "", costPerKg: "", qtyPerBatch: "", leadTimeDays: "", status: "Not Started", notes: "" },
  ]);

  function updateMaterial(id: number, field: keyof RawMaterial, value: string) {
    setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));
  }

  function addRow() {
    const nextId = materials.length > 0 ? Math.max(...materials.map((m) => m.id)) + 1 : 1;
    setMaterials((prev) => [...prev, { id: nextId, ingredient: "", supplier: "", partNumber: "", costPerKg: "", qtyPerBatch: "", leadTimeDays: "", status: "Not Started", notes: "" }]);
  }

  function deleteRow(id: number) {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Raw Materials — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-6">{product.brand} · {product.manufacturer}</p>

      <div className="modal-glass rounded-lg overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-3 py-2 text-gray-400 font-medium">#</th>
              <th className="text-left px-3 py-2 text-gray-400 font-medium">Ingredient</th>
              <th className="text-left px-3 py-2 text-gray-400 font-medium">Supplier</th>
              <th className="text-left px-3 py-2 text-gray-400 font-medium">Part #</th>
              <th className="text-left px-3 py-2 text-gray-400 font-medium">Cost/kg ($)</th>
              <th className="text-left px-3 py-2 text-gray-400 font-medium">Qty/Batch</th>
              <th className="text-left px-3 py-2 text-gray-400 font-medium">Lead Time (days)</th>
              <th className="text-left px-3 py-2 text-gray-400 font-medium">Status</th>
              <th className="text-left px-3 py-2 text-gray-400 font-medium">Notes</th>
              <th className="w-6"></th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr key={mat.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-3 py-1 text-gray-500">{mat.id}</td>
                <td className="px-2 py-1"><input type="text" value={mat.ingredient} onChange={(e) => updateMaterial(mat.id, "ingredient", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="Ingredient name" /></td>
                <td className="px-2 py-1"><input type="text" value={mat.supplier} onChange={(e) => updateMaterial(mat.id, "supplier", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="Supplier" /></td>
                <td className="px-2 py-1"><input type="text" value={mat.partNumber} onChange={(e) => updateMaterial(mat.id, "partNumber", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="Part #" /></td>
                <td className="px-2 py-1"><input type="text" value={mat.costPerKg} onChange={(e) => updateMaterial(mat.id, "costPerKg", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="0.00" /></td>
                <td className="px-2 py-1"><input type="text" value={mat.qtyPerBatch} onChange={(e) => updateMaterial(mat.id, "qtyPerBatch", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="0" /></td>
                <td className="px-2 py-1"><input type="text" value={mat.leadTimeDays} onChange={(e) => updateMaterial(mat.id, "leadTimeDays", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="0" /></td>
                <td className="px-2 py-1">
                  <select value={mat.status} onChange={(e) => updateMaterial(mat.id, "status", e.target.value)} className="dark-select w-full rounded px-1 py-1 text-xs">
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-2 py-1"><input type="text" value={mat.notes} onChange={(e) => updateMaterial(mat.id, "notes", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" placeholder="Notes" /></td>
                <td className="px-1 py-1"><button onClick={() => deleteRow(mat.id)} className="text-red-500/50 hover:text-red-400">&times;</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3">
          <button onClick={addRow} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Material
          </button>
        </div>
      </div>
    </main>
  );
}
