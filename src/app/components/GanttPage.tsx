"use client";

import { useState, useEffect } from "react";
import { mensHairGantt, GanttTask } from "../ganttData";
import { useUser } from "../context/UserContext";
import { Product } from "../page";

const statusOptions = ["Not Initiated", "In Progress", "Pending", "At Risk", "Completed", "Not Needed"];
const gateOptions = ["Gate 0", "Gate 1", "Gate 2", "Gate 3"];

function getStatusColor(status: string) {
  switch (status) {
    case "Completed": return "bg-green-500";
    case "In Progress": return "bg-blue-500";
    case "Pending": return "bg-orange-400";
    case "At Risk": return "bg-red-500";
    case "Not Initiated": return "bg-gray-500";
    case "Not Needed": return "bg-gray-700";
    default: return "bg-gray-500";
  }
}

function getStatusTextColor(status: string) {
  switch (status) {
    case "Completed": return "text-green-800 bg-green-100";
    case "In Progress": return "text-blue-800 bg-blue-100";
    case "Pending": return "text-orange-800 bg-orange-100";
    case "At Risk": return "text-red-800 bg-red-100";
    case "Not Initiated": return "text-gray-700 bg-gray-200";
    case "Not Needed": return "text-gray-600 bg-gray-100";
    default: return "text-gray-700 bg-gray-200";
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
    if (result.getDay() !== 0 && result.getDay() !== 6) added++;
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

export default function GanttPage({ product, onBack }: { product: Product; onBack: () => void }) {
  const { addNotification } = useUser();
  const [tasks, setTasks] = useState<GanttTask[]>([]);

  useEffect(() => {
    setTasks(mensHairGantt.tasks.map((t) => ({ ...t })));
  }, []);

  // Calculate if project is behind
  const today = new Date();
  const behindTasks = tasks.filter((t) => {
    if (t.status === "Completed" || t.status === "Not Needed") return false;
    try {
      const end = parseDate(t.endDate);
      return end < today && t.status !== "Completed";
    } catch { return false; }
  });

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
      if (field === "status" && value === "Completed") {
        const completedTask = newTasks.find((t) => t.taskNum === taskNum);
        const dependentTasks = newTasks.filter((t) => t.taskDependency === taskNum);
        if (completedTask && dependentTasks.length > 0) {
          dependentTasks.forEach((dt) => {
            dt.people.forEach((person) => {
              addNotification(person, `"${completedTask.task}" (Task #${taskNum}) is now complete. Your task "${dt.task}" (Task #${dt.taskNum}) is ready to begin.`);
            });
          });
        }
      }
      return newTasks;
    });
  }

  function addRow() {
    const nextNum = tasks.length > 0 ? Math.max(...tasks.map((t) => t.taskNum)) + 1 : 1;
    const dateStr = formatDate(new Date());
    setTasks((prev) => [...prev, { taskNum: nextNum, gate: "Gate 1", task: "", category: "", teamResponsible: "", people: [], taskDependency: null, status: "Not Initiated", readyToBeInitiated: "", dependencyStatus: "", workDays: 0, startDate: dateStr, endDate: dateStr }]);
  }

  function deleteRow(taskNum: number) { setTasks((prev) => prev.filter((t) => t.taskNum !== taskNum)); }

  // Timeline calculations
  let timelineStart: Date | null = null;
  let totalDays = 0;
  if (tasks.length > 0) {
    const dates = tasks.flatMap((t) => { try { return [parseDate(t.startDate), parseDate(t.endDate)]; } catch { return []; } }).filter((d) => !isNaN(d.getTime()));
    if (dates.length > 0) {
      timelineStart = new Date(Math.min(...dates.map((d) => d.getTime())));
      const timelineEnd = new Date(Math.max(...dates.map((d) => d.getTime())));
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
    <main className="flex-1 app-bg p-6">
      <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Products
      </button>
      <h1 className="text-xl font-bold text-white mb-1">Gantt Chart — {product.name}</h1>
      <p className="text-sm text-gray-400 mb-4">{product.brand} · Gate {product.gate} · {product.manufacturer}</p>

      {/* Behind schedule warning */}
      {behindTasks.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-sm font-medium text-red-300">⚠ Project is behind schedule — {behindTasks.length} task(s) overdue</p>
          <ul className="mt-1 text-xs text-red-400">
            {behindTasks.slice(0, 5).map((t) => <li key={t.taskNum}>#{t.taskNum} {t.task} (due {t.endDate})</li>)}
          </ul>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs mb-4">
        {statusOptions.map((s) => <span key={s} className="flex items-center gap-1"><span className={`w-3 h-3 rounded ${getStatusColor(s)}`}></span><span className="text-gray-400">{s}</span></span>)}
      </div>

      <div className="overflow-auto modal-glass rounded-lg">
        <div className="min-w-[1400px]">
          <div className="sticky top-0 bg-[#1a2744] border-b border-white/10 flex items-center text-xs font-medium text-gray-500 px-2 py-2 z-10">
            <div className="w-8 flex-none text-center">#</div>
            <div className="w-[80px] flex-none">Gate</div>
            <div className="w-[200px] flex-none">Task</div>
            <div className="w-[120px] flex-none">Category</div>
            <div className="w-[100px] flex-none">Team</div>
            <div className="w-[100px] flex-none">People</div>
            <div className="w-[35px] flex-none text-center">Dep</div>
            <div className="w-[110px] flex-none">Status</div>
            <div className="w-[45px] flex-none text-center">Days</div>
            <div className="w-[85px] flex-none">Start</div>
            <div className="w-[85px] flex-none">End</div>
            <div className="flex-1 pl-2">Timeline</div>
            <div className="w-6 flex-none"></div>
          </div>

          {tasks.map((task) => {
            const style = getBarStyle(task);
            const isOverdue = (() => { try { return parseDate(task.endDate) < today && task.status !== "Completed" && task.status !== "Not Needed"; } catch { return false; } })();
            return (
              <div key={task.taskNum} className={`flex items-center text-xs px-2 py-1 border-b border-white/5 hover:bg-white/5 ${isOverdue ? "bg-red-500/5" : ""}`}>
                <div className="w-8 flex-none text-center text-gray-600">{task.taskNum}</div>
                <div className="w-[80px] flex-none pr-1">
                  <select value={task.gate} onChange={(e) => updateTask(task.taskNum, "gate", e.target.value)} className="dark-select w-full rounded px-1 py-0.5 text-xs">
                    {gateOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="w-[200px] flex-none pr-1">
                  <input type="text" value={task.task} onChange={(e) => updateTask(task.taskNum, "task", e.target.value)} className="dark-input w-full rounded px-1.5 py-0.5 text-xs" />
                </div>
                <div className="w-[120px] flex-none pr-1">
                  <input type="text" value={task.category} onChange={(e) => updateTask(task.taskNum, "category", e.target.value)} className="dark-input w-full rounded px-1.5 py-0.5 text-xs" />
                </div>
                <div className="w-[100px] flex-none pr-1">
                  <input type="text" value={task.teamResponsible} onChange={(e) => updateTask(task.taskNum, "teamResponsible", e.target.value)} className="dark-input w-full rounded px-1.5 py-0.5 text-xs" />
                </div>
                <div className="w-[100px] flex-none pr-1">
                  <input type="text" value={task.people.join(", ")} onChange={(e) => updateTask(task.taskNum, "people", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="dark-input w-full rounded px-1.5 py-0.5 text-xs" />
                </div>
                <div className="w-[35px] flex-none pr-1">
                  <input type="number" value={task.taskDependency ?? ""} onChange={(e) => updateTask(task.taskNum, "taskDependency", e.target.value ? parseInt(e.target.value) : null)} className="dark-input w-full rounded px-1 py-0.5 text-xs text-center" />
                </div>
                <div className="w-[110px] flex-none pr-1">
                  <select value={task.status} onChange={(e) => updateTask(task.taskNum, "status", e.target.value)} className={`w-full rounded px-1 py-0.5 text-xs font-medium border-0 cursor-pointer ${getStatusTextColor(task.status)}`}>
                    {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="w-[45px] flex-none pr-1">
                  <input type="number" value={task.workDays} onChange={(e) => updateTask(task.taskNum, "workDays", parseInt(e.target.value) || 0)} className="dark-input w-full rounded px-1 py-0.5 text-xs text-center" />
                </div>
                <div className="w-[85px] flex-none pr-1">
                  <input type="text" value={task.startDate} onChange={(e) => updateTask(task.taskNum, "startDate", e.target.value)} className="dark-input w-full rounded px-1 py-0.5 text-xs" />
                </div>
                <div className="w-[85px] flex-none pr-1">
                  <input type="text" value={task.endDate} readOnly className="dark-input w-full rounded px-1 py-0.5 text-xs opacity-60 cursor-not-allowed" />
                </div>
                <div className="flex-1 pl-2 relative h-5">
                  <div className="absolute inset-0 bg-white/3 rounded"></div>
                  <div className={`absolute top-0.5 h-4 rounded ${getStatusColor(task.status)} opacity-90`} style={style}></div>
                </div>
                <div className="w-6 flex-none text-center">
                  <button onClick={() => deleteRow(task.taskNum)} className="text-red-500/50 hover:text-red-400 text-sm">&times;</button>
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
    </main>
  );
}
