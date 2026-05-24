"use client";

import { useState } from "react";
import { Product } from "../page";

interface FinancialRow {
  label: string;
  isInput: boolean;
  values: string[];
}

const defaultRows: FinancialRow[] = [
  { label: "Units Sold", isInput: true, values: ["", "", "", "", ""] },
  { label: "Price per Unit ($)", isInput: true, values: ["", "", "", "", ""] },
  { label: "Revenue ($)", isInput: false, values: ["0", "0", "0", "0", "0"] },
  { label: "COGS per Unit ($)", isInput: true, values: ["", "", "", "", ""] },
  { label: "Total COGS ($)", isInput: false, values: ["0", "0", "0", "0", "0"] },
  { label: "Gross Margin ($)", isInput: false, values: ["0", "0", "0", "0", "0"] },
  { label: "Gross Margin (%)", isInput: false, values: ["0", "0", "0", "0", "0"] },
  { label: "Marketing Spend ($)", isInput: true, values: ["", "", "", "", ""] },
  { label: "R&D Costs ($)", isInput: true, values: ["", "", "", "", ""] },
  { label: "Other Costs ($)", isInput: true, values: ["", "", "", "", ""] },
  { label: "Net Profit ($)", isInput: false, values: ["0", "0", "0", "0", "0"] },
];

const periods = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

export default function FinancialsPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const [rows, setRows] = useState<FinancialRow[]>(defaultRows.map((r) => ({ ...r, values: [...r.values] })));
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  function updateCell(rowIdx: number, colIdx: number, value: string) {
    setRows((prev) => {
      const updated = prev.map((r, i) => i === rowIdx ? { ...r, values: r.values.map((v, j) => j === colIdx ? value : v) } : r);
      return recalculate(updated);
    });
  }

  function overrideCell(rowIdx: number, colIdx: number, value: string) {
    const key = `${rowIdx}-${colIdx}`;
    setOverrides((prev) => ({ ...prev, [key]: value }));
  }

  function recalculate(data: FinancialRow[]): FinancialRow[] {
    const units = data[0].values.map((v) => parseFloat(v) || 0);
    const price = data[1].values.map((v) => parseFloat(v) || 0);
    const cogs = data[3].values.map((v) => parseFloat(v) || 0);
    const marketing = data[7].values.map((v) => parseFloat(v) || 0);
    const rnd = data[8].values.map((v) => parseFloat(v) || 0);
    const other = data[9].values.map((v) => parseFloat(v) || 0);

    const revenue = units.map((u, i) => u * price[i]);
    const totalCogs = units.map((u, i) => u * cogs[i]);
    const grossMargin = revenue.map((r, i) => r - totalCogs[i]);
    const grossMarginPct = revenue.map((r, i) => r > 0 ? ((grossMargin[i] / r) * 100) : 0);
    const netProfit = grossMargin.map((gm, i) => gm - marketing[i] - rnd[i] - other[i]);

    data[2] = { ...data[2], values: revenue.map((v) => v.toFixed(0)) };
    data[4] = { ...data[4], values: totalCogs.map((v) => v.toFixed(0)) };
    data[5] = { ...data[5], values: grossMargin.map((v) => v.toFixed(0)) };
    data[6] = { ...data[6], values: grossMarginPct.map((v) => v.toFixed(1) + "%") };
    data[10] = { ...data[10], values: netProfit.map((v) => v.toFixed(0)) };
    return data;
  }

  function getCellValue(rowIdx: number, colIdx: number): string {
    const key = `${rowIdx}-${colIdx}`;
    if (overrides[key] !== undefined) return overrides[key];
    return rows[rowIdx].values[colIdx];
  }

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Financials — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-6">{product.brand} · {product.therapeuticPlatform}</p>

      <div className="modal-glass rounded-lg overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-gray-400 font-medium w-[200px]">Metric</th>
              {periods.map((p) => <th key={p} className="text-center px-3 py-3 text-gray-400 font-medium">{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={row.label} className={`border-b border-white/5 ${row.isInput ? "bg-yellow-500/5" : ""}`}>
                <td className="px-4 py-2 text-gray-300 font-medium text-xs">
                  {row.label}
                  {row.isInput && <span className="ml-1 text-yellow-400 text-[9px]">●</span>}
                </td>
                {periods.map((_, colIdx) => (
                  <td key={colIdx} className="px-2 py-1 text-center">
                    {row.isInput ? (
                      <input
                        type="text"
                        value={rows[rowIdx].values[colIdx]}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        className="dark-input w-full rounded px-2 py-1 text-xs text-center"
                        placeholder="0"
                      />
                    ) : (
                      <input
                        type="text"
                        value={getCellValue(rowIdx, colIdx)}
                        onChange={(e) => overrideCell(rowIdx, colIdx, e.target.value)}
                        className="dark-input w-full rounded px-2 py-1 text-xs text-center opacity-80"
                        title="Calculated value — click to override"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-gray-500 mt-2">● Yellow rows are primary inputs. All cells can be overridden.</p>
    </main>
  );
}
