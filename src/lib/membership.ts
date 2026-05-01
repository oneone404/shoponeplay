export const getMembershipTier = (totalDeposited: number) => {
  if (totalDeposited >= 10000000) return { name: "Ruby", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
  if (totalDeposited >= 5000000) return { name: "Kim Cương", color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" };
  if (totalDeposited >= 1000000) return { name: "Vàng", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  if (totalDeposited >= 500000) return { name: "Bạc", color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" };
  return { name: "Đồng", color: "text-orange-700", bg: "bg-orange-700/10", border: "border-orange-700/20" };
};
