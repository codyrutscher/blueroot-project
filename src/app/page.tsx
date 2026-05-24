"use client";

import { useState } from "react";
import { useUser } from "./context/UserContext";
import Navbar from "./components/Navbar";
import LoginScreen from "./components/LoginScreen";
import GanttPage from "./components/GanttPage";
import FinancialsPage from "./components/FinancialsPage";
import RawMaterialsPage from "./components/RawMaterialsPage";
import GateApprovalPage from "./components/GateApprovalPage";
import DashboardPage from "./components/DashboardPage";

export interface Product {
  name: string;
  brand: string;
  gate: string;
  manufacturer: string;
  productType: string;
  therapeuticPlatform: string;
  gateStatus: string;
  manufacturingStatus: string;
}

export const products: Product[] = [
  { name: "Men's Hair Product", brand: "Vital Nutrients", gate: "3", manufacturer: "Blueroot Health", productType: "New Product", therapeuticPlatform: "Foundational Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Pilot" },
  { name: "Vegan Vit D +K2", brand: "Vital Nutrients", gate: "3", manufacturer: "Blueroot Health", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Foundational Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Muscle Activator", brand: "Bariatric Fusion/Unjury", gate: "2", manufacturer: "Blueroot Health", productType: "New Product", therapeuticPlatform: "Metabolic Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Chocolate Peanut Butter Mighty Mini Bites", brand: "Bariatric Fusion/Unjury", gate: "3", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Metabolic Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Cookie Dough Mighty Mini Bites", brand: "Bariatric Fusion/Unjury", gate: "3", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Metabolic Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Lemon Cake Mighty Mini Bites", brand: "Bariatric Fusion/Unjury", gate: "3", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Metabolic Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Protect+Restore", brand: "Bariatric Fusion/Unjury", gate: "2", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Metabolic Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "BF MV + High B1", brand: "Bariatric Fusion/Unjury", gate: "2", manufacturer: "Blueroot Health", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Foundational Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "30 Stick Pak Myo-D-Chiro", brand: "Fairhaven Health", gate: "2", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Women's Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Shatavari", brand: "Fairhaven Health", gate: "1", manufacturer: "Blueroot Health", productType: "New Product", therapeuticPlatform: "Women's Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Creatine PQQ", brand: "Fairhaven Health", gate: "1", manufacturer: "Blueroot Health", productType: "New Product", therapeuticPlatform: "Metabolic Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "NMN System (now known as NMN/Longevity Portfolio)", brand: "Vital Nutrients", gate: "1", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Longevity", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Broad-Spectrum Enzyme", brand: "Vital Nutrients", gate: "1", manufacturer: "Co-man", productType: "New Product", therapeuticPlatform: "Digestive Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Creatine Portfolio", brand: "Vital Nutrients", gate: "1", manufacturer: "Blueroot Health", productType: "", therapeuticPlatform: "", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Estrobolome CoBiotic", brand: "Fairhaven Health", gate: "1", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Women's Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "GutBalance Binding Protein", brand: "Vital Nutrients", gate: "1", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Women's Health", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Fatty15 + Creatine", brand: "Vital Nutrients", gate: "2", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Longevity", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
  { name: "Cobiotic for Healthy Aging", brand: "Vital Nutrients", gate: "1", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Longevity", gateStatus: "Gate Documents in Preparation", manufacturingStatus: "Not Started" },
];

type FilterKey = "brand" | "gate" | "manufacturer" | "therapeuticPlatform" | "productType";
interface Filters { brand: string[]; gate: string[]; manufacturer: string[]; therapeuticPlatform: string[]; productType: string[]; }

const filterConfig: { key: FilterKey; label: string; options: string[] }[] = [
  { key: "brand", label: "Brand", options: ["Vital Nutrients", "Bariatric Fusion/Unjury", "Fairhaven Health"] },
  { key: "gate", label: "Gate", options: ["1", "2", "3"] },
  { key: "manufacturer", label: "Manufacturer", options: ["Blueroot Health", "Co-man"] },
  { key: "therapeuticPlatform", label: "Therapeutic Platform", options: ["Digestive Health", "Foundational Health", "Metabolic Health", "Women's Health", "Longevity"] },
  { key: "productType", label: "Product Type", options: ["Innovation", "New Product", "Renovation/Extension/Refresh"] },
];

type PageView = "grid" | "gantt" | "financials" | "rawMaterials" | "gateApproval" | "dashboard";

export default function Home() {
  const { currentUser } = useUser();
  const [filters, setFilters] = useState<Filters>({ brand: [], gate: [], manufacturer: [], therapeuticPlatform: [], productType: [] });
  const [openDropdown, setOpenDropdown] = useState<FilterKey | null>(null);
  const [currentPage, setCurrentPage] = useState<PageView>("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function toggleOption(key: FilterKey, option: string) {
    setFilters((prev) => {
      const current = prev[key];
      const updated = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
      return { ...prev, [key]: updated };
    });
  }

  function toggleDropdown(key: FilterKey) { setOpenDropdown((prev) => (prev === key ? null : key)); }

  function navigateTo(page: PageView, product: Product) {
    setSelectedProduct(product);
    setCurrentPage(page);
  }

  if (!currentUser) return <LoginScreen />;

  // Sub-pages
  if (currentPage === "gantt" && selectedProduct) return <><Navbar /><GanttPage product={selectedProduct} onBack={() => setCurrentPage("grid")} /></>;
  if (currentPage === "financials" && selectedProduct) return <><Navbar /><FinancialsPage product={selectedProduct} onBack={() => setCurrentPage("grid")} /></>;
  if (currentPage === "rawMaterials" && selectedProduct) return <><Navbar /><RawMaterialsPage product={selectedProduct} onBack={() => setCurrentPage("grid")} /></>;
  if (currentPage === "gateApproval" && selectedProduct) return <><Navbar /><GateApprovalPage product={selectedProduct} onBack={() => setCurrentPage("grid")} /></>;
  if (currentPage === "dashboard") return <><Navbar /><DashboardPage onBack={() => setCurrentPage("grid")} /></>;

  const filtered = products.filter((p) => {
    if (filters.brand.length > 0 && !filters.brand.includes(p.brand)) return false;
    if (filters.gate.length > 0 && !filters.gate.includes(p.gate)) return false;
    if (filters.manufacturer.length > 0 && !filters.manufacturer.includes(p.manufacturer)) return false;
    if (filters.therapeuticPlatform.length > 0 && !filters.therapeuticPlatform.includes(p.therapeuticPlatform)) return false;
    if (filters.productType.length > 0 && !filters.productType.includes(p.productType)) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.brand]) acc[p.brand] = [];
    acc[p.brand].push(p);
    return acc;
  }, {});

  return (
    <>
      <Navbar />
      <main className="flex-1 app-bg p-8" onClick={() => setOpenDropdown(null)}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">BRH New Products</h1>
          <button onClick={() => setCurrentPage("dashboard")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8" onClick={(e) => e.stopPropagation()}>
          {filterConfig.map((filter) => (
            <div key={filter.key} className="relative">
              <button onClick={() => toggleDropdown(filter.key)} className="w-full flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all">
                <span>{filter.label}{filters[filter.key].length > 0 && <span className="ml-1 text-indigo-400">({filters[filter.key].length})</span>}</span>
                <svg className={`ml-2 h-4 w-4 transition-transform ${openDropdown === filter.key ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openDropdown === filter.key && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-white/10 modal-glass shadow-lg">
                  <ul className="max-h-60 overflow-auto py-1">
                    {filter.options.map((option) => (
                      <li key={option}><label className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">
                        <input type="checkbox" checked={filters[filter.key].includes(option)} onChange={() => toggleOption(filter.key, option)} className="rounded border-gray-600 bg-transparent text-indigo-500" />{option}
                      </label></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Product cards */}
        {Object.keys(grouped).length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 p-12 text-center text-gray-500">No products match the selected filters.</div>
        ) : (
          Object.entries(grouped).map(([brand, items]) => (
            <section key={brand} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-200 mb-3">{brand}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((product) => (
                  <div key={product.name} className="glass-card rounded-lg p-4">
                    <p className="text-base font-semibold text-white mb-2">{product.name}</p>

                    {/* Tags - clearly non-interactive */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.gate && <span className="product-tag bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">Gate {product.gate}</span>}
                      {product.productType && <span className="product-tag bg-green-500/15 border border-green-500/25 text-green-300">{product.productType}</span>}
                      {product.therapeuticPlatform && <span className="product-tag bg-purple-500/15 border border-purple-500/25 text-purple-300">{product.therapeuticPlatform}</span>}
                      <span className="product-tag bg-yellow-500/15 border border-yellow-500/25 text-yellow-300">{product.gateStatus}</span>
                      <span className="product-tag bg-cyan-500/15 border border-cyan-500/25 text-cyan-300">Mfg: {product.manufacturingStatus}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => navigateTo("gantt", product)} className="px-2 py-1.5 text-xs font-medium bg-indigo-600/80 hover:bg-indigo-500 text-white rounded transition-colors">
                        Gantt Chart
                      </button>
                      <button onClick={() => navigateTo("financials", product)} className="px-2 py-1.5 text-xs font-medium bg-emerald-600/80 hover:bg-emerald-500 text-white rounded transition-colors">
                        Financials
                      </button>
                      <button onClick={() => navigateTo("rawMaterials", product)} className="px-2 py-1.5 text-xs font-medium bg-amber-600/80 hover:bg-amber-500 text-white rounded transition-colors">
                        Raw Materials
                      </button>
                      <button onClick={() => navigateTo("gateApproval", product)} className="px-2 py-1.5 text-xs font-medium bg-rose-600/80 hover:bg-rose-500 text-white rounded transition-colors">
                        Gate Approval
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </>
  );
}
