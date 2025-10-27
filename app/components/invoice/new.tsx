// app/components/invoice/new.tsx

'use client';

import { useActionState } from "react";
import { CreateInvoice } from "@/actions/invoice-create";
import { useTranslations } from "next-intl";
import InvoiceForm from "./form";
import type { CompanyIdName } from "@/actions/company-list";

interface Props {
  companies: CompanyIdName[];
}

export default function NewInvoice(props: Props) {
  const [formState, action] = useActionState(CreateInvoice, { errors: {} });
  const t = useTranslations("ui");
  const caption = t("new_invoice");
  const { companies } = props;

  return (
    <InvoiceForm
      caption={caption}
      icon={false}
      action={action}
      companies={companies}
      errors={formState?.errors}
    />
  )
}