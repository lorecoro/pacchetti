// app/[locale]/package/list/row.tsx

'use client';

import React, { useState } from 'react'
import EditButton from "@/app/components/package/edit";
import DeleteButton from "@/app/components/package/delete";
import DetailsButton from "@/app/components/package/details";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Package } from "@prisma/client";
import type { entryFromQuery, itemFromQuery, itemForClient } from './page';

interface Props {
  item: itemFromQuery;
  clientItem: itemForClient;
  companies: { id: string; name: string }[];
  invoices: { id: string; number: string }[];
  admin: boolean;
  locale: string;
  onePackagePath: string;
  layout: 'single' | 'multi';
}

export default function Row(props: Props) {
  const t = useTranslations("ui");
  const { item, clientItem, companies, invoices, admin, locale, onePackagePath, layout } = props;
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  const thePackage: Package = {
    name: clientItem.name,
    id: clientItem.id,
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
  let totalTime = thePackage?.carried ?? 0;

  const entryRows = (layout: 'single' | 'multi') => {
    return clientItem.entries?.map((entry: entryFromQuery) => {
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
      if (layout === 'multi') {
        {/* multi-column table for medium and larger screens and admin*/}
        return (
          <tr key={entry.id} className="border-b border-gray-300 dark:border-gray-700 pb-2">
            <td>{startDate}</td>
            <td>{endDate}</td>
            <td>{diffMinutes} min.</td>
            <td>{entry.name}</td>
          </tr>
        )
      } else {
        {/* single-column table for small screens, no admin */}
        return (
          <tr key={entry.id} className={`pl-4 mb-4 ${isVisible ? 'visible' : 'collapse'}`}>
            <td>
              <p>
                <span className="text-black dark:text-slate-700 font-semibold">{t("start")}:&nbsp;&nbsp;</span>
                {startDate}
              </p>
              <p>
                <span className="text-black dark:text-slate-700 font-semibold">{t("end")}:&nbsp;&nbsp;</span>
                {endDate}
              </p>
              <p>
                <span className="text-black dark:text-slate-700 font-semibold">{t("time")}:&nbsp;&nbsp;</span>
                {diffMinutes} min.
              </p>
              <p>
                <span className="text-black dark:text-slate-700 font-semibold">{t("description")}:&nbsp;&nbsp;</span>
                {entry.name}
              </p>
            </td>
          </tr>
        )
      }
    });
  }

  if (layout === 'multi') {
    {/* multi-column table for medium and larger screens and admin*/}
    return (
      <>
      <tr key={clientItem.id}>
        { admin &&
        <td className="p-4 flex justify-around">
          <EditButton package={thePackage} invoices={invoices} companies={companies}/>
          <DeleteButton id={thePackage.id} />
        </td>
        }
        { admin &&
        <td className="py-8">{clientItem.id}</td>
        }
        <td className="py-8">
          <Link className="hover:underline" href={onePackagePath}>{clientItem.name}</Link>
          <DetailsButton onClick={toggleVisibility} />
        </td>
        { admin &&
        <td className="py-8">{clientItem.companyName}</td>
        }
        { clientItem.invoiceName &&
        <td className="py-8">{clientItem.invoiceName}</td>
        }
      </tr>
      <tr key={clientItem.id+"entries"} className={isVisible ? "visible" : "collapse"}>
        <td colSpan={admin ? 5 : 2} className="p-4">
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
            {/* top line with carried forward */}
            <tr key={clientItem.id} className="border-b border-gray-300 dark:border-gray-700 bg-cyan-100 pb-2">
              <td>-</td>
              <td>-</td>
              <td>{clientItem.carried} min.</td>
              <td>{t("amount_carried_forward")}</td>
            </tr>
            {/* entries */}
            {entryRows('multi')}
          </tbody>
          {/* totals line */}
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
  } else {
    {/* single-column table for small screens, no admin */}
    return (
      <tbody className="w-screen min-w-full">
        <tr key={clientItem.id}>
          <td>
            <p>
              <span className="text-black dark:text-slate-700 font-semibold">{t("name")}:&nbsp;&nbsp;</span>
              <Link className="hover:underline" href={onePackagePath}>{clientItem.name}</Link>
              <DetailsButton onClick={toggleVisibility} />
            </p>
            { clientItem.invoiceName &&
            <p>
              <span className="text-black dark:text-slate-700 font-semibold">{t("invoice")}:&nbsp;&nbsp;</span>
              {clientItem.invoiceName}
            </p>
            }
          </td>
        </tr>
        {/* top line with carried forward */}
        <tr key={clientItem.id+"entries"} className={isVisible ? 'visible' : 'collapse'}>
          <td className="bg-cyan-100 pl-4 mb-4">
            <p>
              <span className="text-black dark:text-slate-700 font-semibold">{t("amount_carried_forward")}:&nbsp;&nbsp;</span>
              {clientItem.carried} min.
            </p>
          </td>
        </tr>
        {/* entries */}
        {entryRows('single')}
        {/* totals line */}
        <tr className={isVisible ? 'visible' : 'collapse'}>
          <td className="bg-cyan-100 pl-4 mb-4">
            <p>
              <span className="text-black dark:text-slate-700 font-semibold">{t("total_time_used")}:&nbsp;&nbsp;</span>
              {totalTime} min.
            </p>
          </td>
        </tr>
      </tbody>
    )
  }
}