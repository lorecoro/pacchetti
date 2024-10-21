// src/components/company/list.tsx

'use server';

import { db } from "@/db";
import DeleteButton from "../common/delete-button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default async function CompanyList() {
  const list = (await db.company.findMany({
    orderBy: [{name: 'asc'}]
  }));

  const renderedList = list.map((item) => {
    return (
      <tr key={item.id}>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400 flex justify-around">
          <PencilIcon className="w-5" />
          <DeleteButton id={item.id} />
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
          {item.id}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
          {item.name}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">
          {item.price.toFixed(2)}
        </td>
      </tr>
    )
  });

  return renderedList;
}