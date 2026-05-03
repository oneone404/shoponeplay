import SellerLayoutShell from "@/components/seller/SellerLayoutShell";

export default function SellerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SellerLayoutShell>
      {children}
    </SellerLayoutShell>
  );
}
