import { USER_ROUTES } from "@/lib/config/user-routes"
import { SignUpForm } from "@/components/auth/SignUpForm"

export const metadata = {
  title: USER_ROUTES.SIGNUP.title,
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignUpForm />
    </div>
  )
}
