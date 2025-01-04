// app/[locale]/package/list/page.tsx

'use server';

import { getTranslations } from "next-intl/server";
import { fetchCompaniesIdName } from "@/actions/company-list";
import { fetchInvoicesIdNumber } from "@/actions/invoice-list";
import { isAdmin, isAuthenticated } from "@/actions/user";
import PackageList from "@/app/components/package/list";
import NewPackage from "@/app/components/package/new";

export default async function Page() {
  const t = await getTranslations("ui");
  const admin: boolean = await isAdmin();
  const authenticated: boolean = await isAuthenticated();
  if (!authenticated) {
    return null;
  }
  const companies = await fetchCompaniesIdName();
  if (!companies) {
    return null;
  }
  const invoices = await fetchInvoicesIdNumber();
  if (!invoices) {
    return null;
  }

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
          <PackageList companies={companies} invoices={invoices}/>
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