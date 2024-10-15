'use server';

import type { Invoice } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import paths from "@/paths";

const schema = z.object({
  number: z.string(),
  date: z.date(),
  companyId: z.string(),
  amount: z.number(),
  payment: z.enum(['Paypal', 'BankTransfer']),
  paid: z.boolean()
});

interface newInvoiceFormState {
  errors: {
    number?: string[];
    date?: string[];
    companyId?: string[];
    amount?: string[];
    payment?: string[];
    paid?: string[];
    _form?: string[];
  }
};

export async function newInvoice(
  formState: newInvoiceFormState,
  formData: FormData
): Promise<newInvoiceFormState> {
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ['Not logged in'] } };
  }

  const input = schema.safeParse({
    number: formData.get("number"),
    date: formData.get("date"),
    companyId: formData.get("companyId"),
    amount: formData.get("amount"),
    payment: formData.get("payment"),
    paid: formData.get("paid")
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  let newInvoice: Invoice;
  try {
    newInvoice = await db.invoice.create({
      data: {
        number: input.data.number,
        date: input.data.date,
        companyId: input.data.companyId,
        amount: input.data.amount,
        payment: input.data.payment,
        paid: input.data.paid
      }
    });
  }
  catch (err:unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message]
        }
      }
    }
    else {
      return {
        errors: {
          _form: ['Something went wrong']
        }
      }
    }
  }

  revalidatePath(paths.invoices());
  redirect(paths.invoices());

  return { errors: {} }
}