// app/components/company/edit.tsx

'use client';

import { useActionState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { UpdateCompany } from "@/actions/company-update";
import CompanyForm from "./form";

interface Props {
  company: {
    id: string;
    name: string;
    price: string;
  };
}

export default function EditButton(props: Props) {
  const [formState, action] = useActionState(UpdateCompany, { errors: {} });

  const editButton = (
    <PencilIcon className="w-5" />
  );

  return (
    <CompanyForm
      submitButton={editButton}
      action={action}
      company={props.company}
      errors={formState?.errors}
    />
  )
}