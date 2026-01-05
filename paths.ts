"use server";

import { getLocale } from "next-intl/server";

const paths = async () => {
  const locale = await getLocale();
  const prefix = locale.split('-')[0];
  return {
    home: () => '/',
    adminCompanies: () => `/${prefix}/admin/company/list`,
    invoices: () => `/${prefix}/invoice/list`,
    packages: () => '/package/list',
    onePackage: (id: string) => `/package/${id}`,
    entries: () => '/entry/list',
    profile: () => '/profile'
  }
};

export default paths;