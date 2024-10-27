'use server';

import { signIn, signOut } from "@/auth"

export async function logIn() {
  console.log('loggin in');
  return signIn();
}

export async function logOut() {
  return signOut();
}