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
        <h1>{t("invoices")}</h1>
      </div>
      {/* single-column table for small screens */}
      <table className="w-full table-fixed min-w-full inset-0 md:hidden">
        <tbody className="w-screen min-w-full">
          <InvoiceList companies={companies} layout="single"/>
        </tbody>
      </table>
      {/* multi-column table for medium and larger screens */}
      <table className="w-full table-fixed min-w-full absolute inset-0 invisible md:static md:visible">
        <thead className="bg-slate-250 dark:bg-slate-700">
          <tr>
            { admin && <th className="w-1/12"></th> }
            { admin && <th className="w-2/12">Id</th> }
            <th className="w-1/12">{t("number")}</th>
            <th className="w-1/12">{t("date")}</th>
            { admin && <th className="w-3/12">{t("company_name")}</th> }
            <th className="w-1/12">{t("amount")}</th>
            <th className="w-2/12">{t("payment")}</th>
            <th className="w-1/12">{t("paid")}</th>
          </tr>
        </thead>
        <tbody>
          <InvoiceList companies={companies} layout="multi"/>
        </tbody>
      </table>
      { admin &&
        <div className="mt-4 w-4/12">
          <NewInvoice companies={companies}/>
        </div>
      }
    </div>
  );
}