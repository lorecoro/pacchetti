// app/components/package/delete.tsx

'use client';

import DeletePackage from "@/actions/package-delete";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface Props {
  id: string;
}

export default function DeleteButton(props: Props) {
  const t = useTranslations("ui");

  const deletePackage = (id: string) => {
    if (window.confirm(t("delete_confirmation"))) {
      DeletePackage(id);
    }
  }

  return (
    <button onClick={() => deletePackage(props.id)}>
      <TrashIcon className="w-5" />
    </button>
  )
}