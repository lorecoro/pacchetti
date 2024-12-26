// app/components/invoice/list.tsx

'use server';

import { db } from "@/db";
import { getLocale, getTranslations } from "next-intl/server";
import { getUserCompanyId, isAdmin } from "@/actions/user";
import DeleteButton from "./delete";
import EditButton from "./edit";
import type { CompanyIdName } from "@/actions/company-list";

interface Props {
  companies: CompanyIdName[];
}

export default async function InvoiceList(props: Props) {
  const locale = await getLocale();
  const t = await getTranslations("ui");
  const admin: boolean = await isAdmin();

  let list = [];
  if (admin) {
    list = (await db.invoice.findMany({
      include: { company: true },
      orderBy: [{date: 'desc'}, {number: 'desc'}]
    }));
  }
  else {
    const companyId = await getUserCompanyId();
    list = (await db.invoice.findMany({
      include: { company: true },
      where: { companyId: companyId },
      orderBy: [{date: 'desc'}, {number: 'desc'}]
    }));
  }

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
        { admin &&
        <td className="p-4 flex justify-around">
          <EditButton invoice={invoice} companies={props.companies}/>
          <DeleteButton id={item.id} />
        </td>
        }
        <td className="py-8">
          {invoice.id}
        </td>
        <td className="py-8">
          {invoice.number}
        </td>
        <td className="py-8">
          {invoice.date}
        </td>
        { admin &&
          <td className="py-8">
            {invoice.company}
          </td>
        }
        <td className="py-8">
          {invoice.amount.toFixed(2)}
        </td>
        <td className="py-8">
          {t(invoice.payment)}
        </td>
        <td className="py-8">
          {t(invoice.paid ? 'yes' : 'no')}
        </td>
      </tr>
    )
  });

  return renderedList;
}