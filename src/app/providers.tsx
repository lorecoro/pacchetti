'use client';

import { NextUIProvider } from "@nextui-org/react";
import React from "react";

interface Props {
  children: React.ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}