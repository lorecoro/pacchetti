// src/components/company/new.tsx

'use client';

import { useFormState } from "react-dom";
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import CreateCompany from "@/actions/company-create";
import ButtonWithSpinner from "@/components/common/button-with-spinner";

export default function NewCompany() {
  const [formState, action] = useFormState(CreateCompany, { errors: {} });

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button>New company</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div>
            <Input
              name="companyName"
              label="Company name"
              labelPlacement="outside"
              placeholder="Company name"
              isInvalid={!!formState?.errors?.companyName}
              errorMessage={formState?.errors?.companyName?.join(', ')}
            />
            <Input
              name="price"
              label="Package price"
              labelPlacement="outside"
              placeholder="Price"
              isInvalid={!!formState?.errors?.price}
              errorMessage={formState?.errors?.price?.join(', ')}
            />

            {formState?.errors?._form ? <div>{formState?.errors?._form.join(', ')}</div> : null}

            <ButtonWithSpinner>Submit</ButtonWithSpinner>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}