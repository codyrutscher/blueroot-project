"use client";
import { useState } from "react";
import { Product } from "../page";

export default function PFSPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const [fields, setFields] = useState([
    { label: "Product Name", value: product.name },
    { label: "Brand", value: product.brand },
    { label: "SKU", value: "" },
    { label: "Batch Size", value: "" },
    { label: "Serving Size", value: "" },
    { label: "Servings per Container", value: "" },
    { label: "Dosage Form", value: "" },
    { label: "Fill Weight (mg)", value: "" },
    { label: "Capsule Size", value: "" },
    { label: "Bottle Size", value: "" },
    { label: "Label Size", value: "" },
    { label: "Lid Type", value: "" },
    { label: "Desiccant", value: "" },
    { label: "Cotton/Rayon", value: "" },
    { label: "Shrink Band", value: "" },
    { label: "Shelf Life (months)", value: "" },
    { label: "Storage Conditions", value: "" },
    { label: "Special Instructions", value: "" },
  ]);

  function updateField(idx: number, value: string) {
    setFields(prev => prev.map((f, i) => i === idx ? { ...f, value } : f));
  }

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">PFS (Product Fact Sheet) — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-6">{product.brand}</p>
      <div className="modal-glass rounded-lg p-5 space-y-3">
        {fields.map((f, idx) => (
          <div key={f.label} className="flex items-start gap-3">
            <label className="text-xs text-gray-400 w-[180px] flex-none pt-1.5">{f.label}</label>
            <input type="text" value={f.value} onChange={(e) => updateField(idx, e.target.value)} className="dark-input flex-1 rounded px-3 py-1.5 text-xs" placeholder={`Enter ${f.label.toLowerCase()}...`} />
          </div>
        ))}
      </div>
    </main>
  );
}
