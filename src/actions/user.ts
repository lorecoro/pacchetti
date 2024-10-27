'use server';

import { auth, signIn, signOut } from "@/auth"

export async function logIn() {
  return signIn();
}

export async function logOut() {
  return signOut();
}

export async function isAdmin() {
  const session = await auth();
  return (session?.user?.role === 'ADMIN')
}

export async function isAuthenticated() {
  const session = await auth();
  return (!!session?.user);
}