// actions/invoice-list.ts

'use server';

import type { Invoice } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";

export type InvoiceIdNumber = Pick<Invoice, "id" | "number">;

export async function fetchInvoicesIdNumber(): Promise<InvoiceIdNumber[]|void> {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error('Unauthenticated');
  }
  const list: InvoiceIdNumber[] = (await db.invoice.findMany({
    select: {
      id: true,
      number: true
    },
    orderBy: [{number: 'desc'}]
  }));
  return list;
}