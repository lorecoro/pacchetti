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
    <div className="w-full border-medium px-4 py-4 rounded-small border-default-400 dark:border-default-100">
      <div className="flex w-full max-w-full items-center">
        <Image src="/packages-logo.png" width={200} height={200} alt="Pacchetti"></Image>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <HomeIcon className="w-6" />
        <Link className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.home()}>Dashboard</Link>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <BuildingOffice2Icon className="w-6" />
        <Link className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.adminCompanies()}>Companies</Link>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <DocumentCurrencyEuroIcon className="w-6" />
        <Link className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.invoices()}>Invoices</Link>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <ArchiveBoxIcon className="w-6" />
        <Link className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.packages()}>Packages</Link>
      </div>

      <div className="flex w-full max-w-full items-center justify-between rounded-lg py-1 px-3 text-zinc-950 dark:text-zinc-400">
        <ClockIcon className="w-6" />
        <Link className="mr-auto text-large font-semibold text-zinc-950 dark:text-zinc-400 p-4" href={paths.newEntry()}>New Entry</Link>
      </div>

      <User />
  </div>
  );
}