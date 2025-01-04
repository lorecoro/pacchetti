// app/components/package/edit.tsx

'use client';

import { useFormState } from "react-dom";
import { PencilIcon } from "@heroicons/react/24/outline";
import { UpdatePackage } from "@/actions/package-update";
import { useTranslations } from "next-intl";
import PackageForm from "./form";
import type { CompanyIdName } from "@/actions/company-list";
import type { InvoiceIdNumber } from "@/actions/invoice-list";
import type { Package } from "@prisma/client";

interface Props {
  package: Package;
  companies: CompanyIdName[];
  invoices: InvoiceIdNumber[];
}

export default function EditButton(props: Props) {
  const [formState, action] = useFormState(UpdatePackage, { errors: {} });
  const t = useTranslations("ui");
  const caption = t("edit_package");
  const editButton = (
    <button type="submit" className="align-middle">
      <PencilIcon className="w-5 text-black"/>
    </button>
  );

  return (
    <PackageForm
      caption={caption}
      icon={editButton}
      action={action}
      companies={props.companies}
      invoices={props.invoices}
      thePackage={props.package}
      errors={formState?.errors}
    />
  )
}