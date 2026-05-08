import { Metadata } from "next"
import SettingsClient from "./SettingsClient"
import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata: Metadata = {
  title: USER_ROUTES.SETTINGS.title,
}

export default function SettingsPage() {
  return <SettingsClient />
}
