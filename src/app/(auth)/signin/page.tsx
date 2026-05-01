import { USER_ROUTES } from "@/lib/config/user-routes"
import { SignInForm } from "@/components/auth/SignInForm"

export const metadata = {
  title: USER_ROUTES.SIGNIN.title,
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignInForm />
    </div>
  )
}
