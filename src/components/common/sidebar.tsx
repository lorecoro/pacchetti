import Image from "next/image";
import Link from "next/link";
import paths from "@/paths";
import User from "@/components/user/user";
import { 
  ArchiveBoxIcon,
  BuildingOffice2Icon,
  ClockIcon,
  DocumentCurrencyEuroIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <div className="w-full max-w-[200px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
      <div className="flex w-full max-w-full items-center justify-between">
        <Image src="/packages-logo.png" width={200} height={200} alt="Pacchetti"></Image>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <HomeIcon className="w-6" />
        <Link className="mr-auto text-base font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.home()}>Dashboard</Link>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <BuildingOffice2Icon className="w-6" />
        <Link className="mr-auto text-base font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.companies()}>Companies</Link>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <DocumentCurrencyEuroIcon className="w-6" />
        <Link className="mr-auto text-base font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.invoices()}>Invoices</Link>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <ArchiveBoxIcon className="w-6" />
        <Link className="mr-auto text-base font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.packages()}>Packages</Link>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <ClockIcon className="w-6" />
        <Link className="mr-auto text-base font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.newEntry()}>New Entry</Link>
      </div>

      <User />
  </div>
  );
}