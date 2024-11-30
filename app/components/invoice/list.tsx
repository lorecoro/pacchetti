// app/components/invoice/list.tsx

'use server';

import { db } from "@/db";
import { getLocale, getTranslations } from "next-intl/server";
import DeleteButton from "./delete";
import EditButton from "./edit";

export default async function InvoiceList() {
  const locale = await getLocale();
  const t = await getTranslations("ui");

  const list = (await db.invoice.findMany({
    include: { company: true },
    orderBy: [{date: 'desc'}, {number: 'desc'}]
  }));

  const renderedList = list.map((item) => {
    const invoice = {
      id: item.id,
      number: item.number,
      date: item.date.toLocaleDateString(locale, {year: 'numeric', month: '2-digit', day: '2-digit'}),
      company: item.company.name,
      amount: item.amount.toFixed(2),
      payment: item.payment,
      paid: item.paid ? 'yes' : 'no'
    }
    return (
      <tr key={invoice.id}>
        <td className="border border-slate-300 dark:border-slate-700 p-4 flex justify-around">
          <EditButton invoice={invoice} />
          <DeleteButton id={item.id} />
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {invoice.id}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {invoice.number}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {invoice.date}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {invoice.company}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {invoice.amount}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {invoice.payment}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {t(invoice.paid)}
        </td>
      </tr>
    )
  });

  return renderedList;
}