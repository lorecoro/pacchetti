// app/[locale]/package/list/row.tsx

'use client';

import React, { useState } from 'react'
import EditButton from "@/app/components/package/edit";
import DeleteButton from "@/app/components/package/delete";
import DetailsButton from "@/app/components/package/details";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Package } from "@prisma/client";

interface Props {
  item: any;
  companies: { id: string; name: string }[];
  invoices: { id: string; number: string }[];
  admin: boolean;
  locale: string;
  onePackagePath: string;
}

export default function Row(props: Props) {
  const t = useTranslations("ui");
  const { item, companies, invoices, admin, locale, onePackagePath } = props;
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  const invoiceName = item.invoice
    ? t('invoice') + ' ' + t('nr') + ' ' + item.invoice.number + ' - ' + item.invoice.date.toLocaleDateString(locale, {year: 'numeric', month: '2-digit', day: '2-digit'})
    : null;
  const thePackage: Package = {
    name: item.name,
    id: item.id,
    companyId: item.companyId,
    invoiceId: item.invoiceId ?? null,
    carried: item.carried,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  }
  let timeZone = 'Europe/Rome'; // default for customer
  if (admin) {
    timeZone = 'Europe/Helsinki';
  }
  let totalTime = thePackage.carried;

  return (
    <>
    <tr key={item.id}>
      { admin &&
      <td className="p-4 flex justify-around">
        <EditButton package={thePackage} invoices={invoices} companies={companies}/>
        <DeleteButton id={thePackage.id} />
      </td>
      }
      <td className="py-8">{item.id}</td>
      <td className="py-8">
        <Link className="hover:underline" href={onePackagePath}>{item.name}</Link>
        <DetailsButton onClick={toggleVisibility} />
      </td>
      { admin &&
      <td className="py-8">{item.company.name}</td>
      }
      { invoiceName &&
      <td className="py-8">{invoiceName}</td>
      }
    </tr>
    <tr key={item.id+"entries"} className={isVisible ? "visible" : "collapse"}>
      <td colSpan={admin ? 5 : 3} className="p-4">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-700">
            <th className="w-2/12">{t("start")}</th>
            <th className="w-2/12">{t("end")}</th>
            <th className="w-2/12">{t("time")}</th>
            <th className="w-6/12">{t("description")}</th>
          </tr>
        </thead>
        <tbody>
          <tr key={item.id} className="border-b border-gray-300 dark:border-gray-700 bg-cyan-100 pb-2">
            <td>-</td>
            <td>-</td>
            <td>{item.carried} min.</td>
            <td>{t("amount_carried_forward")}</td>
          </tr>

          {item.entries.map((entry: any) => {
            const formatOptions: Intl.DateTimeFormatOptions = {
              timeZone,
              year: "numeric",
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }
            const startDate = entry.start.toLocaleString(locale, formatOptions);
            const endDate = entry.end.toLocaleString(locale, formatOptions);
            const diffMilliseconds = Math.abs(entry.start.getTime() - entry.end.getTime());
            const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
            totalTime += diffMinutes;
            return (
              <tr key={entry.id} className="border-b border-gray-300 dark:border-gray-700 pb-2">
                <td>{startDate}</td>
                <td>{endDate}</td>
                <td>{diffMinutes} min.</td>
                <td>{entry.name}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot className="bg-slate-250 dark:bg-slate-700">
          <tr className="bg-cyan-100 border-t-3">
            <th className="w-2/12"></th>
            <th className="w-2/12"></th>
            <th className="w-2/12 text-black">{totalTime} min.</th>
            <th className="w-6/12 text-black">{t("total_time_used")}</th>
          </tr>
        </tfoot>
      </table>
      </td>
    </tr>
    </>
  )

}