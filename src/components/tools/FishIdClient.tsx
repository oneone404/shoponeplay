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

  // 3. Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.includes(search);
      const matchType = filterType === "all" ? true : (filterType === "fish" ? item.ItemType === 17 : item.ItemType === 9);
      const matchGrade = selectedGrades.includes(item.grade);
      return matchSearch && matchType && matchGrade;
    });
  }, [data, search, filterType, selectedGrades]);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addMessage({ type: "success", text: `Đã sao chép ID: ${id}` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const ids = filteredData.map(i => i.id).join(",");
    if (!ids) return;
    navigator.clipboard.writeText(ids);
    addMessage({ type: "success", text: "Đã sao chép danh sách ID đã lọc" });
  };

  const toggleGrade = (grade: number) => {
    setSelectedGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const getGradeStyle = (grade: number) => {
    switch (grade) {
      case 2: return "bg-green-500/10 text-green-500 border-green-500/20";
      case 3: return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 4: return "bg-purple-500/10 text-purple-500 border-purple-500/30 font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]";
      case 5: return "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none font-bold shadow-lg animate-gradient-x";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getGradeName = (grade: number) => {
    switch (grade) {
      case 1: return "Thường";
      case 2: return "Hiếm";
      case 3: return "Rất Hiếm";
      case 4: return "VIP (Tím)";
      case 5: return "VVIP (Cầu vồng)";
      default: return "Không xác định";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <UserPageHeader 
        title="Danh Sách ID Vật Phẩm" 
        subtitle="Tra cứu mã ID cá, rác thải và các vật phẩm trong Play Together để cấu hình công cụ."
      />

      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        
        {/* CONTROL BAR */}
        <div className="bg-card border-2 border-border rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Search */}
            <div className="lg:col-span-5 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Tìm kiếm tên vật phẩm hoặc ID..."
                className="w-full pl-12 pr-4 py-3.5 bg-secondary/50 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl transition-all font-medium outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Version Select */}
            <div className="lg:col-span-3 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground pointer-events-none">
                <History className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ver:</span>
              </div>
              <select 
                className="w-full pl-20 pr-10 py-3.5 bg-secondary/50 border-2 border-transparent focus:border-primary focus:bg-background rounded-2xl appearance-none outline-none font-bold cursor-pointer transition-all"
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
              >
                {versions.map(v => (
                  <option key={v} value={v}>{v} {v === versions[versions.length-1] ? "(Mới nhất)" : ""}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Copy Button */}
            <div className="lg:col-span-4">
              <button 
                onClick={handleCopyAll}
                disabled={filteredData.length === 0}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100"
              >
                <Download className="w-4 h-4" />
                <span>Sao chép ID đã lọc ({filteredData.length})</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
            {/* Filter Type */}
            <div className="flex bg-secondary/50 p-1 rounded-xl">
              {(["all", "fish", "trash"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center space-x-2",
                    filterType === t ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === 'fish' && <Fish className="w-3 h-3" />}
                  {t === 'trash' && <Trash2 className="w-3 h-3" />}
                  <span>{t === 'all' ? "Tất cả" : t === 'fish' ? "Cá" : "Rác"}</span>
                </button>
              ))}
            </div>

            {/* Grade Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-2 flex items-center">
                <Layers className="w-3 h-3 mr-1" /> Phẩm chất:
              </span>
              {[1, 2, 3, 4, 5].map(g => (
                <button
                  key={g}
                  onClick={() => toggleGrade(g)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase border-2 transition-all",
                    selectedGrades.includes(g) 
                      ? getGradeStyle(g) 
                      : "border-border text-muted-foreground opacity-50 grayscale"
                  )}
                >
                  G{g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS TABLE */}
        <div className="bg-card border-2 border-border rounded-[32px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Đang nạp dữ liệu vật phẩm...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/30 border-b border-border">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mã ID</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Tên Vật Phẩm</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Loại</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center">Phẩm Chất</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <AnimatePresence mode="popLayout">
                    {filteredData.map((item) => (
                      <motion.tr 
                        key={item.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-8 py-4">
                          <code className="bg-secondary px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-primary group-hover:bg-background transition-colors">
                            {item.id}
                          </code>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm group-hover:text-primary transition-colors">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-medium">{item.ItemType === 17 ? "Cá" : "Vật phẩm khác"}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          {item.ItemType === 17 ? (
                            <div className="flex items-center text-green-500 font-bold text-[10px] uppercase tracking-wider">
                              <Fish className="w-3.5 h-3.5 mr-1.5" /> Cá
                            </div>
                          ) : (
                            <div className="flex items-center text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Rác
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex justify-center">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter border",
                              getGradeStyle(item.grade)
                            )}>
                              {getGradeName(item.grade)}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button 
                            onClick={() => handleCopy(item.id)}
                            className="p-2.5 bg-secondary hover:bg-primary hover:text-white rounded-xl transition-all group/btn active:scale-90"
                            title="Sao chép ID"
                          >
                            {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-secondary rounded-full">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold uppercase tracking-tight">Không tìm thấy kết quả</p>
                <p className="text-sm text-muted-foreground font-medium">Vui lòng thử từ khóa khác hoặc điều chỉnh bộ lọc.</p>
              </div>
              <button 
                onClick={() => {setSearch(""); setFilterType("all"); setSelectedGrades([1,2,3,4,5])}}
                className="text-[10px] font-bold uppercase text-primary hover:underline tracking-widest"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* TIPS SECTION */}
        <div className="bg-primary/5 border-2 border-primary/10 rounded-[32px] p-6 flex items-start space-x-4">
          <div className="p-2 bg-primary/10 rounded-xl text-primary mt-1">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-tight text-primary">Mẹo nhỏ cho bạn</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Bạn có thể sử dụng tính năng <strong>"Sao chép ID đã lọc"</strong> để lấy nhanh danh sách ID cho các phiên bản hack. 
              Các ID sẽ được nối với nhau bằng dấu phẩy (,), giúp bạn dán trực tiếp vào phần cấu hình của công cụ một cách tiện lợi nhất.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
