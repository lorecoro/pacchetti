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
  const timeZone = 'Europe/Rome';

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
  totalTime += entries.reduce((acc, item) => {
    const diffMilliseconds = Math.abs(item.start.getTime() - item.end.getTime());
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    return acc + diffMinutes;
  }, 0);

  const renderedList = (layout: 'single' | 'multi') => entries.map((item) => {
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

    if (layout === 'multi') {
      return (
        <tr key={item.id}>
          <td className="py-8">{startDate}</td>
          <td className="py-8">{endDate}</td>
          <td className="py-8">{diffMinutes} min.</td>
          <td className="py-8">{item.name}</td>
        </tr>
      )
    } else {
      return (
        <tr key={item.id}>
          <td className="py-4">
            <p className="font-semibold">{t("start")}:&nbsp;&nbsp;{startDate}</p>
            <p className="font-semibold">{t("end")}:&nbsp;&nbsp;{endDate}</p>
            <p className="font-semibold">{t("time")}:&nbsp;&nbsp;{diffMinutes} min.</p>
            <p className="font-semibold">{t("name")}:&nbsp;&nbsp;{item.name}</p>
          </td>
        </tr>
      )
    }
  });

  return (
    <div>
      <div className="py-6">
        <h1>{t("package")} {thePackage.name}</h1>
      </div>
      {/* single-column table for small screens */}
      <table className="w-full table-fixed min-w-full inset-0 md:hidden">
        <tbody>
          {/* top line with carried forward */}
          <tr>
            <td className="bg-cyan-100 pl-4 mb-4">
              <p>
                <span className="text-black dark:text-slate-700 font-semibold">{t("amount_carried_forward")}:&nbsp;&nbsp;</span>
                {thePackage.carried} min.
              </p>
            </td>
          </tr>
          {/* entries */}
          {renderedList('single')}
          {/* totals line */}
          <tr>
            <td className="bg-cyan-100 pl-4 mb-4">
              <p>
                <span className="text-black dark:text-slate-700 font-semibold">{t("total_time_used")}:&nbsp;&nbsp;</span>
                {totalTime} min.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      {/* multi-column table for medium and larger screens */}
      <table className="w-full table-fixed min-w-full absolute inset-0 invisible md:static md:visible">
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
          {renderedList('multi')}
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