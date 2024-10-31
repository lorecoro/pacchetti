'use client';

import { useFormState } from "react-dom";
import { Button, Checkbox, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { newInvoice } from "@/actions/new-invoice";
import ButtonWithSpinner from "@/app/components/common/button-with-spinner";

export default function NewInvoice() {
  const [formState, action] = useFormState(newInvoice, { errors: {} });

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button>Create a new invoice</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div>
            <h3>Create a new invoice</h3>
            <Input 
              name="number"
              label="Invoice number"
              labelPlacement="outside"
              placeholder="Invoice number"
              isInvalid={!!formState.errors.number}
              errorMessage={formState.errors.number?.join(', ')}
            />
            <Input 
              name="date"
              label="Invoice date"
              labelPlacement="outside"
              placeholder="Invoice date"
              isInvalid={!!formState.errors.date}
              errorMessage={formState.errors.date?.join(', ')}
            />
            <Input 
              name="companyId"
              label="Company"
              labelPlacement="outside"
              placeholder="Company id"
              isInvalid={!!formState.errors.companyId}
              errorMessage={formState.errors.companyId?.join(', ')}
            />
            <Input 
              name="amount"
              label="Amount"
              labelPlacement="outside"
              placeholder="Amount"
              isInvalid={!!formState.errors.amount}
              errorMessage={formState.errors.amount?.join(', ')}
            />
            <Input 
              name="payment"
              label="Payment"
              labelPlacement="outside"
              placeholder="Payment method"
              isInvalid={!!formState.errors.payment}
              errorMessage={formState.errors.payment?.join(', ')}
            />
            <Checkbox 
              name="paid"
              isInvalid={!!formState.errors.paid}
            >Paid</Checkbox>

            {formState.errors._form ? <div>{formState.errors._form.join(', ')}</div> : null}

            <ButtonWithSpinner>Submit</ButtonWithSpinner>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}