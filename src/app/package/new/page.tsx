import { Button, RadioGroup, Radio } from "@nextui-org/react";
import { newPackage } from "@/actions/new-package";

export default function Page() {
  return <div>
    <h1>New Package</h1>
    <div>4 hours package</div>
    <div>€ 300.00</div>
    <form action={newPackage}>
      <RadioGroup name="payment" label="Payment">
        <Radio name="payment" value="bank">Bank transfer</Radio>
        <Radio name="payment" value="paypal">Paypal</Radio>
      </RadioGroup>
      <Button type="submit" color="primary">Confirm</Button>
    </form>
  </div>
}