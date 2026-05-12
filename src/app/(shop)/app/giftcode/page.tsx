import { Metadata } from "next"
import GiftcodeClient from "./GiftcodeClient"

import { USER_ROUTES } from "@/lib/config/user-routes"

export const metadata: Metadata = {
  title: USER_ROUTES.GIFTCODE.title,
  description: "Hệ thống nhập Giftcode hàng loạt và tự động hóa siêu tốc.",
}

export default function GiftcodePage() {
  return <GiftcodeClient />
}
