import { Metadata } from "next"
import BalanceHistoryClient from "./BalanceHistoryClient"
import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata: Metadata = {
  title: USER_ROUTES.HISTORY.BALANCE.title,
}

export default function BalanceHistoryPage() {
  return <BalanceHistoryClient />
}
