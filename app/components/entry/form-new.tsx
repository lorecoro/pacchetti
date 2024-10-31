'use client';

import { useFormState } from "react-dom";
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { newEntry } from "@/actions/new-entry";
import ButtonWithSpinner from "@/components/common/button-with-spinner";

export default function NewEntry() {
  const [formState, action] = useFormState(newEntry, { errors: {} });

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button>New entry</Button>
      </PopoverTrigger>
      <PopoverContent>
        <form action={action}>
          <div>
            <h3>Create an entry</h3>
            <Input 
              name="start"
              label="Start"
              labelPlacement="outside"
              placeholder="Start"
              isInvalid={!!formState.errors.start}
              errorMessage={formState.errors.start?.join(', ')}
            />
            <Input
              name="end"
              label="End"
              labelPlacement="outside"
              placeholder="End"
              isInvalid={!!formState.errors.end}
              errorMessage={formState.errors.end?.join(', ')}
            />
            <Input
              name="name"
              label="Description"
              labelPlacement="outside"
              placeholder="Description"
              isInvalid={!!formState.errors.name}
              errorMessage={formState.errors.name?.join(', ')}
            />

            {formState.errors._form ? <div>{formState.errors._form.join(', ')}</div> : null}

            <ButtonWithSpinner>Submit</ButtonWithSpinner>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}