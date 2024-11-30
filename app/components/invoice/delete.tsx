// app/components/invoice/delete.tsx

'use client';

import DeleteInvoice from "@/actions/invoice-delete";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  id: string;
}

export default function DeleteButton(props: Props) {
  const deleteInvoice = (id: string) => DeleteInvoice(id);

  return (
    <button onClick={() => deleteInvoice(props.id)}>
      <TrashIcon className="w-5" />
    </button>
  )
}