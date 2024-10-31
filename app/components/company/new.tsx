// src/components/company/new.tsx

'use client';

import { useFormState } from "react-dom";
import { Button } from "@nextui-org/react";
import { CreateCompany } from "@/actions/company-create";
import CompanyForm from "./form";

export default function NewCompany() {
  const [formState, action] = useFormState(CreateCompany, { errors: {} });

  const submitButton = (
    <Button>New company</Button>
  );

  return (
    <CompanyForm
      submitButton={submitButton}
      action={action}
      errors={formState?.errors}
    />
  )
}