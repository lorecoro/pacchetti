// app/[locale]/admin/company/list/page.tsx

"use server";

import { db } from "@/db";
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
  const companiesRaw = (await db.company.findMany({
    orderBy: [{name: 'asc'}]
  }));
  // Transform Decimal fields to string or number
  const companies = companiesRaw.map(company => ({
    ...company,
    price: Number(company.price)
  }));

  return (
    <div>
      <div className="py-6">
        <h1>{t("companies")}</h1>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-1/12"></th>
            <th className="w-2/12">Id</th>
            <th className="w-6/12">{t("company_name")}</th>
            <th className="w-3/12">{t("package_price")}</th>
          </tr>
        </thead>
        <tbody>
          <CompanyList companies={companies}/>
        </tbody>
      </table>
      <NewCompany />
    </div>
  );
}