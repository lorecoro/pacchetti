// app/[locale]/entry/list/page.tsx

'use server';

import EditButton from "@/app/components/entry/edit";
import DeleteButton from "@/app/components/entry/delete";
import { db } from "@/db";
import { getLocale, getTranslations } from "next-intl/server";
import { fetchPackagesIdName } from "@/actions/package-list";
import { getUserCompanyId, isAdmin, isAuthenticated } from "@/actions/user";
import NewEntry from "@/app/components/entry/new";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("ui");
  const admin: boolean = await isAdmin();
  const authenticated: boolean = await isAuthenticated();
  if (!authenticated) {
    return null;
  }

  let entries = [];
  let timeZone = 'Europe/Rome'; // default for customer
  if (admin) {
    entries = (await db.entry.findMany({
      include: { package: true },
      orderBy: [{start: 'desc'}]
    }));
    timeZone = 'Europe/Helsinki';
  }
  else {
    const companyId = await getUserCompanyId();
    entries = (await db.entry.findMany({
      include: { package: true },
      where: {
        package: {
          companyId: companyId
        }
      },
      orderBy: [{start: 'desc'}]
    }));
  }

  const packages = await fetchPackagesIdName();
  if (!packages) {
    return null;
  }

  const renderedList = entries.map((item) => {
    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone,
      year: "numeric",
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }
    const startDate = item.start ? item.start.toLocaleString(locale, formatOptions) : "";
    const endDate = item.end ? item.end.toLocaleString(locale, formatOptions) : "";
    const diffMilliseconds = Math.abs(item.start?.getTime() - item.end?.getTime());
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const theEntry = {
      id: item.id,
      start: startDate,
      end: endDate,
      name: item.name,
      packageId: item.packageId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }

    return (
      <tr key={item.id}>
        { admin &&
        <td className="p-4 flex justify-around">
          <EditButton entry={theEntry} packages={packages}/>
          <DeleteButton id={theEntry.id} />
        </td>
        }
        { admin &&
        <td className="py-8">{item.id}</td>
        }
        <td className="py-8">{startDate}</td>
        <td className="py-8">{endDate}</td>
        <td className="py-8">{diffMinutes} min.</td>
        <td className="py-8">{item.name}</td>
        <td className="py-8">{item.package.name}</td>
      </tr>
    )
  });

  return (
    <div>
      <div className="py-6">
        <h1>{t("entries")}</h1>
      </div>
      { admin &&
        <div className="mt-4 w-4/12">
          <NewEntry packages={packages}/>
        </div>
      }
      <table className="w-full">
        <thead className="bg-slate-250 dark:bg-slate-700">
          <tr>
            { admin && <th className="w-1/12"></th> }
            { admin && <th className="w-2/12">Id</th> }
            <th className="w-1/12">{t("start")}</th>
            <th className="w-1/12">{t("end")}</th>
            <th className="w-1/12">{t("time")}</th>
            <th className="w-4/12">{t("name")}</th>
            <th className="w-2/12">{t("package")}</th>
          </tr>
        </thead>
        <tbody>
          {renderedList}
        </tbody>
      </table>
    </div>
  )
}