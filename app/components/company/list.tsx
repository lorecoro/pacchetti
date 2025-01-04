// app/components/company/list.tsx

'use client';

import type { Company } from "@prisma/client";
import DeleteButton from "./delete";
import EditButton from "./edit";

interface Props {
  companies: Company[]
}
export default function CompanyList(props: Props) {
  const { companies } = props;

  const renderedList = companies.map((item) => {
    const company = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price.toString()).toFixed(2),
    }
    return (
      <tr key={item.id}>
        <td className="border border-slate-300 dark:border-slate-700 p-4 flex justify-around">
          <EditButton company={company} />
          <DeleteButton id={item.id} />
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {item.id}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {item.name}
        </td>
        <td className="border border-slate-300 dark:border-slate-700 p-4 text-base text-slate-500 dark:text-slate-400 font-semibold">
          {parseFloat(item.price.toString()).toFixed(2)}
        </td>
      </tr>
    )
  });

  return renderedList;
}