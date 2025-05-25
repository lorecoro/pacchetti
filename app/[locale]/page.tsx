// app/[locale]/page.tsx

import { db } from "@/db";
import { getLocale, getTranslations } from "next-intl/server";
import { getUserCompanyId, isAuthenticated } from "@/actions/user";
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

  const content = thePackage ? (
    <div>
      <div className="py-6">
        <h1>{t("dashboard")}</h1>
      </div>
      <div className="py-6 grid grid-cols-1 md:grid-cols-2">
        <h2 className="text-xl font-500 pt-6 border-t-2">{t("current_package")} {thePackage.name}</h2>
        <h2 className="text-xl font-500 py-6 pl-6 border-t-2 border-l-2">{invoiceName}</h2>
      </div>
      <div className="py-6 grid grid-cols-1 md:grid-cols-3">
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
          {entries.map((entry) => {
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
            let totalTime = thePackage.carried;
            const startDate = entry.start.toLocaleString(locale, dateFormatOptions);
            const startTime = entry.start.toLocaleString(locale, timeFormatOptions);
            const endTime = entry.end.toLocaleString(locale, timeFormatOptions);
            const diffMilliseconds = Math.abs(entry.start.getTime() - entry.end.getTime());
            const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
            totalTime += diffMinutes;

            return (
              <tr key={entry.id}>
                <td>{startDate}</td>
                <td>{entry.name}</td>
                <td>{startTime}</td>
                <td>{endTime}</td>
                <td>{diffMinutes} min.</td>
              </tr>
            )
          })}
        </tbody>
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
