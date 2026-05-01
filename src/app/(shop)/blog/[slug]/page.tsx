import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/layouts/Navbar";
import BlogDetailContent from "@/components/blog/BlogDetailContent";

import { USER_ROUTES } from "@/lib/config/user-routes";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug }
  });

  if (!post) return { title: "Không tìm thấy bài viết" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true }
  });

  if (!post || !post.published) {
    notFound();
  }

  let relatedPosts = await prisma.post.findMany({
    where: { 
      category: post.category,
      id: { not: post.id },
      published: true
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  // Nếu không có bài cùng chuyên mục, lấy các bài mới nhất khác chuyên mục
  if (relatedPosts.length === 0) {
    relatedPosts = await prisma.post.findMany({
      where: { 
        id: { not: post.id },
        published: true
      },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BlogDetailContent 
        post={JSON.parse(JSON.stringify(post))} 
        relatedPosts={JSON.parse(JSON.stringify(relatedPosts))} 
      />
    </main>
  );
}
