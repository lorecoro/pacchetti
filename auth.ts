import NextAuth from "next-auth";
import Nodemailer from "@auth/core/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = user.id;
        (token as any).sub = user.id;
        const userWithRole = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        })
        token.role = userWithRole ? userWithRole.role.toString() : 'user';
      }
      return token;
    },
    async session({ session, token }) {
      const id = token?.sub ?? (token as any).id;
      if (!id) return session;
      if (!session.user) session.user = {} as any;
      session.user.id = id;
      const userWithRole = await db.user.findUnique({
        where: { id },
        select: { role: true },
      })
      session.user.role = userWithRole ? userWithRole.role.toString() : 'user';
      return session;
    }
  },
})