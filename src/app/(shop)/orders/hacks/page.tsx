import { Metadata } from "next"
import HacksHistoryClient from "./HacksHistoryClient"

import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata: Metadata = {
  title: USER_ROUTES.HISTORY.HACKS.title,
}

export default function HacksHistoryPage() {
  return <HacksHistoryClient />
}
