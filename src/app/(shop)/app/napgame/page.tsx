import { getNapGameConfig } from "@/app/admin/settings/napgame/actions"
import { getSiteConfig } from "@/lib/configUtils"
import NapGameClient from "@/components/napgame/NapGameClient"
import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata = {
  title: USER_ROUTES.NAPGAME.title,
}

export default async function NapGamePage() {
  const [config, { hotItems }] = await Promise.all([
    getSiteConfig(),
    getNapGameConfig()
  ])

  return <NapGameClient initialHotConfig={hotItems} logoUrl={config.siteLogo} />
}
