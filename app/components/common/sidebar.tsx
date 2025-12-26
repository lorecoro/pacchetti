// app/components/common/sidebar.tsx

"use server";

import Image from "next/image";
import Link from "next/link";
import paths from "@/paths";
import User from "@/app/components/user/user";
import { 
  ArchiveBoxIcon,
  BuildingOffice2Icon,
  ClockIcon,
  DocumentCurrencyEuroIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { isAdmin, isAuthenticated } from "@/actions/user";
import { getTranslations } from "next-intl/server";

export default async function Sidebar() {
  const admin: boolean = await isAdmin();
  const authenticated: boolean = await isAuthenticated();
  const t = await getTranslations("ui");
  const { home, adminCompanies, invoices, packages, entries } = await paths();

  return (
    <div className="w-full border-medium px-4 py-4 rounded-small border-default-400 dark:border-default-100 mx-auto">
      <div className="flex w-full max-w-full justify-center mx-auto">
        <Image src="/packages-logo.png" width={200} height={200} alt={t("packages")} priority></Image>
      </div>

      {authenticated &&
      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <HomeIcon className="w-6" />
        <Link
          className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4"
          href={home()}>{t("dashboard")}
        </Link>
      </div>
      }

      {admin &&
      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <BuildingOffice2Icon className="w-6" />
        <Link
          className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4"
          href={adminCompanies()}>{t("companies")}
        </Link>
      </div>
      }

      {authenticated &&
      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <DocumentCurrencyEuroIcon className="w-6" />
        <Link
          className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4"
          href={invoices()}>{t("invoices")}
        </Link>
      </div>
      }

      {authenticated &&
      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <ArchiveBoxIcon className="w-6" />
        <Link
          className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4"
          href={packages()}>{t("packages")}
        </Link>
      </div>
      }

      {admin &&
      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <ClockIcon className="w-6" />
        <Link
          className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4"
          href={entries()}>{t("entries")}
        </Link>
      </div>
      }

      <User />
      <div className="h-6 text-right text-gray-400 text-sm">v. 25.12.26</div>
    </div>
  );
}