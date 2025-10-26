// app/[locale]/package/[id]/page.tsx

'use server';

import { db } from "@/db";
import { getLocale, getTranslations } from "next-intl/server";
import type { Package } from "@prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { id } = params;
  const locale = await getLocale();
  const t = await getTranslations("ui");
  let timeZone = 'Europe/Rome';

  const thePackage: Package | null = await db.package.findUnique({
    where: { id: id }
  });
  if (!thePackage) {
    return notFound();
  }

  const entries = (await db.entry.findMany({
    where: { packageId: thePackage.id },
    orderBy: [{start: 'asc'}]
  }));
  let totalTime = thePackage.carried;

  const renderedList = entries.map((item) => {
    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone,
      year: "numeric",
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
    const startDate = item.start.toLocaleString(locale, formatOptions);
    const endDate = item.end.toLocaleString(locale, formatOptions);
    const diffMilliseconds = Math.abs(item.start.getTime() - item.end.getTime());
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    totalTime += diffMinutes;
  
    return (
      <tr key={item.id}>
        <td className="py-8">{startDate}</td>
        <td className="py-8">{endDate}</td>
        <td className="py-8">{diffMinutes} min.</td>
        <td className="py-8">{item.name}</td>
      </tr>
    )
  });

  return (
    <div>
      <div className="py-6">
        <h1>{t("package")} {thePackage.name}</h1>
      </div>
      <table className="w-full">
        <thead className="bg-slate-250 dark:bg-slate-700">
          <tr>
            <th className="w-2/12">{t("start")}</th>
            <th className="w-2/12">{t("end")}</th>
            <th className="w-2/12">{t("time")}</th>
            <th className="w-6/12">{t("name")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-8">-</td>
            <td className="py-8">-</td>
            <td className="py-8">{thePackage.carried} min.</td>
            <td className="py-8">{t("amount_carried_forward")}</td>
          </tr>
          {renderedList}
        </tbody>
        <tfoot className="bg-slate-250 dark:bg-slate-700">
          <tr className="bg-cyan-100 border-t-4">
            <th className="w-2/12"></th>
            <th className="w-2/12"></th>
            <th className="w-2/12">{totalTime} min.</th>
            <th className="w-6/12"></th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}