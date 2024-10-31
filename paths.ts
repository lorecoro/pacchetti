"use server";

import { getLocale } from "next-intl/server";

const paths = async () => {
  const locale = await getLocale();
  return {
    home() {
      return '/';
    },
    adminCompanies() {
      return {pathname: '/admin/company/list', locale};
    },
    invoices() {
      return '/invoice/list';
    },
    packages() {
      return '/package/list';
    },
    package(name: string) {
      return `/package/${name}`;
    },
    newEntry() {
      return '/entry/new';
    },
    profile() {
      return '/profile';
    }
  }
};

export default paths;