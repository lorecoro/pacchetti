'use client';

import { Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import ButtonWithSpinner from "@/app/components/common/button-with-spinner";

export default function OrderPackage() {
  return (
    <Popover placement="left">
      <PopoverTrigger>
        <Button>Order a new package</Button>
      </PopoverTrigger>
      <PopoverContent>
          <div>
            <h3>Order a new package</h3>
            <ButtonWithSpinner>Submit</ButtonWithSpinner>
          </div>
      </PopoverContent>
    </Popover>
  )
}