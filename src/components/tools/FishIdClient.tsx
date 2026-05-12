"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Copy, 
  Check, 
  Filter, 
  Fish, 
  Trash2, 
  Download, 
  History,
  Layers,
  ChevronDown,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUI } from "@/providers/UIProvider";
import UserPageHeader from "@/components/shared/UserPageHeader";

interface FishData {
  id: string;
  name: string;
  grade: number;
  ItemType: number;
}

interface VersionsResponse {
  versions: string[];
  latest: string;
}

export default function FishIdClient() {
  const { addMessage } = useUI();
  const [data, setData] = useState<FishData[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "fish" | "trash">("all");
  const [selectedGrades, setSelectedGrades] = useState<number[]>([1, 2, 3, 4, 5]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Fetch Versions
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await fetch("/api/tools/fish/versions");
        const json: VersionsResponse = await res.json();
        setVersions(json.versions);
        setSelectedVersion(json.latest);
      } catch (err) {
        console.error("Failed to fetch versions");
      }
    };
    fetchVersions();
  }, []);

  // 2. Fetch Data when version changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedVersion) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/tools/fish/data?version=${selectedVersion}`);
        const json = await res.json();
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (err) {
        addMessage({ type: "error", text: "Không thể tải dữ liệu ID cá" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedVersion, addMessage]);

  // 3. Group and Filtering Logic
  const groupedData = useMemo(() => {
    // First, group by ID
    const groups: Record<string, FishData[]> = {};
    data.forEach(item => {
      if (!groups[item.id]) groups[item.id] = [];
      groups[item.id].push(item);
    });

    // Then filter based on criteria
    const filtered: [string, FishData[]][] = [];
    
    Object.entries(groups).forEach(([id, items]) => {
      const filteredItems = items.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || id.includes(search);
        const matchType = filterType === "all" ? true : (filterType === "fish" ? item.ItemType === 17 : item.ItemType === 9);
        const matchGrade = selectedGrades.includes(item.grade);
        return matchSearch && matchType && matchGrade;
      });

      if (filteredItems.length > 0) {
        filtered.push([id, filteredItems]);
      }
    });

    return filtered.sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [data, search, filterType, selectedGrades]);

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Default check all visible on data change
    const newSet = new Set<string>();
    groupedData.forEach(([id]) => newSet.add(id));
    setCheckedIds(newSet);
  }, [groupedData]);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addMessage({ type: "success", text: `Đã sao chép ID: ${id}` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const ids = Array.from(checkedIds).join(",");
    if (!ids) {
      addMessage({ type: "error", text: "Vui lòng chọn ít nhất một ID để copy!" });
      return;
    }
    navigator.clipboard.writeText(ids);
    addMessage({ type: "success", text: `Đã sao chép ${checkedIds.size} ID đã chọn` });
  };

  const toggleGrade = (grade: number) => {
    setSelectedGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const toggleCheck = (id: string) => {
    const newSet = new Set(checkedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCheckedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (checkedIds.size === groupedData.length) {
      setCheckedIds(new Set());
    } else {
      const newSet = new Set<string>();
      groupedData.forEach(([id]) => newSet.add(id));
      setCheckedIds(newSet);
    }
  };

  const getGradeStyle = (grade: number) => {
    switch (grade) {
      case 1: return { background: "#f2faf3ff", color: "#14532D" };
      case 2: return { background: "#6EE7B7", color: "#065F46" };
      case 3: return { background: "#93C5FD", color: "#1E3A8A" };
      case 4: return { background: "#E9A8F2", color: "#701A75", fontWeight: "bold" };
      case 5: return { 
        background: "linear-gradient(135deg, #F9A8D4, #FDE68A, #6EE7B7, #93C5FD, #E9A8F2)", 
        color: "#1F2937", 
        fontWeight: "bold" 
      };
      default: return { background: "#E5E7EB", color: "#1F2937" };
    }
  };

  const maxItemsPerRow = useMemo(() => {
    let max = 1;
    groupedData.forEach(([_, items]) => {
      if (items.length > max) max = items.length;
    });
    return max;
  }, [groupedData]);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <UserPageHeader 
        title="Danh Sách ID Vật Phẩm" 
        subtitle="Tra cứu mã ID cá, rác thải và các vật phẩm trong Play Together để cấu hình công cụ."
      />

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        
        {/* CONTROL BAR */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-8 py-2">
             {/* Type Switch Style */}
             <div className="flex items-center gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={filterType === "fish" || filterType === "all"}
                      onChange={() => setFilterType(prev => prev === "fish" ? "trash" : (prev === "trash" ? "all" : "fish"))}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 uppercase">Cá</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={filterType === "trash" || filterType === "all"}
                      onChange={() => setFilterType(prev => prev === "trash" ? "fish" : (prev === "fish" ? "all" : "trash"))}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 uppercase">Rác</span>
                </label>
             </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
            {[1, 2, 3, 4, 5].map(g => {
              const style = getGradeStyle(g);
              const isActive = selectedGrades.includes(g);
              const labels = ["Trắng", "Xanh Lá", "Xanh Dương", "Tím (VIP)", "Cầu Vồng (VVIP)"];
              
              return (
                <button
                  key={g}
                  onClick={() => toggleGrade(g)}
                  style={isActive ? style : {}}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[11px] font-bold uppercase transition-all border-2",
                    isActive ? "border-black/10 scale-105 shadow-md" : "bg-white border-slate-200 text-slate-400 opacity-60"
                  )}
                >
                  {labels[g-1]}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-4 border-t border-slate-100">
            <div className="lg:col-span-4">
              <button 
                onClick={handleCopyAll}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs hover:shadow-lg active:scale-95 transition-all"
              >
                <Copy className="w-4 h-4" /> Sao Chép ID Đã Lọc ({checkedIds.size})
              </button>
            </div>
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Tìm kiếm ID hoặc tên cá..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="lg:col-span-3 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <History className="w-4 h-4 text-slate-400 mr-3" />
              <select 
                className="bg-transparent w-full text-xs font-bold uppercase outline-none cursor-pointer"
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
              >
                {versions.map(v => (
                  <option key={v} value={v}>VER: {v} {v === versions[versions.length-1] ? "(LATEST)" : ""}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RESULTS TABLE - Blue Style */}
        <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-md">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải danh sách ID...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="px-4 py-3 border border-blue-800 text-center w-14">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 cursor-pointer accent-blue-500" 
                        checked={checkedIds.size === groupedData.length && groupedData.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 border border-blue-800 text-[11px] font-bold uppercase tracking-widest w-24">ID</th>
                    {Array.from({ length: maxItemsPerRow }).map((_, i) => (
                      <th key={i} className="px-6 py-3 border border-blue-800 text-[11px] font-bold uppercase tracking-widest">
                        Loại {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {groupedData.length > 0 ? (
                    groupedData.map(([id, items], idx) => (
                      <tr key={id} className={cn("hover:bg-blue-50 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-slate-50")}>
                        <td className="px-4 py-3 border border-slate-200 text-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 cursor-pointer accent-blue-600"
                            checked={checkedIds.has(id)}
                            onChange={() => toggleCheck(id)}
                          />
                        </td>
                        <td 
                          className="px-6 py-3 border border-slate-200 font-bold text-blue-800 cursor-pointer hover:bg-blue-100 transition-all relative"
                          onClick={() => handleCopy(id)}
                        >
                          {id}
                          {copiedId === id && (
                            <span className="absolute inset-0 flex items-center justify-center bg-blue-600 text-white text-[10px] animate-fade-in">COPIED</span>
                          )}
                        </td>
                        {Array.from({ length: maxItemsPerRow }).map((_, i) => {
                          const item = items[i];
                          if (!item) return <td key={i} className="px-6 py-3 border border-slate-200"></td>;
                          
                          return (
                            <td 
                              key={i} 
                              className="px-6 py-3 border border-slate-200 font-medium"
                              style={getGradeStyle(item.grade)}
                            >
                              {item.name}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={maxItemsPerRow + 2} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                        Không tìm thấy dữ liệu phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="text-xs text-blue-900 font-medium leading-relaxed">
            Hệ thống tự động gộp các vật phẩm có cùng ID vào một hàng. Bạn có thể chọn hàng loạt ID bằng ô Checkbox và nhấn 
            <strong> "Sao Chép ID Đã Lọc"</strong> để dán trực tiếp vào công cụ hack. Click trực tiếp vào cột ID để copy nhanh từng mã.
          </p>
        </div>
      </div>
    </div>
  );
}
