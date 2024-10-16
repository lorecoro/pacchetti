'use server';

import { db } from "@/db";

export default async function CompanyList() {
  const list = await db.company.findMany();
  const renderedList = list.map((item) => {
    return (
      <tr key={item.id}>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{item.id}</td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{item.name}</td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{item.price.toFixed(2)}</td>
      </tr>
    )
  });

  return renderedList;
}