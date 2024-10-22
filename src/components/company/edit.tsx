// src/components/company/edit.tsx

'use client';

import { useFormState } from "react-dom";
import { Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import UpdateCompany from "@/actions/company-update";
import ButtonWithSpinner from "@/components/common/button-with-spinner";

interface Props {
  company: {
    id: string;
    name: string;
    price: string;
  };
}

export default function EditButton(props: Props) {
  const [formState, action] = useFormState(UpdateCompany, { errors: {} });

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <button type="submit">
          <PencilIcon className="w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div>
            <Input
              isReadOnly
              name="id"
              label="ID"
              labelPlacement="outside"
              defaultValue={props.company.id}
            />
            <Input
              name="companyName"
              label="Company name"
              labelPlacement="outside"
              placeholder="Company name"
              defaultValue={props.company.name}
              isInvalid={!!formState?.errors?.companyName}
              errorMessage={formState?.errors?.companyName?.join(', ')}
            />
            <Input
              name="price"
              label="Package price"
              labelPlacement="outside"
              placeholder="Price"
              defaultValue={props.company.price}
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