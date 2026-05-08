import { Metadata } from "next"
import BankHistoryClient from "./BankHistoryClient"
import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata: Metadata = {
  title: USER_ROUTES.HISTORY.BANK.title,
}

export default function BankHistoryPage() {
  return <BankHistoryClient />
}
