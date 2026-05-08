import { Metadata } from "next"
import CardHistoryClient from "./CardHistoryClient"
import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata: Metadata = {
  title: USER_ROUTES.HISTORY.CARD.title,
}

export default function CardHistoryPage() {
  return <CardHistoryClient />
}
