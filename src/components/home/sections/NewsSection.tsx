"use client"

import Link from "next/link"
import Image from "next/image"
import { BookOpen } from "lucide-react"
import { format } from "date-fns"
import { vi, enUS } from "date-fns/locale"
import { ROUTES } from "@/lib/routes"
import { useLanguage } from "@/providers/LanguageProvider"

interface NewsSectionProps {
  posts: any[]
}

export function NewsSection({ posts }: NewsSectionProps) {
  const { language, t } = useLanguage();
  
  if (!posts || posts.length === 0) return null;

  const dateLocale = language === "vi" ? vi : enUS;

  return (
    <section className="py-20 border-t border-border">


      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={ROUTES.BLOG_DETAIL(post.slug)} 
            className="group block bg-card border border-border p-4 rounded-2xl hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-5">
              <Image
                src={post.image || `/images/categories/cat_play.png`}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-primary px-3 py-1.5 rounded-lg ml-auto">{t.common.read_more}</span>
              </div>
            </div>
            <div className="space-y-3 px-1 pb-2">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                <BookOpen className="w-3 h-3" />
                <span>
                  {post.category === 'guides' ? t.home.guides : 
                   post.category === 'events' ? t.home.events : t.home.news}
                </span>
              </div>
              <h4 className="font-bold text-lg md:text-xl uppercase tracking-tighter leading-tight group-hover:text-primary transition-all line-clamp-2">
                {post.title}
              </h4>

              <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-muted-foreground tracking-widest uppercase border-t border-border mt-3">
                <span>{format(new Date(post.createdAt), "dd MMMM, yyyy", { locale: dateLocale })}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
