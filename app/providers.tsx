'use client';

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider refetchInterval={60}>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </SessionProvider>
  );
}