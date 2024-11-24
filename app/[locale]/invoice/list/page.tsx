// app/[locale]/invoice/list/page.tsx

'use server';

import { getTranslations } from "next-intl/server";
import { fetchCompaniesIdName } from "@/actions/company-list";
import { isAdmin, isAuthenticated } from "@/actions/user";
import InvoiceList from "@/app/components/invoice/list";
import NewInvoice from "@/app/components/invoice/new";

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

  return (
    <div>
      <div className="py-6">
        <h2 className="text-2xl text-bold">{t("invoices")}</h2>
      </div>
      <table className="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
        <thead className="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th className="w-1/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">
            </th>
            <th className="w-2/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              Id
            </th>
            <th className="w-1/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              {t("number")}
            </th>
            <th className="w-1/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              {t("date")}
            </th>
            <th className="w-3/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              {t("company_name")}
            </th>
            <th className="w-2/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              {t("amount")}
            </th>
            <th className="w-2/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              {t("payment")}
            </th>
            <th className="w-1/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              {t("paid")}
            </th>
          </tr>
        </thead>
        <tbody>
          <InvoiceList />
        </tbody>
      </table>
      <div className="mt-4 w-4/12">
        <NewInvoice companies={companies}/>
      </div>
    </div>
  );
}