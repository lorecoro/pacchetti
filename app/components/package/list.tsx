// app/components/package/list.tsx

'use server';

import { db } from "@/db";
import { getLocale, getTranslations } from "next-intl/server";
import { getUserCompanyId, isAdmin } from "@/actions/user";
import DeleteButton from "./delete";
import EditButton from "./edit";
import type { Package } from "@prisma/client";
import type { CompanyIdName } from "@/actions/company-list";
import type { InvoiceIdNumber } from "@/actions/invoice-list";

interface Props {
  companies: CompanyIdName[];
  invoices: InvoiceIdNumber[];
}

export default async function PackageList(props: Props) {
  const locale = await getLocale();
  const t = await getTranslations("ui");
  const admin: boolean = await isAdmin();

  let list = [];
  if (admin) {
    list = (await db.package.findMany({
      include: { company: true, invoice: true },
      orderBy: [{name: 'desc'}]
    }));
  }
  else {
    const companyId = await getUserCompanyId();
    list = (await db.package.findMany({
      include: { company: true, invoice: true },
      where: { companyId: companyId },
      orderBy: [{name: 'desc'}]
    }));
  }

  const renderedList = list.map((item) => {
    const thePackage: Package = {
      id: item.id,
      name: item.name,
      companyId: item.companyId,
      invoiceId: item.invoiceId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
      // entries: item.entries
    }

    return (
      <tr key={item.id}>
        { admin &&
        <td className="p-4 flex justify-around">
          <EditButton package={thePackage} invoices={props.invoices} companies={props.companies}/>
          <DeleteButton id={item.id} />
        </td>
        }
        <td className="py-8">
          {item.id}
        </td>
        <td className="py-8">
          {item.name}
        </td>
        { admin &&
          <td className="py-8">
            {item.company.name}
          </td>
        }
        { item.invoice &&
          <td className="py-8">
            {t('invoice')} {t('nr')} {item.invoice.number} - {item.invoice.date.toLocaleDateString(locale, {year: 'numeric', month: '2-digit', day: '2-digit'})}
          </td>
        }
      </tr>
    )
  });

  return renderedList;
}