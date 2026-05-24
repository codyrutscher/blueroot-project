"use client";

import { products } from "../page";

export default function DashboardPage({ onBack }: { onBack: () => void }) {
  // Simulated financial summary per product (in a real app this would come from stored data)
  const financialSummary = products.map((p) => ({
    name: p.name,
    brand: p.brand,
    gate: p.gate,
    launchTimeframe: p.gate === "1" ? "2027" : p.gate === "2" ? "Late 2026" : "Mid 2026",
    revenue: 0,
    grossMargin: 0,
    grossMarginPct: 0,
  }));

  const totalRevenue = financialSummary.reduce((sum, p) => sum + p.revenue, 0);
  const totalGrossMargin = financialSummary.reduce((sum, p) => sum + p.grossMargin, 0);

  return (
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-6">Financial Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="modal-glass rounded-lg p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Products</p>
          <p className="text-3xl font-bold text-white mt-1">{products.length}</p>
        </div>
        <div className="modal-glass rounded-lg p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Projected Revenue</p>
          <p className="text-3xl font-bold text-green-400 mt-1">${totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500 mt-1">Enter financials per product to populate</p>
        </div>
        <div className="modal-glass rounded-lg p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Gross Margin</p>
          <p className="text-3xl font-bold text-indigo-400 mt-1">${totalGrossMargin.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500 mt-1">Enter financials per product to populate</p>
        </div>
      </div>

      {/* By Launch Timeframe */}
      <h2 className="text-sm font-semibold text-gray-300 mb-3">Products by Launch Timeframe</h2>
      <div className="modal-glass rounded-lg overflow-auto mb-8">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-2 text-gray-400">Product</th>
              <th className="text-left px-4 py-2 text-gray-400">Brand</th>
              <th className="text-center px-4 py-2 text-gray-400">Gate</th>
              <th className="text-center px-4 py-2 text-gray-400">Launch Timeframe</th>
              <th className="text-right px-4 py-2 text-gray-400">Revenue</th>
              <th className="text-right px-4 py-2 text-gray-400">Gross Margin</th>
            </tr>
          </thead>
          <tbody>
            {financialSummary.map((p) => (
              <tr key={p.name} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-2 text-gray-200">{p.name}</td>
                <td className="px-4 py-2 text-gray-400">{p.brand}</td>
                <td className="px-4 py-2 text-center text-gray-400">{p.gate}</td>
                <td className="px-4 py-2 text-center text-gray-300">{p.launchTimeframe}</td>
                <td className="px-4 py-2 text-right text-gray-300">{p.revenue > 0 ? `$${p.revenue.toLocaleString()}` : "—"}</td>
                <td className="px-4 py-2 text-right text-gray-300">{p.grossMargin > 0 ? `$${p.grossMargin.toLocaleString()}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">Revenue and margin data will populate as you enter financials for each product.</p>
    </main>
  );
}
