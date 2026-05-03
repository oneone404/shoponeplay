import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,    // 1 day
  },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // On first sign-in, populate token with user data
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }

      // Always sync with DB to keep data fresh (on every request)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { email: true, name: true, role: true, image: true, balance: true, totalDeposited: true, emailVerified: true, twoFactorEnabled: true },
        });
        if (dbUser) {
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.picture = dbUser.image;
          token.balance = dbUser.balance;
          token.totalDeposited = dbUser.totalDeposited;
          token.emailVerified = dbUser.emailVerified;
          token.twoFactorEnabled = dbUser.twoFactorEnabled;
        } else {
          // USER DELETED FROM DB -> INVALIDATE TOKEN
          return null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      if (session.user) {
        session.user.balance = (token.balance as number) || 0;
        session.user.totalDeposited = (token.totalDeposited as number) || 0;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
      }
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      if (user?.id) {
        try {
          const { headers } = await import("next/headers");
          const headerList = await headers();
          const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";
          const userAgent = headerList.get("user-agent") || "Unknown";

          await prisma.userActivity.create({
            data: {
              userId: user.id,
              type: "LOGIN",
              ip: ip.split(',')[0], // Take first IP if multiple
              userAgent,
              details: "Người dùng đăng nhập vào hệ thống"
            }
          });
          
          console.log(`[AUTH_LOG] Recorded LOGIN for user ${user.id} from IP ${ip}`);
        } catch (error) {
          console.error("[AUTH_LOG_ERROR] Failed to record login activity:", error);
        }
      }
    }
  }
});
