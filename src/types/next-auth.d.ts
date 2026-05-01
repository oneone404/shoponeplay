import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: string
      id: string
      balance: number
      totalDeposited: number
      emailVerified: Date | null
      twoFactorEnabled: boolean
    } & DefaultSession["user"]
  }
}
