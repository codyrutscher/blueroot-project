"use client";

import { useState } from "react";
import { Product } from "../page";

interface ChannelRow {
  channel: string;
  pctVolume: string;
  salePricePct: string;
  salePriceY1: string;
  unitsY1: string;
  revenueY1: string;
  salePriceY2: string;
  unitsY2: string;
  revenueY2: string;
  salePriceY3: string;
  unitsY3: string;
  revenueY3: string;
}

interface FinancialsState {
  msrpY1: string;
  msrpY2: string;
  msrpY3: string;
  cogsY1: string;
  cogsY2: string;
  cogsY3: string;
  unitsY1: string;
  unitsY2: string;
  unitsY3: string;
  growthY2: string;
  growthY3: string;
  channels: ChannelRow[];
}

const defaultChannels: ChannelRow[] = [
  { channel: "Fullscripts", pctVolume: "9", salePricePct: "38", salePriceY1: "", unitsY1: "", revenueY1: "", salePriceY2: "", unitsY2: "", revenueY2: "", salePriceY3: "", unitsY3: "", revenueY3: "" },
  { channel: "Amazon", pctVolume: "60", salePricePct: "100", salePriceY1: "", unitsY1: "", revenueY1: "", salePriceY2: "", unitsY2: "", revenueY2: "", salePriceY3: "", unitsY3: "", revenueY3: "" },
  { channel: "DTC", pctVolume: "25", salePricePct: "100", salePriceY1: "", unitsY1: "", revenueY1: "", salePriceY2: "", unitsY2: "", revenueY2: "", salePriceY3: "", unitsY3: "", revenueY3: "" },
  { channel: "iHerb", pctVolume: "1", salePricePct: "55", salePriceY1: "", unitsY1: "", revenueY1: "", salePriceY2: "", unitsY2: "", revenueY2: "", salePriceY3: "", unitsY3: "", revenueY3: "" },
  { channel: "Domestic Wholesaler", pctVolume: "5", salePricePct: "55", salePriceY1: "", unitsY1: "", revenueY1: "", salePriceY2: "", unitsY2: "", revenueY2: "", salePriceY3: "", unitsY3: "", revenueY3: "" },
  { channel: "Any Other", pctVolume: "", salePricePct: "55", salePriceY1: "", unitsY1: "", revenueY1: "", salePriceY2: "", unitsY2: "", revenueY2: "", salePriceY3: "", unitsY3: "", revenueY3: "" },
];

function num(v: string): number { return parseFloat(v.replace(/,/g, "")) || 0; }
function fmt(v: number): string { return v.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function fmtD(v: number): string { return "$" + fmt(v); }

export default function FinancialsPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const [data, setData] = useState<FinancialsState>({
    msrpY1: "", msrpY2: "", msrpY3: "",
    cogsY1: "", cogsY2: "", cogsY3: "",
    unitsY1: "", unitsY2: "", unitsY3: "",
    growthY2: "30", growthY3: "10",
    channels: defaultChannels.map((c) => ({ ...c })),
  });

  function update(field: keyof FinancialsState, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function updateChannel(idx: number, field: keyof ChannelRow, value: string) {
    setData((prev) => {
      const channels = prev.channels.map((c, i) => i === idx ? { ...c, [field]: value } : c);
      return { ...prev, channels };
    });
  }

  // Calculations
  const msrp = [num(data.msrpY1), num(data.msrpY2) || num(data.msrpY1), num(data.msrpY3) || num(data.msrpY1)];
  const cogs = [num(data.cogsY1), num(data.cogsY2) || num(data.cogsY1), num(data.cogsY3) || num(data.cogsY1)];
  const baseUnits = num(data.unitsY1);
  const units = [
    baseUnits,
    num(data.unitsY2) || Math.round(baseUnits * (1 + num(data.growthY2) / 100)),
    num(data.unitsY3) || Math.round(baseUnits * (1 + num(data.growthY2) / 100) * (1 + num(data.growthY3) / 100)),
  ];

  // Calculate channels
  const channelsCalc = data.channels.map((ch) => {
    const pct = num(ch.pctVolume) / 100;
    const spPct = num(ch.salePricePct) / 100;
    const sp = msrp.map((m) => m * spPct);
    const u = units.map((total) => Math.round(total * pct));
    const rev = sp.map((s, i) => s * u[i]);
    return { sp, u, rev };
  });

  const totalUnits = [0, 1, 2].map((i) => channelsCalc.reduce((sum, ch) => sum + ch.u[i], 0));
  const totalRevenue = [0, 1, 2].map((i) => channelsCalc.reduce((sum, ch) => sum + ch.rev[i], 0));
  const totalCogs = totalUnits.map((u, i) => u * cogs[i]);
  const grossMargin = totalRevenue.map((r, i) => r - totalCogs[i]);
  const grossMarginPct = totalRevenue.map((r, i) => r > 0 ? (grossMargin[i] / r) * 100 : 0);
  const avgSellingPrice = totalRevenue.map((r, i) => totalUnits[i] > 0 ? r / totalUnits[i] : 0);

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Financials — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-6">{product.brand} · {product.therapeuticPlatform}</p>

      {/* Input Section */}
      <div className="modal-glass rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-200 mb-4">Inputs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-gray-400 block mb-1">MSRP Year 1 ($)</label>
            <input value={data.msrpY1} onChange={(e) => update("msrpY1", e.target.value)} className="dark-input w-full rounded px-3 py-2 text-sm bg-yellow-500/10 border-yellow-500/30" placeholder="22.99" />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">MSRP Year 2 ($)</label>
            <input value={data.msrpY2} onChange={(e) => update("msrpY2", e.target.value)} className="dark-input w-full rounded px-3 py-2 text-sm bg-yellow-500/10 border-yellow-500/30" placeholder="22.99" />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">MSRP Year 3 ($)</label>
            <input value={data.msrpY3} onChange={(e) => update("msrpY3", e.target.value)} className="dark-input w-full rounded px-3 py-2 text-sm bg-yellow-500/10 border-yellow-500/30" placeholder="22.99" />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">Est. COGS Year 1 ($)</label>
            <input value={data.cogsY1} onChange={(e) => update("cogsY1", e.target.value)} className="dark-input w-full rounded px-3 py-2 text-sm bg-yellow-500/10 border-yellow-500/30" placeholder="4.00" />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">Est. COGS Year 2 ($)</label>
            <input value={data.cogsY2} onChange={(e) => update("cogsY2", e.target.value)} className="dark-input w-full rounded px-3 py-2 text-sm bg-yellow-500/10 border-yellow-500/30" placeholder="4.00" />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">Est. COGS Year 3 ($)</label>
            <input value={data.cogsY3} onChange={(e) => update("cogsY3", e.target.value)} className="dark-input w-full rounded px-3 py-2 text-sm bg-yellow-500/10 border-yellow-500/30" placeholder="4.00" />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">Year 1 Units Sold</label>
            <input value={data.unitsY1} onChange={(e) => update("unitsY1", e.target.value)} className="dark-input w-full rounded px-3 py-2 text-sm bg-yellow-500/10 border-yellow-500/30" placeholder="9500" />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">% Growth Year 2</label>
            <input value={data.growthY2} onChange={(e) => update("growthY2", e.target.value)} className="dark-input w-full rounded px-3 py-2 text-sm bg-yellow-500/10 border-yellow-500/30" placeholder="30" />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">% Growth Year 3</label>
            <input value={data.growthY3} onChange={(e) => update("growthY3", e.target.value)} className="dark-input w-full rounded px-3 py-2 text-sm bg-yellow-500/10 border-yellow-500/30" placeholder="10" />
          </div>
        </div>
      </div>

      {/* 3-Year Summary */}
      <div className="modal-glass rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-200 mb-4">3-Year Summary</h2>
        <table className="w-full text-xs">
          <thead><tr className="border-b border-white/10">
            <th className="text-left px-3 py-2 text-gray-400"></th>
            <th className="text-right px-3 py-2 text-gray-400">Year 1</th>
            <th className="text-right px-3 py-2 text-gray-400">Year 2</th>
            <th className="text-right px-3 py-2 text-gray-400">Year 3</th>
          </tr></thead>
          <tbody>
            <tr className="border-b border-white/5"><td className="px-3 py-2 text-gray-300">Units Sold</td><td className="px-3 py-2 text-right text-gray-200">{fmt(totalUnits[0])}</td><td className="px-3 py-2 text-right text-gray-200">{fmt(totalUnits[1])}</td><td className="px-3 py-2 text-right text-gray-200">{fmt(totalUnits[2])}</td></tr>
            <tr className="border-b border-white/5"><td className="px-3 py-2 text-gray-300">Avg Selling Price</td><td className="px-3 py-2 text-right text-gray-200">${avgSellingPrice[0].toFixed(2)}</td><td className="px-3 py-2 text-right text-gray-200">${avgSellingPrice[1].toFixed(2)}</td><td className="px-3 py-2 text-right text-gray-200">${avgSellingPrice[2].toFixed(2)}</td></tr>
            <tr className="border-b border-white/5"><td className="px-3 py-2 text-gray-300">Total Revenue</td><td className="px-3 py-2 text-right text-green-400 font-medium">{fmtD(totalRevenue[0])}</td><td className="px-3 py-2 text-right text-green-400 font-medium">{fmtD(totalRevenue[1])}</td><td className="px-3 py-2 text-right text-green-400 font-medium">{fmtD(totalRevenue[2])}</td></tr>
            <tr className="border-b border-white/5"><td className="px-3 py-2 text-gray-300">Total COGS</td><td className="px-3 py-2 text-right text-gray-200">{fmtD(totalCogs[0])}</td><td className="px-3 py-2 text-right text-gray-200">{fmtD(totalCogs[1])}</td><td className="px-3 py-2 text-right text-gray-200">{fmtD(totalCogs[2])}</td></tr>
            <tr className="border-b border-white/5"><td className="px-3 py-2 text-gray-300">Gross Margin ($)</td><td className="px-3 py-2 text-right text-indigo-400 font-medium">{fmtD(grossMargin[0])}</td><td className="px-3 py-2 text-right text-indigo-400 font-medium">{fmtD(grossMargin[1])}</td><td className="px-3 py-2 text-right text-indigo-400 font-medium">{fmtD(grossMargin[2])}</td></tr>
            <tr><td className="px-3 py-2 text-gray-300">Gross Margin (%)</td><td className="px-3 py-2 text-right text-gray-200">{grossMarginPct[0].toFixed(1)}%</td><td className="px-3 py-2 text-right text-gray-200">{grossMarginPct[1].toFixed(1)}%</td><td className="px-3 py-2 text-right text-gray-200">{grossMarginPct[2].toFixed(1)}%</td></tr>
          </tbody>
        </table>
      </div>

      {/* Channel Breakdown */}
      <div className="modal-glass rounded-lg p-5 overflow-auto">
        <h2 className="text-sm font-semibold text-gray-200 mb-4">Channel Breakdown</h2>
        <table className="w-full text-xs min-w-[900px]">
          <thead><tr className="border-b border-white/10">
            <th className="text-left px-2 py-2 text-gray-400">Channel</th>
            <th className="text-center px-2 py-2 text-gray-400">% Vol</th>
            <th className="text-center px-2 py-2 text-gray-400">% MSRP</th>
            <th className="text-right px-2 py-2 text-gray-400">Price Y1</th>
            <th className="text-right px-2 py-2 text-gray-400">Units Y1</th>
            <th className="text-right px-2 py-2 text-gray-400">Rev Y1</th>
            <th className="text-right px-2 py-2 text-gray-400">Price Y2</th>
            <th className="text-right px-2 py-2 text-gray-400">Units Y2</th>
            <th className="text-right px-2 py-2 text-gray-400">Rev Y2</th>
            <th className="text-right px-2 py-2 text-gray-400">Price Y3</th>
            <th className="text-right px-2 py-2 text-gray-400">Units Y3</th>
            <th className="text-right px-2 py-2 text-gray-400">Rev Y3</th>
          </tr></thead>
          <tbody>
            {data.channels.map((ch, idx) => {
              const calc = channelsCalc[idx];
              return (
                <tr key={ch.channel} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-2 py-1"><input value={ch.channel} onChange={(e) => updateChannel(idx, "channel", e.target.value)} className="dark-input w-full rounded px-2 py-1 text-xs" /></td>
                  <td className="px-2 py-1"><input value={ch.pctVolume} onChange={(e) => updateChannel(idx, "pctVolume", e.target.value)} className="dark-input w-16 rounded px-2 py-1 text-xs text-center bg-yellow-500/10 border-yellow-500/30" /></td>
                  <td className="px-2 py-1"><input value={ch.salePricePct} onChange={(e) => updateChannel(idx, "salePricePct", e.target.value)} className="dark-input w-16 rounded px-2 py-1 text-xs text-center bg-yellow-500/10 border-yellow-500/30" /></td>
                  <td className="px-2 py-1 text-right text-gray-300">${calc.sp[0].toFixed(2)}</td>
                  <td className="px-2 py-1 text-right text-gray-300">{fmt(calc.u[0])}</td>
                  <td className="px-2 py-1 text-right text-gray-200">{fmtD(calc.rev[0])}</td>
                  <td className="px-2 py-1 text-right text-gray-300">${calc.sp[1].toFixed(2)}</td>
                  <td className="px-2 py-1 text-right text-gray-300">{fmt(calc.u[1])}</td>
                  <td className="px-2 py-1 text-right text-gray-200">{fmtD(calc.rev[1])}</td>
                  <td className="px-2 py-1 text-right text-gray-300">${calc.sp[2].toFixed(2)}</td>
                  <td className="px-2 py-1 text-right text-gray-300">{fmt(calc.u[2])}</td>
                  <td className="px-2 py-1 text-right text-gray-200">{fmtD(calc.rev[2])}</td>
                </tr>
              );
            })}
            <tr className="border-t border-white/10 font-medium">
              <td className="px-2 py-2 text-gray-200">TOTAL</td>
              <td className="px-2 py-2 text-center text-gray-400">100%</td>
              <td></td>
              <td></td>
              <td className="px-2 py-2 text-right text-gray-200">{fmt(totalUnits[0])}</td>
              <td className="px-2 py-2 text-right text-green-400">{fmtD(totalRevenue[0])}</td>
              <td></td>
              <td className="px-2 py-2 text-right text-gray-200">{fmt(totalUnits[1])}</td>
              <td className="px-2 py-2 text-right text-green-400">{fmtD(totalRevenue[1])}</td>
              <td></td>
              <td className="px-2 py-2 text-right text-gray-200">{fmt(totalUnits[2])}</td>
              <td className="px-2 py-2 text-right text-green-400">{fmtD(totalRevenue[2])}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-gray-500 mt-3">Yellow-highlighted fields are primary inputs. All calculated cells can be overridden by editing channel data directly.</p>
    </main>
  );
}
