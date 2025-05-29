// app/[locale]/page.tsx

'use server';

import { db } from "@/db";
import { getLocale, getTranslations } from "next-intl/server";
import { getUserCompanyId, isAuthenticated } from "@/actions/user";
import Gauge from "../components/dashboard/gauge";
import Kpi from "../components/dashboard/kpi";
import type { Package } from "@prisma/client";

export default async function Home() {
  const t = await getTranslations("ui");
  const locale = await getLocale();
  const authenticated: boolean = await isAuthenticated();
  if (!authenticated) {
    return (
      <div>
        <div className="py-6">
          <h1>{t("welcome")}</h1>
        </div>
        <div>
          <p>{t("to_use_this_app")}</p>
          <p>{t("please_sign_in")}</p>
        </div>
      </div>
    );
  }

  const companyId = await getUserCompanyId();
  const thePackage: Package | null = await db.package.findFirst({
    where: { companyId: companyId },
    orderBy: [{ name: 'desc' }],
    include: {
      entries: true
    }
  });
  const invoice = thePackage ? await db.invoice.findFirst({
    where: { id: thePackage.invoiceId ?? undefined },
  }) : null;
  const invoiceName = invoice
    ? t('invoice') + ' ' + t('nr') + ' ' + invoice.number + ' - ' + invoice.date.toLocaleDateString(locale, {year: 'numeric', month: '2-digit', day: '2-digit'})
    : null;
  const entries = thePackage ? await db.entry.findMany({
    where: { packageId: thePackage.id },
    orderBy: [{ start: 'asc' }],
  }) : [];
  let totalTime = thePackage ? thePackage.carried : 0;
  const timeZone = 'Europe/Rome';
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    year: "numeric",
    month: '2-digit',
    day: '2-digit',
  };
  const timeFormatOptions: Intl.DateTimeFormatOptions = {
    timeZone,
    hour: '2-digit',
    minute: '2-digit'
  }
  const rows = entries.map((entry) => {
    const startDate = entry.start.toLocaleString(locale, dateFormatOptions);
    const startTime = entry.start.toLocaleString(locale, timeFormatOptions);
    const endTime = entry.end.toLocaleString(locale, timeFormatOptions);
    const diffMilliseconds = Math.abs(entry.start.getTime() - entry.end.getTime());
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    totalTime += diffMinutes;
    return {
      id: entry.id,
      startDate,
      startTime,
      endTime,
      name: entry.name,
      diffMinutes
    }
  });

  const content = thePackage ? (
    <div>
      <div className="py-6">
        <h1>{t("dashboard")}</h1>
      </div>
      <div className="py-6 grid grid-cols-1 md:grid-cols-2">
        <h2 className="text-xl font-500 pt-6 border-t-2 border-slate-400">{t("current_package")} {thePackage.name}</h2>
        <h2 className="text-xl font-500 py-6 pl-6 border-t-2 border-l-2 border-slate-400">{invoiceName}</h2>
      </div>
      <div className="py-6 grid grid-cols-1 md:grid-cols-3 divide-x-3 divide-slate-400 gap-6">
        <Gauge value={240 - totalTime} />
        <Kpi
          label={t("used")}
          percentage={Math.round((totalTime / 240) * 100)}
          value={totalTime}
        />
        <Kpi
          label={t("available")}
          percentage={Math.round(((240 - totalTime) / 240) * 100)}
          value={240 - totalTime}
        />
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-700">
            <th className="w-2/12">{t("date")}</th>
            <th className="w-4/12">{t("description")}</th>
            <th className="w-2/12">{t("start")}</th>
            <th className="w-2/12">{t("end")}</th>
            <th className="w-2/12">{t("time")}</th>
          </tr>
        </thead>
        <tbody>
          {thePackage.carried > 0 && (
          <tr key={thePackage.id} className="border-b border-gray-300 dark:border-gray-700 bg-cyan-100 pb-2">
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>{thePackage.carried} min.</td>
            <td>{t("amount_carried_forward")}</td>
          </tr>
          )}
          {rows.map((row) => {
            return (
              <tr key={row.id}>
                <td>{row.startDate}</td>
                <td>{row.name}</td>
                <td>{row.startTime}</td>
                <td>{row.endTime}</td>
                <td>{row.diffMinutes} min.</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="bg-slate-250 dark:bg-slate-700">
          <tr className="bg-cyan-100 border-t-3">
            <th className="w-2/12"></th>
            <th className="w-4/12 text-black">{t("total_time_used")}</th>
            <th className="w-2/12"></th>
            <th className="w-2/12"></th>
            <th className="w-2/12 text-black">{totalTime} min.</th>
          </tr>
        </tfoot>
      </table>
    </div>
  ) : (
    <div>
      <div className="py-6">
        <h1>{t("dashboard")}</h1>
      </div>
      <hr />
      <div className="py-6">
        <h2>{t("no_package")}</h2>
      </div>
    </div>
  );

  return content;
}
