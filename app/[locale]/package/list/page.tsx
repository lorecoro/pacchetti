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

  const renderedList = packages.map((item) => {
    const onePackagePath = onePackage(item.id);
    return <Row
      key={item.id}
      item={item}
      companies={companies}
      invoices={invoices}
      admin={admin}
      locale={locale}
      onePackagePath={onePackagePath}
    />;
  });

  return (
    <div>
      <div className="py-6">
        <h1>{t("packages")}</h1>
      </div>
      <table className="w-full">
        <thead className="bg-slate-250 dark:bg-slate-700">
          <tr>
            { admin && <th className="w-1/12"></th> }
            <th className="w-2/12">Id</th>
            <th className="w-2/12">{t("name")}</th>
            { admin && <th className="w-4/12">{t("company_name")}</th> }
            <th className="w-3/12">{t("invoice")}</th>
          </tr>
        </thead>
        <tbody>
          {renderedList}
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