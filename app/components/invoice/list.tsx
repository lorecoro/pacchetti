// app/components/invoice/list.tsx

'use server';

import { db } from "@/db";
import { getLocale, getTranslations } from "next-intl/server";
import DeleteButton from "./delete";
import EditButton from "./edit";
import type { CompanyIdName } from "@/actions/company-list";

interface Props {
  companies: CompanyIdName[];
}

export default async function InvoiceList(props: Props) {
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
      companyId: item.companyId,
      amount: item.amount.toNumber(),
      payment: item.payment,
      paid: item.paid
    }
    return (
      <tr key={invoice.id}>
        <td className="border border-slate-300 dark:border-slate-700 p-4 flex justify-around">
          <EditButton invoice={invoice} companies={props.companies}/>
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
          {invoice.amount.toFixed(2)}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {invoice.payment}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {t(invoice.paid ? 'yes' : 'no')}
        </td>
      </tr>
    )
  });

  return renderedList;
}