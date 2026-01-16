'use server';

import { auth, signIn, signOut } from "@/auth"
import { db } from "@/db";

export async function logIn() {
  return signIn();
}

export async function logOut() {
  return signOut();
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return (session?.user?.role === 'ADMIN')
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return (!!session?.user);
}

export async function getUserCompanyId(): Promise<string> {
  const session = await auth();
  if (!session?.user) {
    return '';
  }
  const user = await db.user.findFirst({
    select: {
      companyId: true
    },
    where: {
      id: session.user.id
    }
  })
  if (!user) {
    return '';
  }
  return user.companyId ?? '';
}