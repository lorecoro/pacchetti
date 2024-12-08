// app/components/invoice/edit.tsx

'use client';

import { useFormState } from "react-dom";
import { PencilIcon } from "@heroicons/react/24/outline";
import { UpdateInvoice } from "@/actions/invoice-update";
import { useTranslations } from "next-intl";
import InvoiceForm from "./form";
import type { CompanyIdName } from "@/actions/company-list";

interface Props {
  invoice: {
    id: string;
    number: string;
    date: string;
    companyId: string;
    amount: number;
    payment: string;
    paid: boolean;
  };
  companies: CompanyIdName[];
}

export default function EditButton(props: Props) {
  const [formState, action] = useFormState(UpdateInvoice, { errors: {} });
  const t = useTranslations("ui");
  const caption = t("edit_invoice");

  return (
    <InvoiceForm
      caption={caption}
      action={action}
      invoice={props.invoice}
      companies={props.companies}
      errors={formState?.errors}
    />
  )
}