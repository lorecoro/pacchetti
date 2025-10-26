// app/components/company/new.tsx

'use client';

import { useActionState } from "react";
import { Button } from "@nextui-org/react";
import { CreateCompany } from "@/actions/company-create";
import { useTranslations } from "next-intl";
import CompanyForm from "./form";

export default function NewCompany() {
  const [formState, action] = useActionState(CreateCompany, { errors: {} });
  const t = useTranslations("ui");

  const submitButton = (
    <Button>{t("new_company")}</Button>
  );

  return (
    <CompanyForm
      submitButton={submitButton}
      action={action}
      errors={formState?.errors}
    />
  )
}