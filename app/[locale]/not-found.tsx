// app/not-found.tsx

'use server';

import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("ui");

  return (
    <div className="py-6">
      <h1>{t('not_found')}</h1>
    </div>
  )
}