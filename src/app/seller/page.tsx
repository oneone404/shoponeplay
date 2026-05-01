import { SELLER_ROUTES } from "@/lib/config/seller-routes";

export const metadata = {
  title: SELLER_ROUTES.DASHBOARD.title,
};

export default function SellerDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kênh Người Bán</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground text-sm">Doanh thu tạm tính</p>
          <h3 className="text-3xl font-bold text-accent mt-2">0đ</h3>
        </div>
        <div className="p-6 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground text-sm">Đơn hàng mới</p>
          <h3 className="text-3xl font-bold text-primary mt-2">0</h3>
        </div>
      </div>
    </div>
  );
}
