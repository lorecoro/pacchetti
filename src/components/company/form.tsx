// src/components/company/form.tsx

'use client';

import { Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { ReactNode } from "react";
import ButtonWithSpinner from "@/components/common/button-with-spinner";

interface Props {
  submitButton: ReactNode;
  action: string | ((formData: FormData) => void | Promise<void>) | undefined;
  company?: {
    id: string;
    name: string;
    price: string;
  };
  errors?: {
    name?: string[];
    price?: string[];
    _form?: string[];
  }
}

export default function CompanyForm(props: Props) {
  const { submitButton, action, company, errors} = props;
console.log(errors);
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        {submitButton}
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div>
            {company?.id && (
              <Input
                isReadOnly
                name="id"
                label="ID"
                labelPlacement="outside"
                defaultValue={company?.id}
              />
            )}
            <Input
              name="name"
              label="Company name"
              labelPlacement="outside"
              placeholder="Company name"
              defaultValue={company?.name}
              isInvalid={!!errors?.name}
              errorMessage={errors?.name?.join(', ')}
            />
            <Input
              name="price"
              label="Package price"
              labelPlacement="outside"
              placeholder="Price"
              defaultValue={company?.price}
              isInvalid={!!errors?.price}
              errorMessage={errors?.price?.join(', ')}
            />

            {errors?._form ? <div>{errors?._form.join(', ')}</div> : null}

            <ButtonWithSpinner>Submit</ButtonWithSpinner>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}