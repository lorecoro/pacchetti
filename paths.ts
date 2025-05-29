"use server";

import { getLocale } from "next-intl/server";

const paths = async () => {
  const locale = await getLocale();
  const prefix = locale.split('-')[0];
  return {
    home() {
      return '/';
    },
    adminCompanies() {
      return `/${prefix}/admin/company/list`;
    },
    invoices() {
      return `/${prefix}/invoice/list`;
    },
    packages() {
      return '/package/list';
    },
    onePackage(id: string) {
      return `/package/${id}`;
    },
    entries() {
      return '/entry/list';
    },
    profile() {
      return '/profile';
    }
  }
};

export default paths;