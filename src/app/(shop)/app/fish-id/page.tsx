import { USER_ROUTES } from "@/lib/config/user-routes";
import FishIdClient from "@/components/tools/FishIdClient";

export const metadata = {
  title: USER_ROUTES.FISH_ID.title,
};

export default function FishIdPage() {
  return <FishIdClient />;
}
