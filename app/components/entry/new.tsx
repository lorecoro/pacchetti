// app/components/entry/new.tsx

'use client';

import { useFormState } from "react-dom";
import { CreateEntry } from "@/actions/entry-create";
import { useTranslations } from "next-intl";
import EntryForm from "./form";
import type { PackageIdName } from "@/actions/package-list";

interface Props {
  packages: PackageIdName[];
}

export default function NewEntry(props: Props) {
  const [formState, action] = useFormState(CreateEntry, { errors: {} });
  const t = useTranslations("ui");
  const caption = t("new_entry");
  const { packages } = props;

  return (
    <EntryForm
      caption={caption}
      icon={false}
      action={action}
      packages={packages}
      errors={formState?.errors}
    />
  )
}