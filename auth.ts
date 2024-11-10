import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user) {
        const userWithRole = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        })
        token.role = userWithRole ? userWithRole.role.toString() : 'user';
      }
      return token;
    },
    async session({ session, token }) {
      if (!token?.sub) {
        return session;
      }
      const userWithRole = await db.user.findUnique({
        where: { id: token?.sub },
        select: { role: true },
      })
      session.user.role = userWithRole ? userWithRole.role.toString() : 'user';
      return session;
    }
  },
})