"use client";

import { useState, useEffect } from "react";
import { mensHairGantt, GanttProject, GanttTask } from "./ganttData";
import { useUser } from "./context/UserContext";
import Navbar from "./components/Navbar";
import LoginScreen from "./components/LoginScreen";

interface Product {
  name: string;
  brand: string;
  gate: string;
  manufacturer: string;
  productType: string;
  therapeuticPlatform: string;
}

const products: Product[] = [
  { name: "Men's Hair Product", brand: "Vital Nutrients", gate: "3", manufacturer: "Blueroot Health", productType: "New Product", therapeuticPlatform: "Foundational Health" },
  { name: "Vegan Vit D +K2", brand: "Vital Nutrients", gate: "3", manufacturer: "Blueroot Health", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Foundational Health" },
  { name: "Muscle Activator", brand: "Bariatric Fusion", gate: "2", manufacturer: "Blueroot Health", productType: "New Product", therapeuticPlatform: "Metabolic" },
  { name: "Chocolate Peanut Butter Mighty Mini Bites", brand: "Bariatric Fusion", gate: "3", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Metabolic" },
  { name: "Cookie Dough Mighty Mini Bites", brand: "Bariatric Fusion", gate: "3", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Metabolic" },
  { name: "Lemon Cake Mighty Mini Bites", brand: "Bariatric Fusion", gate: "3", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Metabolic" },
  { name: "Protect+Restore", brand: "Bariatric Fusion", gate: "2", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Metabolic" },
  { name: "BF MV + High B1", brand: "Bariatric Fusion", gate: "2", manufacturer: "ANS or BRH", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Foundational Health" },
  { name: "30 Stick Pak Myo-D-Chiro", brand: "Fairhaven Health", gate: "2", manufacturer: "Co-man", productType: "Renovation/Extension/Refresh", therapeuticPlatform: "Women's Health" },
  { name: "Shatavari", brand: "Fairhaven Health", gate: "1", manufacturer: "Blueroot Health", productType: "New Product", therapeuticPlatform: "Women's Health" },
  { name: "Creatine PQQ", brand: "Fairhaven Health", gate: "1", manufacturer: "Blueroot Health", productType: "New Product", therapeuticPlatform: "Metabolic" },
  { name: "NMN System (now known as NMN/Longevity Portfolio)", brand: "Vital Nutrients", gate: "1", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Longevity" },
  { name: "Broad-Spectrum Enzyme", brand: "Vital Nutrients", gate: "1", manufacturer: "Co-man", productType: "New Product", therapeuticPlatform: "Digestive Health" },
  { name: "Creatine Portfolio", brand: "Vital Nutrients", gate: "1", manufacturer: "Blueroot Health", productType: "", therapeuticPlatform: "" },
  { name: "Estrobolome CoBiotic", brand: "Fairhaven Health", gate: "1", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Women's Health" },
  { name: "GutBalance Binding Protein", brand: "Vital Nutrients", gate: "1", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Women's Health" },
  { name: "Fatty15 + Creatine", brand: "Vital Nutrients", gate: "2", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Longevity" },
  { name: "Cobiotic for Healthy Aging", brand: "Vital Nutrients", gate: "1", manufacturer: "Blueroot Health", productType: "Innovation", therapeuticPlatform: "Longevity" },
];

const ganttMap: Record<string, GanttProject> = {};
products.forEach((p) => { ganttMap[p.name] = mensHairGantt; });

type FilterKey = "brand" | "gate" | "manufacturer" | "status" | "therapeuticPlatform" | "productType";
interface Filters { brand: string[]; gate: string[]; manufacturer: string[]; status: string[]; therapeuticPlatform: string[]; productType: string[]; }

const filterConfig: { key: FilterKey; label: string; options: string[] }[] = [
  { key: "brand", label: "Brand", options: ["Vital Nutrients", "Bariatric Fusion", "Fairhaven Health", "Unjury"] },
  { key: "gate", label: "Gate", options: ["1", "2", "3"] },
  { key: "manufacturer", label: "Manufacturer", options: ["Blueroot Health", "Co-man", "ANS or BRH"] },
  { key: "status", label: "Status", options: [] },
  { key: "therapeuticPlatform", label: "Therapeutic Platform", options: ["Digestive Health", "Foundational Health", "Metabolic", "Women's Health", "Longevity"] },
  { key: "productType", label: "Product Type", options: ["Innovation", "New Product", "Renovation/Extension/Refresh"] },
];

const statusOptions = ["Completed", "In Progress", "Not Initiated", "Not Needed"];
const gateOptions = ["Gate 0", "Gate 1", "Gate 2", "Gate 3"];

function getStatusColor(status: string) {
  switch (status) {
    case "Completed": return "bg-green-500";
    case "In Progress": return "bg-blue-500";
    case "Not Initiated": return "bg-gray-400";
    case "Not Needed": return "bg-gray-200";
    default: return "bg-gray-300";
  }
}

function getStatusTextColor(status: string) {
  switch (status) {
    case "Completed": return "text-green-700 bg-green-50";
    case "In Progress": return "text-blue-700 bg-blue-50";
    case "Not Initiated": return "text-gray-700 bg-gray-100";
    case "Not Needed": return "text-gray-500 bg-gray-50";
    default: return "text-gray-700 bg-gray-100";
  }
}

function parseDate(dateStr: string): Date {
  const parts = dateStr.split("/");
  return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
}

function formatDate(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}

function calcEndDate(startDate: string, workDays: number): string | null {
  try {
    const start = parseDate(startDate);
    if (isNaN(start.getTime())) return null;
    if (workDays <= 0) return startDate;
    return formatDate(addBusinessDays(start, workDays));
  } catch { return null; }
}

export default function Home() {
  const { currentUser, addNotification } = useUser();
  const [filters, setFilters] = useState<Filters>({ brand: [], gate: [], manufacturer: [], status: [], therapeuticPlatform: [], productType: [] });
  const [openDropdown, setOpenDropdown] = useState<FilterKey | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tasks, setTasks] = useState<GanttTask[]>([]);

  useEffect(() => {
    if (selectedProduct) {
      const project = ganttMap[selectedProduct.name];
      if (project) setTasks(project.tasks.map((t) => ({ ...t })));
    }
  }, [selectedProduct]);

  function updateTask(taskNum: number, field: keyof GanttTask, value: string | number | string[] | null) {
    setTasks((prev) => {
      const newTasks = prev.map((t) => {
        if (t.taskNum !== taskNum) return t;
        const updated = { ...t, [field]: value };
        if (field === "startDate" || field === "workDays") {
          const newEnd = calcEndDate(
            field === "startDate" ? (value as string) : updated.startDate,
            field === "workDays" ? (value as number) : updated.workDays
          );
          if (newEnd) updated.endDate = newEnd;
        }
        return updated;
      });

      // When a task is marked Completed, notify people on dependent tasks
      if (field === "status" && value === "Completed") {
        const completedTask = newTasks.find((t) => t.taskNum === taskNum);
        const dependentTasks = newTasks.filter((t) => t.taskDependency === taskNum);
        if (completedTask && dependentTasks.length > 0) {
          dependentTasks.forEach((dt) => {
            dt.people.forEach((person) => {
              addNotification(
                person,
                `"${completedTask.task}" (Task #${taskNum}) is now complete. Your task "${dt.task}" (Task #${dt.taskNum}) is ready to begin.`
              );
            });
          });
        }
      }

      return newTasks;
    });
  }

  function addRow() {
    const nextNum = tasks.length > 0 ? Math.max(...tasks.map((t) => t.taskNum)) + 1 : 1;
    const today = new Date();
    const dateStr = formatDate(today);
    setTasks((prev) => [...prev, {
      taskNum: nextNum, gate: "Gate 1", task: "", category: "", teamResponsible: "",
      people: [], taskDependency: null, status: "Not Initiated", readyToBeInitiated: "",
      dependencyStatus: "", workDays: 0, startDate: dateStr, endDate: dateStr,
    }]);
  }

  function deleteRow(taskNum: number) {
    setTasks((prev) => prev.filter((t) => t.taskNum !== taskNum));
  }

  function toggleOption(key: FilterKey, option: string) {
    setFilters((prev) => {
      const current = prev[key];
      const updated = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
      return { ...prev, [key]: updated };
    });
  }

  function toggleDropdown(key: FilterKey) { setOpenDropdown((prev) => (prev === key ? null : key)); }

  // If not logged in, show login
  if (!currentUser) return <LoginScreen />;

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

  const ganttProject = selectedProduct ? ganttMap[selectedProduct.name] : null;
  let timelineStart: Date | null = null;
  let timelineEnd: Date | null = null;
  let totalDays = 0;

  if (tasks.length > 0) {
    const dates = tasks.flatMap((t) => {
      try { return [parseDate(t.startDate), parseDate(t.endDate)]; } catch { return []; }
    }).filter((d) => !isNaN(d.getTime()));
    if (dates.length > 0) {
      timelineStart = new Date(Math.min(...dates.map((d) => d.getTime())));
      timelineEnd = new Date(Math.max(...dates.map((d) => d.getTime())));
      totalDays = Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    }
  }

  function getBarStyle(task: GanttTask) {
    if (!timelineStart || totalDays === 0) return { left: "0%", width: "0.5%" };
    try {
      const start = parseDate(task.startDate);
      const end = parseDate(task.endDate);
      const startOffset = Math.ceil((start.getTime() - timelineStart!.getTime()) / (1000 * 60 * 60 * 24));
      const duration = Math.max(Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)), 1);
      return { left: `${(startOffset / totalDays) * 100}%`, width: `${Math.max((duration / totalDays) * 100, 0.5)}%` };
    } catch { return { left: "0%", width: "0.5%" }; }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 app-bg p-8" onClick={() => setOpenDropdown(null)}>
        <h1 className="text-2xl font-bold text-white mb-2">Product Grid</h1>
        <p className="text-sm text-gray-400 mb-6">{products.length} products across {[...new Set(products.map(p => p.brand))].length} brands</p>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8" onClick={(e) => e.stopPropagation()}>
          {filterConfig.map((filter) => (
            <div key={filter.key} className="relative">
              <button onClick={() => toggleDropdown(filter.key)} className="w-full flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all">
                <span>{filter.label}{filters[filter.key].length > 0 && <span className="ml-1 text-indigo-400">({filters[filter.key].length})</span>}</span>
                <svg className={`ml-2 h-4 w-4 transition-transform ${openDropdown === filter.key ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openDropdown === filter.key && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-white/10 modal-glass shadow-lg">
                  {filter.options.length === 0 ? <p className="px-4 py-2 text-sm text-gray-500 italic">No options</p> : (
                    <ul className="max-h-60 overflow-auto py-1">
                      {filter.options.map((option) => (
                        <li key={option}><label className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 cursor-pointer">
                          <input type="checkbox" checked={filters[filter.key].includes(option)} onChange={() => toggleOption(filter.key, option)} className="rounded border-gray-600 bg-transparent text-indigo-500" />{option}
                        </label></li>
                      ))}
                    </ul>
                  )}
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
                  <div key={product.name} onClick={() => setSelectedProduct(product)} className="glass-card rounded-lg p-4 cursor-pointer transition-all">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.gate && <span className="inline-flex items-center rounded-full bg-indigo-100 border border-indigo-200 px-2 py-0.5 text-xs text-indigo-700">Gate {product.gate}</span>}
                      {product.productType && <span className="inline-flex items-center rounded-full bg-green-100 border border-green-200 px-2 py-0.5 text-xs text-green-700">{product.productType}</span>}
                      {product.therapeuticPlatform && <span className="inline-flex items-center rounded-full bg-purple-100 border border-purple-200 px-2 py-0.5 text-xs text-purple-700">{product.therapeuticPlatform}</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{product.manufacturer}</p>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}

        {/* Gantt Chart Modal */}
        {selectedProduct && ganttProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelectedProduct(null)}>
            <div className="modal-glass rounded-xl shadow-2xl w-[95vw] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex-none px-6 py-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedProduct.name}</h2>
                    <p className="text-sm text-gray-400">
                      {selectedProduct.brand} · Gate {selectedProduct.gate} · {selectedProduct.manufacturer}
                      {selectedProduct.therapeuticPlatform && ` · ${selectedProduct.therapeuticPlatform}`}
                      {selectedProduct.productType && ` · ${selectedProduct.productType}`}
                    </p>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                  <span>Project Start: <span className="font-medium text-gray-300">{ganttProject.projectStartDate}</span></span>
                  <span>On-Shelf Date: <span className="font-medium text-gray-300">{ganttProject.onShelfDate}</span></span>
                  <span>Shelf-Life Test Complete: <span className="font-medium text-gray-300">{ganttProject.shelfLifeTestCompleteDate}</span></span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 glow-green"></span><span className="text-gray-400">Completed</span></span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span><span className="text-gray-400">In Progress</span></span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-500"></span><span className="text-gray-400">Not Initiated</span></span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-700 border border-gray-600"></span><span className="text-gray-400">Not Needed</span></span>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="min-w-[1400px]">
                  <div className="sticky top-0 bg-[#141423] border-b border-white/10 flex items-center text-xs font-medium text-gray-500 px-2 py-2 z-10">
                    <div className="w-8 flex-none text-center">#</div>
                    <div className="w-[80px] flex-none">Gate</div>
                    <div className="w-[220px] flex-none">Task</div>
                    <div className="w-[130px] flex-none">Category</div>
                    <div className="w-[110px] flex-none">Team</div>
                    <div className="w-[100px] flex-none">People</div>
                    <div className="w-[40px] flex-none text-center">Dep</div>
                    <div className="w-[110px] flex-none">Status</div>
                    <div className="w-[50px] flex-none text-center">Days</div>
                    <div className="w-[90px] flex-none">Start</div>
                    <div className="w-[90px] flex-none">End</div>
                    <div className="flex-1 pl-2">Timeline</div>
                    <div className="w-8 flex-none"></div>
                  </div>

                  {tasks.map((task) => {
                    const style = getBarStyle(task);
                    return (
                      <div key={task.taskNum} className="flex items-center text-xs px-2 py-1 border-b border-white/5 hover:bg-white/5">
                        <div className="w-8 flex-none text-center text-gray-600">{task.taskNum}</div>
                        <div className="w-[80px] flex-none pr-1">
                          <select value={task.gate} onChange={(e) => updateTask(task.taskNum, "gate", e.target.value)} className="dark-select w-full rounded px-1 py-0.5 text-xs">
                            {gateOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        <div className="w-[220px] flex-none pr-1">
                          <input type="text" value={task.task} onChange={(e) => updateTask(task.taskNum, "task", e.target.value)} className="dark-input w-full rounded px-1.5 py-0.5 text-xs" placeholder="Task name" />
                        </div>
                        <div className="w-[130px] flex-none pr-1">
                          <input type="text" value={task.category} onChange={(e) => updateTask(task.taskNum, "category", e.target.value)} className="dark-input w-full rounded px-1.5 py-0.5 text-xs" placeholder="Category" />
                        </div>
                        <div className="w-[110px] flex-none pr-1">
                          <input type="text" value={task.teamResponsible} onChange={(e) => updateTask(task.taskNum, "teamResponsible", e.target.value)} className="dark-input w-full rounded px-1.5 py-0.5 text-xs" placeholder="Team" />
                        </div>
                        <div className="w-[100px] flex-none pr-1">
                          <input type="text" value={task.people.join(", ")} onChange={(e) => updateTask(task.taskNum, "people", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="dark-input w-full rounded px-1.5 py-0.5 text-xs" placeholder="People" />
                        </div>
                        <div className="w-[40px] flex-none pr-1">
                          <input type="number" value={task.taskDependency ?? ""} onChange={(e) => updateTask(task.taskNum, "taskDependency", e.target.value ? parseInt(e.target.value) : null)} className="dark-input w-full rounded px-1 py-0.5 text-xs text-center" />
                        </div>
                        <div className="w-[110px] flex-none pr-1">
                          <select value={task.status} onChange={(e) => updateTask(task.taskNum, "status", e.target.value)} className={`w-full rounded px-1 py-0.5 text-xs font-medium border-0 cursor-pointer ${getStatusTextColor(task.status)}`}>
                            {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                        <div className="w-[50px] flex-none pr-1">
                          <input type="number" value={task.workDays} onChange={(e) => updateTask(task.taskNum, "workDays", parseInt(e.target.value) || 0)} className="dark-input w-full rounded px-1 py-0.5 text-xs text-center" />
                        </div>
                        <div className="w-[90px] flex-none pr-1">
                          <input type="text" value={task.startDate} onChange={(e) => updateTask(task.taskNum, "startDate", e.target.value)} className="dark-input w-full rounded px-1 py-0.5 text-xs" placeholder="M/D/YYYY" />
                        </div>
                        <div className="w-[90px] flex-none pr-1">
                          <input type="text" value={task.endDate} readOnly className="dark-input w-full rounded px-1 py-0.5 text-xs opacity-60 cursor-not-allowed" title="Auto-calculated from Start + Work Days (M-F)" />
                        </div>
                        <div className="flex-1 pl-2 relative h-5">
                          <div className="absolute inset-0 bg-white/3 rounded"></div>
                          <div className={`absolute top-0.5 h-4 rounded ${getStatusColor(task.status)} opacity-90`} style={style} title={`${task.task}: ${task.startDate} – ${task.endDate}`}></div>
                        </div>
                        <div className="w-8 flex-none text-center">
                          <button onClick={() => deleteRow(task.taskNum)} className="text-red-500/50 hover:text-red-400 text-sm" title="Delete row">&times;</button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="px-4 py-3">
                    <button onClick={addRow} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Row
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
