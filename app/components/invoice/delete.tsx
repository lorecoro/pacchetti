// app/components/invoice/delete.tsx

'use client';

import DeleteInvoice from "@/actions/invoice-delete";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface Props {
  id: string;
}

export default function DeleteButton(props: Props) {
  const t = useTranslations("ui");

  const deleteInvoice = (id: string) => {
    if (window.confirm(t("delete_confirmation"))) {
      DeleteInvoice(id);
    }
  }

  return (
    <button onClick={() => deleteInvoice(props.id)}>
      <TrashIcon className="w-5" />
    </button>
  )
}