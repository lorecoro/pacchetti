// src/components/common/delete-button.tsx

'use client';

import DeleteCompany from "@/actions/company-delete";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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