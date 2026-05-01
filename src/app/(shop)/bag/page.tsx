import { USER_ROUTES } from "@/lib/config/user-routes"
import CartContent from "@/components/cart/CartContent"

export const metadata = {
  title: USER_ROUTES.BAG.title,
}

export default function CartPage() {
  return <CartContent />
}
