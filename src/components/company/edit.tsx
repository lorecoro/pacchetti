// src/components/company/edit.tsx

'use client';

import { useFormState } from "react-dom";
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
  const [formState, action] = useFormState(UpdateCompany, { errors: {} });

  const submitButton = (
    <button type="submit">
      <PencilIcon className="w-5" />
    </button>
  );

  return (
    <CompanyForm
      submitButton={submitButton}
      action={action}
      company={props.company}
      errors={formState?.errors}
    />
  )
}