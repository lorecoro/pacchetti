'use client';

import { Button } from "@nextui-org/react";
import { logIn, logOut } from "@/actions/user";
import { useSession } from "next-auth/react";
import { signOut as nextAuthSignOut } from "next-auth/react";

export default function User() {
  const session = useSession();
  let signInOrOut;

  if (session.status === "loading") {
    signInOrOut = null;
  } else if (session.data?.user) {
    signInOrOut = (
      <div>
        {session.data.user.name || session.data.user.email}<br />
        {session.data.user.role}<br />
        <form action={ async () => {
          await logOut();
          await nextAuthSignOut({ redirect: false });
        }}>
          <Button type="submit" color="secondary">Sign out</Button>
        </form>
      </div>
    );
  } else {
    signInOrOut = (
      <div>
        <form action={ async () => {
          await logIn();
        }}>
          <Button type="submit" color="secondary">Sign in</Button>
        </form>
      </div>
    );
  }

  return signInOrOut;
}