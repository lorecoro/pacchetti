// app/components/package/new.tsx

'use client';

import { useFormState } from "react-dom";
import { CreatePackage } from "@/actions/package-create";
import { useTranslations } from "next-intl";
import PackageForm from "./form";
import type { CompanyIdName } from "@/actions/company-list";
import type { InvoiceIdNumber } from "@/actions/invoice-list";

interface Props {
  companies: CompanyIdName[];
  invoices: InvoiceIdNumber[];
}

export default function NewPackage(props: Props) {
  const [formState, action] = useFormState(CreatePackage, { errors: {} });
  const t = useTranslations("ui");
  const caption = t("new_package");
  const { companies, invoices } = props;

  return (
    <PackageForm
      caption={caption}
      icon={false}
      action={action}
      companies={companies}
      invoices={invoices}
      errors={formState?.errors}
    />
  )
}