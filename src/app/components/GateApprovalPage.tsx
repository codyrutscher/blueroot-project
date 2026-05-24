"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Product } from "../page";

interface GateSection {
  id: number;
  title: string;
  content: string;
  gate: "Gate 2" | "Gate 3";
  skipped: boolean;
}

interface Signature {
  id: number;
  name: string;
  role: string;
  signed: boolean;
  dateSigned: string;
  notified: boolean;
}

interface ChangeLog {
  id: number;
  date: string;
  user: string;
  field: string;
  change: string;
}

const defaultSections: GateSection[] = [
  { id: 1, title: "Product Overview", content: "", gate: "Gate 2", skipped: false },
  { id: 2, title: "Market Assessment", content: "", gate: "Gate 2", skipped: false },
  { id: 3, title: "Formulation Summary", content: "", gate: "Gate 2", skipped: false },
  { id: 4, title: "Costing & P&L Summary", content: "", gate: "Gate 2", skipped: false },
  { id: 5, title: "Prototyping Results", content: "", gate: "Gate 2", skipped: false },
  { id: 6, title: "Quality & Regulatory", content: "", gate: "Gate 2", skipped: false },
  { id: 7, title: "Pilot Manufacturing Plan", content: "", gate: "Gate 3", skipped: false },
  { id: 8, title: "Pilot Results & Testing", content: "", gate: "Gate 3", skipped: false },
  { id: 9, title: "Full Scale Production Plan", content: "", gate: "Gate 3", skipped: false },
  { id: 10, title: "Marketing & Launch Plan", content: "", gate: "Gate 3", skipped: false },
  { id: 11, title: "Final Costing & Financials", content: "", gate: "Gate 3", skipped: false },
  { id: 12, title: "Risk Assessment", content: "", gate: "Gate 3", skipped: false },
];

const defaultSignatures: Signature[] = [
  { id: 1, name: "John", role: "Product Development Lead", signed: false, dateSigned: "", notified: false },
  { id: 2, name: "Dana", role: "Product Development", signed: false, dateSigned: "", notified: false },
  { id: 3, name: "Shefali", role: "Regulatory", signed: false, dateSigned: "", notified: false },
  { id: 4, name: "Cheryl", role: "Finance", signed: false, dateSigned: "", notified: false },
  { id: 5, name: "Quality", role: "Quality Assurance", signed: false, dateSigned: "", notified: false },
];

export default function GateApprovalPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const { currentUser, addNotification } = useUser();
  const [sections, setSections] = useState<GateSection[]>(defaultSections.map((s) => ({ ...s })));
  const [signatures, setSignatures] = useState<Signature[]>(defaultSignatures.map((s) => ({ ...s })));
  const [changeLog, setChangeLog] = useState<ChangeLog[]>([]);
  const [skipGate2, setSkipGate2] = useState(false);
  const [signedDocs] = useState<{ name: string; date: string }[]>([]);

  function updateSection(id: number, content: string) {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, content } : s));
    addChangeLog(`Section "${sections.find((s) => s.id === id)?.title}"`, "Content updated");
  }

  function addChangeLog(field: string, change: string) {
    setChangeLog((prev) => [...prev, { id: Date.now(), date: new Date().toLocaleString(), user: currentUser?.name || "Unknown", field, change }]);
  }

  function notifySigner(sig: Signature) {
    addNotification(sig.name, `Your signature is needed on the Gate Approval Document for "${product.name}".`);
    setSignatures((prev) => prev.map((s) => s.id === sig.id ? { ...s, notified: true } : s));
  }

  function signDocument(sigId: number) {
    const today = new Date().toLocaleDateString();
    setSignatures((prev) => prev.map((s) => s.id === sigId ? { ...s, signed: true, dateSigned: today } : s));
    addChangeLog("Signature", `${signatures.find((s) => s.id === sigId)?.name} signed`);
  }

  const visibleSections = skipGate2 ? sections.filter((s) => s.gate === "Gate 3") : sections;

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Gate Approval Document — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-4">{product.brand} · Gate {product.gate}</p>

      {/* Skip Gate 2 toggle */}
      <div className="mb-6 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input type="checkbox" checked={skipGate2} onChange={(e) => setSkipGate2(e.target.checked)} className="rounded border-gray-600 bg-transparent text-indigo-500" />
          Skip Gate 2 sections for this product
        </label>
      </div>

      {/* Document sections */}
      <div className="space-y-4 mb-8">
        {visibleSections.map((section) => (
          <div key={section.id} className="modal-glass rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">{section.title}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{section.gate}</span>
            </div>
            <textarea
              value={section.content}
              onChange={(e) => updateSection(section.id, e.target.value)}
              className="dark-input w-full rounded px-3 py-2 text-sm min-h-[80px] resize-y"
              placeholder={`Enter ${section.title.toLowerCase()} details...`}
            />
          </div>
        ))}
      </div>

      {/* Signatures */}
      <div className="modal-glass rounded-lg p-4 mb-8">
        <h3 className="text-sm font-medium text-white mb-3">Signatures</h3>
        <div className="space-y-2">
          {signatures.map((sig) => (
            <div key={sig.id} className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-medium">{sig.name.charAt(0)}</div>
                <div>
                  <p className="text-sm text-gray-200">{sig.name}</p>
                  <p className="text-[10px] text-gray-500">{sig.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sig.signed ? (
                  <span className="text-xs text-green-400">✓ Signed {sig.dateSigned}</span>
                ) : (
                  <>
                    {!sig.notified && (
                      <button onClick={() => notifySigner(sig)} className="text-xs px-2 py-1 bg-amber-600/80 hover:bg-amber-500 text-white rounded">Notify</button>
                    )}
                    {sig.notified && <span className="text-[10px] text-amber-400">Notified</span>}
                    {currentUser?.name === sig.name && (
                      <button onClick={() => signDocument(sig.id)} className="text-xs px-2 py-1 bg-green-600/80 hover:bg-green-500 text-white rounded">Sign</button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signed Documents Storage */}
      <div className="modal-glass rounded-lg p-4 mb-8">
        <h3 className="text-sm font-medium text-white mb-3">Signed Documents (PDF Storage)</h3>
        {signedDocs.length === 0 ? (
          <p className="text-xs text-gray-500">No signed documents yet. Once all signatures are collected, a PDF will be generated and stored here.</p>
        ) : (
          signedDocs.map((doc, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-xs text-gray-300">{doc.name}</span>
              <span className="text-[10px] text-gray-500">{doc.date}</span>
            </div>
          ))
        )}
        {signatures.every((s) => s.signed) && (
          <button className="mt-3 text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded">Generate PDF</button>
        )}
      </div>

      {/* Change Log */}
      <div className="modal-glass rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">Change Log</h3>
        {changeLog.length === 0 ? (
          <p className="text-xs text-gray-500">No changes recorded yet.</p>
        ) : (
          <div className="max-h-40 overflow-auto space-y-1">
            {[...changeLog].reverse().map((log) => (
              <div key={log.id} className="text-xs text-gray-400 flex gap-3">
                <span className="text-gray-600 flex-none w-[140px]">{log.date}</span>
                <span className="text-gray-300 flex-none w-[60px]">{log.user}</span>
                <span>{log.field}: {log.change}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
