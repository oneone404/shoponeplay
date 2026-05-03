"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { 
  Calendar, Clock, ArrowLeft, 
  Share2, ChevronRight, Star,
  Send, Link as LinkIcon,
  List
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/routes";
import { useLanguage } from "@/providers/LanguageProvider";

interface BlogDetailContentProps {
  post: any;
  relatedPosts: any[];
}

export default function BlogDetailContent({ post, relatedPosts }: BlogDetailContentProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const { language, t } = useLanguage();

  useEffect(() => {
    // Tự động tìm các thẻ H2, H3 trong nội dung để làm mục lục
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = post.content;
    const elements = contentDiv.querySelectorAll('h2, h3');
    
    const extractedHeadings = Array.from(elements).map((el, index) => {
      const text = el.textContent || "";
      const id = `heading-${index}`;
      return { id, text, level: el.tagName === 'H2' ? 2 : 3 };
    });
    
    setHeadings(extractedHeadings);
  }, [post.content]);

  // Hàm để render nội dung đã được gán ID cho tiêu đề
  const getProcessedContent = () => {
    let processedContent = post.content;
    headings.forEach((heading, index) => {
      const tag = heading.level === 2 ? 'h2' : 'h3';
      processedContent = processedContent.replace(
        new RegExp(`<${tag}>${heading.text}</${tag}>`, 'i'),
        `<${tag} id="${heading.id}" class="scroll-mt-32">${heading.text}</${tag}>`
      );
    });
    return processedContent;
  };

  const dateLocale = language === "vi" ? vi : enUS;

  return (
    <article className="pt-24 pb-20">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <Link 
          href={ROUTES.BLOG}
          className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t.blog.back_to_blog}</span>
        </Link>

        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">
              {(t as any).blog.categories[post.category] || post.category}
            </span>
            <div className="h-1 w-1 bg-border rounded-full" />
            <div className="flex items-center space-x-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(post.createdAt), "dd MMMM, yyyy", { locale: dateLocale })}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-[1.1]">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-border/50">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl border border-primary/20 p-0.5 bg-background overflow-hidden">
                <img 
                  src={post.author.image || "/images/avatars/one-bot.png"} 
                  alt={post.author.name} 
                  className="w-full h-full object-cover rounded-[10px]" 
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">{t.common.author}</p>
                <p className="text-sm font-bold">{post.author.name || "Admin"}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2.5 rounded-xl border border-border hover:border-primary/40 hover:text-primary transition-all active:scale-95">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-xl border border-border hover:border-primary/40 hover:text-primary transition-all active:scale-95">
                <Send className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-xl border border-border hover:border-primary/40 hover:text-primary transition-all active:scale-95">
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table of Contents Section */}
          {headings.length > 0 && (
            <div className="bg-secondary/30 border border-border rounded-[24px] p-6 md:p-8 space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                <List className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-widest">{t.blog.table_of_contents}</h3>
              </div>
              <ul className="space-y-3">
                {headings.map((heading) => (
                  <li 
                    key={heading.id}
                    className={cn(
                      "transition-all hover:translate-x-1",
                      heading.level === 3 ? "pl-6 opacity-80" : ""
                    )}
                  >
                    <a 
                      href={`#${heading.id}`}
                      className="text-sm font-medium hover:text-primary flex items-center gap-2 group"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors shrink-0" />
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="relative aspect-[21/9] rounded-[40px] overflow-hidden border border-border">
          <Image 
            src={post.image || "/images/categories/cat_play.png"}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 mt-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px] gap-12">
          {/* Article Body */}
          <div 
            className="prose prose-invert prose-primary max-w-none prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
          />

          {/* Side Actions (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-32 space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-px h-12 bg-gradient-to-b from-transparent to-border" />
                <span className="[writing-mode:vertical-rl] text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground opacity-50">
                  {t.blog.scroll_to_read}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Posts Section */}
        <div className="mt-24 space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight">{t.blog.you_may_like}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.slice(0, 2).map((rel) => (
              <Link 
                key={rel.id} 
                href={ROUTES.BLOG_DETAIL(rel.slug)}
                className="group flex items-center gap-5 p-4 bg-card/40 border border-border rounded-3xl hover:border-primary/40 transition-all"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-border">
                  <Image 
                    src={rel.image || "/images/categories/cat_play.png"}
                    alt={rel.title}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary opacity-80">
                    {(t as any).blog.categories[rel.category] || rel.category}
                  </span>
                  <h4 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 uppercase">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </article>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
