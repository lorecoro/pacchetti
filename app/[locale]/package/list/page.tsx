// app/[locale]/package/list/page.tsx

'use server';

import Row from "./row";
import NewPackage from "@/app/components/package/new";
import paths from "@/paths";
import { db } from "@/db";
import { getLocale, getTranslations } from "next-intl/server";
import { fetchCompaniesIdName } from "@/actions/company-list";
import { fetchInvoicesIdNumber } from "@/actions/invoice-list";
import { getUserCompanyId, isAdmin, isAuthenticated } from "@/actions/user";

export type itemFromQuery = {
    company: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        price: number;
    };
    invoice: {
        number: string;
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        amount: number;
        payment: string;
        paid: boolean;
    } | null;
    entries: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        start: Date;
        end: Date;
        packageId: string;
    }[];
} & {
    name: string;
    id: string;
    companyId: string;
    invoiceId: string | null;
    carried: number;
    createdAt: Date;
    updatedAt: Date;
};

export type entryFromQuery = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  start: Date;
  end: Date;
  packageId: string;
};

export type itemForClient = {
  id: string;
  name: string;
  carried: number;
  entries?: entryFromQuery[];
  invoiceName: string | null;
  companyName: string | null;
};

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("ui");
  const admin: boolean = await isAdmin();
  const authenticated: boolean = await isAuthenticated();
  if (!authenticated) {
    return null;
  }

  let packages = [];
  if (admin) {
    packages = (await db.package.findMany({
      include: { company: true, invoice: true, entries: true },
      orderBy: [{name: 'desc'}]
    }));
  }
  else {
    const companyId = await getUserCompanyId();
    packages = (await db.package.findMany({
      include: { company: true, invoice: true, entries: true },
      where: { companyId: companyId },
      orderBy: [{name: 'desc'}]
    }));
  }

  const companies = await fetchCompaniesIdName();
  if (!companies) {
    return null;
  }
  const invoices = await fetchInvoicesIdNumber();
  if (!invoices) {
    return null;
  }

  const { onePackage } = await paths();

  const renderedList = (layout: 'single' | 'multi') => packages.map((item) => {
    const onePackagePath = onePackage(item.id);
    const invoiceName = item.invoice
      ? t('invoice') + ' ' + t('nr') + ' ' + item.invoice.number + ' - ' + item.invoice.date.toLocaleDateString(locale, {year: 'numeric', month: '2-digit', day: '2-digit'})
      : null;
    const clientItem: itemForClient = {
      id: item.id,
      name: item.name,
      carried: item.carried ?? 0,
      entries: item.entries,
      invoiceName: invoiceName,
      companyName: item.company ? item.company.name : null
    };
    const parsedItem: itemFromQuery = JSON.parse(JSON.stringify(item));
    return <Row
      key={item.id}
      item={parsedItem}
      clientItem={clientItem}
      companies={companies}
      invoices={invoices}
      admin={admin}
      locale={locale}
      onePackagePath={onePackagePath}
      layout={layout}
    />;
  });

  return (
    <div>
      <div className="py-6">
        <h1>{t("packages")}</h1>
      </div>
      {/* single-column table for small screens */}
      <table className="w-full table-fixed min-w-full inset-0 md:hidden">
        {renderedList('single')}
      </table>
      {/* multi-column table for medium and larger screens */}
      <table className="w-full table-fixed min-w-full absolute inset-0 invisible md:static md:visible">
        <thead className="bg-slate-250 dark:bg-slate-700">
          <tr>
            { admin && <th className="w-1/12"></th> }
            { admin && <th className="w-2/12">Id</th> }
            <th className="w-2/12">{t("name")}</th>
            { admin && <th className="w-4/12">{t("company_name")}</th> }
            <th className="w-3/12">{t("invoice")}</th>
          </tr>
        </thead>
        <tbody>
          {renderedList('multi')}
        </tbody>
      </table>
      { admin &&
        <div className="mt-4 w-4/12">
          <NewPackage companies={companies} invoices={invoices}/>
        </div>
      }
    </div>
  )
}