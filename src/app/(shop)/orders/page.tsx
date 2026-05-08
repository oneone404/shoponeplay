import { Metadata } from "next"
import OrdersClient from "./OrdersClient"
import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata: Metadata = {
  title: USER_ROUTES.HISTORY.ORDERS.title,
}

export default function OrdersPage() {
  return <OrdersClient />
}
