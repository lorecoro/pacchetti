'use client';

import { Button } from "@nextui-org/react";
import { signIn, signOut } from "@/actions/user";
import { useSession } from "next-auth/react";
import { signOut as nextAuthSignOut } from "next-auth/react";

export default function User() {
  const session = useSession();
  let signInOrOut;

  if (session.data?.user) {
    signInOrOut = (
      <div>
        {session.data.user.name || session.data.user.email}<br />
        <form action={ async () => {
          await signIn();
        }}>
          <Button type="submit" color="secondary">Sign out</Button>
        </form>
      </div>
    );
  } else {
    signInOrOut = (
      <div>
        <form action={ async () => {
          await signOut();
          await nextAuthSignOut({ redirect: false });
        }}>
          <Button type="submit" color="secondary">Sign in</Button>
        </form>
      </div>
    );
  }

  return signInOrOut;
}