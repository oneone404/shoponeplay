import { USER_ROUTES } from "@/lib/config/user-routes";
import FishIdClient from "@/components/tools/FishIdClient";
import { getSiteConfig } from "@/lib/configUtils";

export const metadata = {
  title: USER_ROUTES.FISH_ID.title,
};

export default async function FishIdPage() {
  const config = await getSiteConfig();
  return <FishIdClient logoUrl={config.siteLogo} />;
}
