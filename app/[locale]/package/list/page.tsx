// app/[locale]/package/list/page.tsx

'use server';

import { getTranslations } from "next-intl/server";
import { isAdmin, isAuthenticated } from "@/actions/user";
import PackageList from "@/app/components/package/list";
import { Divider } from "@nextui-org/react";

export default async function Page() {
  const t = await getTranslations("ui");
  const admin: boolean = await isAdmin();
  const authenticated: boolean = await isAuthenticated();
  if (!authenticated) {
    return null;
  }

  return (
    <div>
      <div className="py-6">
        <h1>{t("packages")}</h1>
      </div>
      <Divider />
      <PackageList />
    </div>
  )
}