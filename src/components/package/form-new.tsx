'use client';

import { useFormState } from "react-dom";
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { newPackage } from "@/actions/new-package";
import ButtonWithSpinner from "@/components/common/button-with-spinner";

export default function NewPackage() {
  const [formState, action] = useFormState(newPackage, { errors: {} });

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button>Order a new package</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div>
            <h3>Order a new package</h3>
            <Input 
              name="payment"
              label="Payment"
              labelPlacement="outside"
              placeholder="Payment method"
              isInvalid={!!formState.errors.payment}
              errorMessage={formState.errors.payment?.join(', ')}
            />
            
            {formState.errors._form ? <div>{formState.errors._form.join(', ')}</div> : null}

            <ButtonWithSpinner>Submit</ButtonWithSpinner>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}