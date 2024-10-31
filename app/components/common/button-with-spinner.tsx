'use client';

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";

interface Props {
  children: React.ReactNode;
}

export default function ButtonWithSpinner({children}: Props) {
  const { pending } = useFormStatus();

  return <Button type="submit" isLoading={pending}>
    {children}
  </Button>
}