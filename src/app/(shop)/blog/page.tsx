import { USER_ROUTES } from "@/lib/config/user-routes";
import BlogContent from "@/components/blog/BlogContent";
import Navbar from "@/components/layouts/Navbar";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: USER_ROUTES.BLOG.title,
  description: "Cập nhật tin tức mới nhất về Play Together, hướng dẫn bảo mật tài khoản và các sự kiện hấp dẫn tại ShopOnePlay.",
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <BlogContent initialPosts={JSON.parse(JSON.stringify(posts))} />
      </div>
    </main>
  );
}
