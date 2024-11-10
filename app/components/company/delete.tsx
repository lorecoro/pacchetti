// app/components/company/delete.tsx

'use client';

import DeleteCompany from "@/actions/company-delete";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  id: string;
}

export default function DeleteButton(props: Props) {
  const deleteCompany = (id: string) => DeleteCompany(id);

  return (
    <button onClick={() => deleteCompany(props.id)}>
      <TrashIcon className="w-5" />
    </button>
  )
}