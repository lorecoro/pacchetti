// app/components/entry/edit.tsx

'use client';

import { useActionState } from "react";
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
  const { entry, packages } = props;
  const [formState, action] = useActionState(UpdateEntry, { errors: {} });
  const t = useTranslations("ui");
  const caption = t("edit_entry");
  const editButton = (
    <PencilIcon className="w-5"/>
  );

  const theEntry = {
    id: entry.id,
    start: entry.start ? formatISO(parse(entry.start, "dd/MM/yyyy, HH:mm", new Date())) : "",
    end: entry.end ? formatISO(parse(entry.end, "dd/MM/yyyy, HH:mm", new Date())) : "",
    name: entry.name,
    packageId: entry.packageId
  }

  return (
    <EntryForm
      caption={caption}
      icon={editButton}
      action={action}
      packages={packages}
      theEntry={theEntry}
      errors={formState?.errors}
    />
  )
}