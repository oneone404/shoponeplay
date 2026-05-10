import { Metadata } from "next"
import AccountsHistoryClient from "./AccountsHistoryClient"
import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata: Metadata = {
  title: USER_ROUTES.HISTORY.ACCOUNTS.title,
}

export default function AccountsHistoryPage() {
  return <AccountsHistoryClient />
}
