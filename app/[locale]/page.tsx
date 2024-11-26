// app/[locale]/page.tsx

import { getTranslations } from "next-intl/server";
import { isAdmin, isAuthenticated } from "@/actions/user";

export default async function Home() {
  const t = await getTranslations("ui");
  const admin: boolean = await isAdmin();
  const authenticated: boolean = await isAuthenticated();

  const content = authenticated ? (
    <div>
      <div className="py-6">
        <h1>{t("dashboard")} {admin ?? "Admin"}</h1>
      </div>
    </div>
  ) : (
    <div>
      <div className="py-6">
        <h1>{t("welcome")}</h1>
      </div>
      <div>
        <p>{t("to_use_this_app")}</p>
        <p>{t("please_sign_in")}</p>
      </div>
    </div>
  );

  return content;
}
