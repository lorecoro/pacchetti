// app/components/common/topbar.tsx

"use server";

import Image from "next/image";
import Link from "next/link";
import paths from "@/paths";
import User from "@/app/components/user/user";
import {
  ArchiveBoxIcon,
  DocumentCurrencyEuroIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { isAuthenticated } from "@/actions/user";
import { getTranslations } from "next-intl/server";
import { SessionProvider } from "next-auth/react"

export default async function Topbar() {
  const authenticated: boolean = await isAuthenticated();
  const t = await getTranslations("ui");
  const { home, invoices, packages } = await paths();

  return (
    <SessionProvider>
      <div className="w-full border-medium p-4 grid grid-flow-col grid-cols-2 gap-2">
        <div id="left-col" className="justify-center grid row-span-2">
          <Image src="/packages-logo.png" width={125} height={125} alt={t("packages")} priority className="justify-self-center"></Image>
          <User />
        </div>

        <div id="right-col" className="grid grid-rows-3 gap-4 justify-center">
          {authenticated &&
          <div className="flex w-full items-center justify-center rounded-lg p-2 text-zinc-950 dark:text-zinc-400">
            <HomeIcon className="w-8" />
            <Link
              className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-1"
              href={home()}>{t("dashboard")}
            </Link>
          </div>
          }

          {authenticated &&
          <div className="flex w-full items-center rounded-lg p-2 text-zinc-950 dark:text-zinc-400">
            <DocumentCurrencyEuroIcon className="w-8" />
            <Link
              className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-1"
              href={invoices()}>{t("invoices")}
            </Link>
          </div>
          }

          {authenticated &&
          <div className="flex w-full items-center justify-center rounded-lg p-2 text-zinc-950 dark:text-zinc-400">
            <ArchiveBoxIcon className="w-8" />
            <Link
              className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-1"
              href={packages()}>{t("packages")}
            </Link>
          </div>
          }

        </div>
      </div>
    </SessionProvider>
  );
}