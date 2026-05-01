import { USER_ROUTES } from "@/lib/config/user-routes"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"

export const metadata = {
  title: USER_ROUTES.FORGOT_PASSWORD.title,
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  )
}
