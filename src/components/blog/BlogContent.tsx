"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, Calendar, Clock, 
  BookOpen, Star, TrendingUp,
  ArrowRight, MessageSquare
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { ROUTES } from "@/lib/routes";
import { useLanguage } from "@/providers/LanguageProvider";

export default function BlogContent({ initialPosts }: { initialPosts: any[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { language, t } = useLanguage();

  const CATEGORIES = [
    { id: "all", label: t.blog.categories.all, icon: <BookOpen className="w-4 h-4" /> },
    { id: "news", label: t.blog.categories.news, icon: <Star className="w-4 h-4" /> },
    { id: "guides", label: t.blog.categories.guides, icon: <TrendingUp className="w-4 h-4" /> },
    { id: "events", label: t.blog.categories.events, icon: <Calendar className="w-4 h-4" /> },
    { id: "giftcode", label: t.blog.categories.giftcode, icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const filteredPosts = initialPosts.filter(post => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const dateLocale = language === "vi" ? vi : enUS;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.blog.header}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold uppercase tracking-tighter"
        >
          {t.blog.title} <span className="text-primary">{t.blog.subtitle}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed"
        >
          {t.blog.desc}
        </motion.p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border/50">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 border",
                activeCategory === cat.id
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-card border-border hover:border-primary/50 text-muted-foreground"
              )}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={t.blog.search_placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary focus:bg-card transition-all"
          />
        </div>
      </div>

      {/* Blog Grid: 1 Hàng 3 Cột đồng nhất */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex"
          >
            <Link 
              href={ROUTES.BLOG_DETAIL(post.slug)}
              className="group flex flex-col w-full bg-card border border-border/60 rounded-[32px] overflow-hidden shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-300"
            >
              {/* Image with fixed aspect ratio */}
              <div className="aspect-[16/10] relative overflow-hidden bg-secondary">
                <Image
                  src={post.image || "/images/categories/cat_play.png"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-lg border border-white/10">
                    {(t as any).blog.categories[post.category] || post.category}
                  </span>
                </div>
              </div>

              {/* Content area with flex-1 to push footer down */}
              <div className="p-6 md:p-8 flex flex-col flex-1 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {format(new Date(post.createdAt), "dd/MM/yyyy", { locale: dateLocale })}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors leading-tight min-h-[3rem] flex-1">
                  {post.title}
                </h3>

                
                <div className="pt-5 mt-auto border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-secondary border border-border p-0.5">
                      <img 
                        src={post.author?.image || "/images/avatars/one-bot.png"} 
                        alt="Author" 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{post.author?.name || "Admin"}</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/5">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground opacity-30">
            <BookOpen className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight">{t.blog.no_results}</h3>
          <button 
            onClick={() => {setActiveCategory("all"); setSearchQuery("");}}
            className="text-primary text-xs font-bold uppercase tracking-widest underline underline-offset-4"
          >
            {t.blog.back_to_all}
          </button>
        </div>
      )}

      {/* Community CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mt-32 overflow-hidden rounded-[40px] border border-primary/20 bg-card/40 backdrop-blur-xl"
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="relative z-10 p-8 md:p-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)]">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{t.blog.community_subtitle}</span>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter leading-none text-foreground">
                  {t.blog.community_title.split("VỚI")[0]} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-x">
                    {language === "vi" ? "VỚI CHÚNG TÔI" : "WITH US"}
                  </span>
                </h2>
                <p className="text-muted-foreground font-semibold text-lg md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {t.blog.community_desc}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto">
              <Link 
                href="#" 
                className="group relative px-12 py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:-translate-y-1 active:translate-y-0 border-b-4 border-primary/20 shadow-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Facebook
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              
              <Link 
                href="#" 
                className="group relative px-12 py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:-translate-y-1 active:translate-y-0 border-b-4 border-primary/20 shadow-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Group Zalo
                  <MessageSquare className="w-4 h-4 text-primary" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-[40px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/40 rounded-br-[40px] opacity-50" />
      </motion.div>
    </div>
  );
}
