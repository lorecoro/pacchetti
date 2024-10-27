// src/components/invoice/list.tsx

'use server';

import { db } from "@/db";
// import DeleteButton from "./delete";
// import EditButton from "./edit";

export default async function CompanyList() {
  const list = (await db.invoice.findMany({
    orderBy: [{date: 'desc', number: 'desc'}]
  }));

  const renderedList = list.map((item) => {
    const invoice = {
      id: item.id,
      number: item.number,
      date: item.date,
      companu: item.date,
      amount: item.amount.toFixed(2),
    }
    return (
      <tr key={item.id}>
        <td className="border border-slate-300 dark:border-slate-700 p-4 flex justify-around">
          {/* <EditButton company={company} />
          <DeleteButton id={item.id} /> */}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {item.id}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {item.name}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {item.price.toFixed(2)}
        </td>
      </tr>
    )
  });

  return renderedList;
}