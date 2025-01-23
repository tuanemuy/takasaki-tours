import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import type { AdapterUser as BaseAdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import Sendgrid from "next-auth/providers/sendgrid";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/client";
import { accounts, users, verificationTokens } from "@/lib/db/schema";

declare module "next-auth" {
  interface User {
    id?: string;
    role: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string | null;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends BaseAdapterUser {
    role: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Sendgrid({
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
      }

      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
