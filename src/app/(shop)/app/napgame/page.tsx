import { getNapGameConfig, getTopupProducts } from "@/app/admin/settings/napgame/actions"
import { getSiteConfig } from "@/lib/configUtils"
import NapGameClient from "@/components/napgame/NapGameClient"
import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata = {
  title: USER_ROUTES.NAPGAME.title,
}

export default async function NapGamePage() {
  const [config, { hotItems }, topupProducts] = await Promise.all([
    getSiteConfig(),
    getNapGameConfig(),
    getTopupProducts(),
  ])

  const topupProductsForClient = topupProducts
    .filter(p => p.enabled)
    .map(p => ({
      id: p.id,
      name: p.name,
      vngProductId: p.vngProductId,
      sellPrice: p.sellPrice,
      enabled: p.enabled,
    }))

  return (
    <NapGameClient 
      initialHotConfig={hotItems} 
      logoUrl={config.siteLogo}
      topupProducts={topupProductsForClient}
    />
  )
}

