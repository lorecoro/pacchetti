// app/components/entry/delete.tsx

'use client';

import DeleteEntry from "@/actions/entry-delete";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface Props {
  id: string;
}

export default function DeleteButton(props: Props) {
  const t = useTranslations("ui");

  const deleteEntry = (id: string) => {
    if (window.confirm(t("delete_confirmation"))) {
      DeleteEntry(id);
    }
  }

  return (
    <button onClick={() => deleteEntry(props.id)}>
      <TrashIcon className="w-5" />
    </button>
  )
}