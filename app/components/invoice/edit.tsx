// app/components/invoice/edit.tsx

'use client';

import { useFormState } from "react-dom";
import { PencilIcon } from "@heroicons/react/24/outline";
import { UpdateInvoice } from "@/actions/invoice-update";
import { useTranslations } from "next-intl";
import InvoiceForm from "./form";

interface Props {
  invoice: {
    id: string;
    number: string;
    date: string;
    company: string;
    amount: string;
    payment: string;
    paid: string;
  };
}

export default function EditButton(props: Props) {
  const [formState, action] = useFormState(UpdateInvoice, { errors: {} });
  const t = useTranslations("ui");
  const caption = t("new_invoice");

  return (
    <InvoiceForm
      caption={caption}
      action={action}
      companies={[]}
      errors={formState?.errors}
    />
  )
}