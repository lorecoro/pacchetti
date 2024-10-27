'use client';

import { Button } from "@nextui-org/react";
import { logIn, logOut } from "@/actions/user";
import { useSession } from "next-auth/react";
import { signOut as nextAuthSignOut } from "next-auth/react";
import { UserIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

export default function User() {
  const session = useSession();
  let signInOrOut: ReactNode;

  if (session.status === "loading") {
    signInOrOut = null;
  } else if (session.data?.user) {
    signInOrOut = (
      <>
      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <UserIcon className="w-6" />
        <span className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4">
          {session.data.user.name || session.data.user.email}
        </span>
      </div>
      <div className="flex w-full max-w-full items-center justify-center">
        <form action={ async () => {
          await logOut();
          await nextAuthSignOut({ redirect: false });
        }}>
          <Button type="submit" className="bg-zinc-400 text-medium px-6">Sign out</Button>
        </form>
      </div>
      </>
    );
  } else {
    signInOrOut = (
      <div>
        <form action={ async () => {
          await logIn();
        }}>
          <Button type="submit" color="primary">Sign in</Button>
        </form>
      </div>
    );
  }

  return signInOrOut;
}