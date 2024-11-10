// app/[locale]/admin/company/list/page.tsx

import { getTranslations } from "next-intl/server";
import { isAdmin, isAuthenticated } from "@/actions/user";
import CompanyList from '@/app/components/company/list';
import NewCompany from '@/app/components/company/new';

export default async function Page() {
  const t = await getTranslations("ui");
  const admin: boolean = await isAdmin();
  const authenticated: boolean = await isAuthenticated();
  if (!authenticated || !admin) {
    return null;
  }
  return (
    <div>
      <div className="py-6">
        <h1 className="text-2xl text-bold">{t("companies")}</h1>
      </div>
      <table className="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
        <thead className="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th className="w-1/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">
            </th>
            <th className="w-2/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              Id
            </th>
            <th className="w-1/2 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              {t("company_name")}
            </th>
            <th className="w-1/4 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              {t("package_price")}
            </th>
          </tr>
        </thead>
        <tbody>
          <CompanyList />
        </tbody>
      </table>
      <NewCompany />
    </div>
  );
}