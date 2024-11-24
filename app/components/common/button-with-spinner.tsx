// app/components/common/button-with-spinner.tsx

'use client';

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";

interface Props {
  children: React.ReactNode;
}

export default function ButtonWithSpinner({children}: Props) {
  const { pending } = useFormStatus();

  return (
    <div>
      <Button type="submit" size="md" isLoading={pending}>
        {children}
      </Button>
    </div>
  );
}