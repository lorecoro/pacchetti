// app/components/entry/edit.tsx

'use client';

import { useFormState } from "react-dom";
import { PencilIcon } from "@heroicons/react/24/outline";
import { UpdateEntry } from "@/actions/entry-update";
import { useTranslations } from "next-intl";
import { parse, formatISO } from 'date-fns';
import EntryForm from "./form";
import type { PackageIdName } from "@/actions/package-list";

interface Props {
  entry: {
    id: string;
    start: string;
    end: string;
    name: string;
    packageId: string;
  };
  packages: PackageIdName[];
}

export default function EditButton(props: Props) {
  const [formState, action] = useFormState(UpdateEntry, { errors: {} });
  const t = useTranslations("ui");
  const caption = t("edit_entry");
  const editButton = (
    <button type="submit" className="align-middle">
      <PencilIcon className="w-5"/>
    </button>
  );

  const theEntry = {
    id: props.entry.id,
    start: formatISO(parse(props.entry.start, "dd/MM/yyyy, HH:mm", new Date())),
    end: formatISO(parse(props.entry.end, "dd/MM/yyyy, HH:mm", new Date())),
    name: props.entry.name,
    packageId: props.entry.packageId
  }

  return (
    <EntryForm
      caption={caption}
      icon={editButton}
      action={action}
      packages={props.packages}
      theEntry={theEntry}
      errors={formState?.errors}
    />
  )
}