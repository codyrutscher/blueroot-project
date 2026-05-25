"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Product } from "../page";

interface Field { label: string; value: string; }
interface Section { title: string; gate: "Gate 2" | "Gate 3"; fields: Field[]; }

interface Signature {
  id: number;
  name: string;
  title: string;
  signed: boolean;
  dateSigned: string;
  notified: boolean;
}

interface ChangeLog { id: number; date: string; user: string; change: string; }

const gate2Sections: Section[] = [
  { title: "General Information", gate: "Gate 2", fields: [
    { label: "Product Idea", value: "" }, { label: "Product Launch Type", value: "" }, { label: "Brand", value: "" },
    { label: "Targeted Launch Date", value: "" }, { label: "Submittal Date", value: "" },
  ]},
  { title: "Product", gate: "Gate 2", fields: [
    { label: "Supplement Facts", value: "" }, { label: "Required Trademark Statements", value: "" },
    { label: "Bottle Count", value: "" }, { label: "Serving Size", value: "" }, { label: "Suggested Use", value: "" },
    { label: "Delivery Format", value: "" }, { label: "Unit Size", value: "" }, { label: "Bottle", value: "" },
    { label: "Lid", value: "" }, { label: "Label", value: "" }, { label: "Other Packaging", value: "" },
    { label: "Shelf Life", value: "" }, { label: "Attributes (Free From)", value: "" },
    { label: "Vegan/Vegetarian", value: "" }, { label: "Non GMO", value: "" },
    { label: "Halal/Kosher", value: "" }, { label: "Other Label Requirements", value: "" },
  ]},
  { title: "Positioning", gate: "Gate 2", fields: [
    { label: "Problem We are Solving", value: "" }, { label: "Gap Being Filled in Market", value: "" },
    { label: "Big Idea", value: "" }, { label: "Key Differentiators", value: "" },
    { label: "Consumer Benefits", value: "" }, { label: "How the Product Works", value: "" },
    { label: "Structure/Function Claims", value: "" }, { label: "Substantiation & References", value: "" },
  ]},
  { title: "Competitive Landscape", gate: "Gate 2", fields: [
    { label: "MSRP", value: "" }, { label: "Count", value: "" }, { label: "Day Supply", value: "" },
    { label: "$/Serving", value: "" }, { label: "$/Day", value: "" }, { label: "Website", value: "" },
  ]},
  { title: "Pricing Strategy", gate: "Gate 2", fields: [
    { label: "MSRP", value: "" }, { label: "WSP", value: "" }, { label: "Amazon (Pattern for VN)", value: "" },
    { label: "Emerson/Fullscript", value: "" }, { label: "International", value: "" },
    { label: "Pricing Strategy & Justification", value: "" },
  ]},
  { title: "Financials (Gate 2)", gate: "Gate 2", fields: [
    { label: "Year 1 Est. Bottles Sold", value: "" }, { label: "Year 1 Net Sales", value: "" },
    { label: "Year 1 COGS", value: "" }, { label: "Year 1 Gross Margin", value: "" },
    { label: "Year 2 Est. Bottles Sold", value: "" }, { label: "Year 2 Net Sales", value: "" },
    { label: "Year 2 COGS", value: "" }, { label: "Year 2 Gross Margin", value: "" },
    { label: "Year 3 Est. Bottles Sold", value: "" }, { label: "Year 3 Net Sales", value: "" },
    { label: "Year 3 COGS", value: "" }, { label: "Year 3 Gross Margin", value: "" },
    { label: "Assumptions", value: "" },
  ]},
  { title: "Promotion", gate: "Gate 2", fields: [
    { label: "Promotional Effort (A, B, C launch)", value: "" },
    { label: "Sampling (if applicable)", value: "" }, { label: "Amazon Key Words", value: "" },
    { label: "Advertising & PR", value: "" }, { label: "Direct Selling Strategy", value: "" },
    { label: "Digital Marketing Strategy", value: "" }, { label: "Educational Programming", value: "" },
  ]},
];

const gate3Sections: Section[] = [
  { title: "General Information", gate: "Gate 3", fields: [
    { label: "Final Product Name", value: "" }, { label: "Product Launch Type", value: "" },
    { label: "Brand", value: "" }, { label: "Launch Date", value: "" }, { label: "Submittal Date", value: "" },
  ]},
  { title: "Market Preparation", gate: "Gate 3", fields: [
    { label: "In-Market Plan and Rollout", value: "" },
    { label: "Collateral Developed and Approved by Regulatory", value: "" },
    { label: "Approved Label Design", value: "" },
  ]},
  { title: "Product Information", gate: "Gate 3", fields: [
    { label: "SKU", value: "" }, { label: "Supplement Facts", value: "" },
    { label: "Required Trademark Statements", value: "" }, { label: "Bottle Count", value: "" },
    { label: "Serving Size", value: "" }, { label: "Suggested Use", value: "" },
    { label: "Delivery Format", value: "" }, { label: "Unit Size", value: "" },
    { label: "Bottle Size", value: "" }, { label: "Lid Size", value: "" },
    { label: "Label Size", value: "" }, { label: "UPC", value: "" },
    { label: "Shelf Life", value: "" }, { label: "Attributes", value: "" },
    { label: "Vegan/Vegetarian", value: "" }, { label: "Halal/Kosher", value: "" },
    { label: "Other Label Requirements", value: "" },
  ]},
  { title: "Production Planning", gate: "Gate 3", fields: [
    { label: "Manufacturer", value: "" }, { label: "Production Dates", value: "" },
    { label: "On Shelf Date", value: "" }, { label: "Manufacturing Order", value: "" },
    { label: "Cost Per Unit", value: "" }, { label: "Initial Purchase Order", value: "" },
    { label: "Lead Time", value: "" },
  ]},
  { title: "Finalized Financials (Gate 3)", gate: "Gate 3", fields: [
    { label: "Year 1 Est. Bottles Sold", value: "" }, { label: "Year 1 Net Sales", value: "" },
    { label: "Year 1 COGS", value: "" }, { label: "Year 1 Gross Margin", value: "" },
    { label: "Year 2 Est. Bottles Sold", value: "" }, { label: "Year 2 Net Sales", value: "" },
    { label: "Year 2 COGS", value: "" }, { label: "Year 2 Gross Margin", value: "" },
    { label: "Year 3 Est. Bottles Sold", value: "" }, { label: "Year 3 Net Sales", value: "" },
    { label: "Year 3 COGS", value: "" }, { label: "Year 3 Gross Margin", value: "" },
    { label: "Assumptions", value: "" },
  ]},
];

const defaultSignatures: Signature[] = [
  { id: 1, name: "Todd Walter", title: "Chief Financial & Operating Officer", signed: false, dateSigned: "", notified: false },
  { id: 2, name: "John Troup", title: "Chief Science, Education, Quality & Regulatory Officer", signed: false, dateSigned: "", notified: false },
  { id: 3, name: "Andrew O'Rourke", title: "Chief Strategy Officer", signed: false, dateSigned: "", notified: false },
  { id: 4, name: "Florian Bernodat", title: "Chief Manufacturing Officer", signed: false, dateSigned: "", notified: false },
  { id: 5, name: "Lester Meeks", title: "Chief Technology Officer", signed: false, dateSigned: "", notified: false },
];

export default function GateApprovalPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const { currentUser, addNotification } = useUser();
  const [sections, setSections] = useState<Section[]>([...gate2Sections.map(s => ({...s, fields: s.fields.map(f => ({...f}))})), ...gate3Sections.map(s => ({...s, fields: s.fields.map(f => ({...f}))}))]);
  const [signatures, setSignatures] = useState<Signature[]>(defaultSignatures.map(s => ({...s})));
  const [changeLog, setChangeLog] = useState<ChangeLog[]>([]);
  const [skipGate2, setSkipGate2] = useState(false);
  const [signedDocs, setSignedDocs] = useState<{name: string; date: string}[]>([]);

  function updateField(sectionIdx: number, fieldIdx: number, value: string) {
    setSections(prev => {
      const updated = [...prev];
      updated[sectionIdx] = {...updated[sectionIdx], fields: updated[sectionIdx].fields.map((f, i) => i === fieldIdx ? {...f, value} : f)};
      return updated;
    });
    const section = sections[sectionIdx];
    const field = section.fields[fieldIdx];
    addChangeLog(`${section.title} > ${field.label}`, "Updated");
  }

  function addChangeLog(field: string, change: string) {
    setChangeLog(prev => [...prev, { id: Date.now(), date: new Date().toLocaleString(), user: currentUser?.name || "Unknown", change: `${field}: ${change}` }]);
  }

  function notifySigner(sig: Signature) {
    addNotification(sig.name, `Your signature is needed on the Gate Approval Document for "${product.name}".`);
    setSignatures(prev => prev.map(s => s.id === sig.id ? {...s, notified: true} : s));
    addChangeLog("Signatures", `Notified ${sig.name}`);
  }

  function signDocument(sigId: number) {
    const today = new Date().toLocaleDateString();
    setSignatures(prev => prev.map(s => s.id === sigId ? {...s, signed: true, dateSigned: today} : s));
    const signer = signatures.find(s => s.id === sigId);
    addChangeLog("Signatures", `${signer?.name} signed on ${today}`);
  }

  function generatePdf() {
    const today = new Date().toLocaleDateString();
    setSignedDocs(prev => [...prev, { name: `${product.name} - Gate Approval - ${today}.pdf`, date: today }]);
    addChangeLog("Documents", "PDF generated and stored");
  }

  const visibleSections = skipGate2 ? sections.filter(s => s.gate === "Gate 3") : sections;
  const allSigned = signatures.every(s => s.signed);

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Gate Approval Document — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-4">{product.brand} · Gate {product.gate}</p>

      <div className="mb-6 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input type="checkbox" checked={skipGate2} onChange={(e) => setSkipGate2(e.target.checked)} className="rounded border-gray-600 bg-transparent text-indigo-500" />
          Skip Gate 2 sections for this product
        </label>
      </div>

      {/* Document Sections */}
      <div className="space-y-6 mb-8">
        {visibleSections.map((section, sIdx) => {
          const realIdx = sections.indexOf(section);
          return (
            <div key={`${section.title}-${section.gate}`} className="modal-glass rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{section.gate}</span>
              </div>
              <div className="space-y-2">
                {section.fields.map((field, fIdx) => (
                  <div key={field.label} className="flex items-start gap-3">
                    <label className="text-xs text-gray-400 w-[200px] flex-none pt-1.5">{field.label}</label>
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateField(realIdx, fIdx, e.target.value)}
                      className="dark-input flex-1 rounded px-3 py-1.5 text-xs"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Approvals / Signatures */}
      <div className="modal-glass rounded-lg p-5 mb-8">
        <h3 className="text-sm font-semibold text-white mb-4">Approvals</h3>
        <div className="space-y-3">
          {signatures.map((sig) => (
            <div key={sig.id} className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-medium">{sig.name.charAt(0)}</div>
                <div>
                  <p className="text-sm text-gray-200">{sig.name}</p>
                  <p className="text-[10px] text-gray-500">{sig.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {sig.signed ? (
                  <span className="text-xs text-green-400">✓ Signed {sig.dateSigned}</span>
                ) : (
                  <>
                    {!sig.notified && <button onClick={() => notifySigner(sig)} className="text-xs px-2 py-1 bg-amber-600/80 hover:bg-amber-500 text-white rounded">Request Signature</button>}
                    {sig.notified && <span className="text-[10px] text-amber-400">Awaiting signature</span>}
                    <button onClick={() => signDocument(sig.id)} className="text-xs px-2 py-1 bg-green-600/80 hover:bg-green-500 text-white rounded">Sign</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signed Documents */}
      <div className="modal-glass rounded-lg p-5 mb-8">
        <h3 className="text-sm font-semibold text-white mb-3">Signed Documents (PDF Storage)</h3>
        {signedDocs.length === 0 && !allSigned && <p className="text-xs text-gray-500">Once all signatures are collected, generate a PDF to store here.</p>}
        {signedDocs.map((doc, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-xs text-gray-300">📄 {doc.name}</span>
            <span className="text-[10px] text-gray-500">{doc.date}</span>
          </div>
        ))}
        {allSigned && <button onClick={generatePdf} className="mt-3 text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded">Generate & Store PDF</button>}
      </div>

      {/* Change Log */}
      <div className="modal-glass rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Change Log</h3>
        {changeLog.length === 0 ? (
          <p className="text-xs text-gray-500">No changes recorded yet.</p>
        ) : (
          <div className="max-h-48 overflow-auto space-y-1">
            {[...changeLog].reverse().map((log) => (
              <div key={log.id} className="text-xs text-gray-400 flex gap-3 py-0.5">
                <span className="text-gray-600 flex-none w-[140px]">{log.date}</span>
                <span className="text-gray-300 flex-none w-[80px]">{log.user}</span>
                <span>{log.change}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
