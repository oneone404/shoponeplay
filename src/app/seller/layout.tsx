export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Seller Placeholder */}
      <aside className="w-64 border-r border-border p-6 hidden md:block bg-card">
        <h2 className="text-xl font-bold text-accent mb-8 select-none">ShopOnePlay <br/><span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Kênh Người Bán</span></h2>
        <nav className="space-y-2 text-sm font-medium">
          <div className="p-3 bg-accent/10 text-accent rounded-xl cursor-pointer">Dashboard</div>
          <div className="p-3 text-muted-foreground hover:bg-secondary rounded-xl cursor-pointer">Sản phẩm của tôi</div>
          <div className="p-3 text-muted-foreground hover:bg-secondary rounded-xl cursor-pointer">Đơn hàng</div>
          <div className="p-3 text-muted-foreground hover:bg-secondary rounded-xl cursor-pointer">Doanh thu & Rút tiền</div>
        </nav>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
