// actions/invoice-create.ts

'use server';

import type { Invoice } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import paths from "@/paths";

const schema = z.object({
  number: z.string()
    .min(1),
  date: z.coerce.date(),
  companyId: z.string(),
  amount: z.coerce.number({ required_error: 'Amount is required' })
    .gt(0),
  payment: z.enum(['paypal', 'bank_transfer']),
  paid: z.boolean().default(false)
});

interface createInvoiceState {
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

export async function CreateInvoice(
  formState: createInvoiceState,
  formData: FormData
): Promise<createInvoiceState> {
  const t = await getTranslations();
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: [t('not_logged_in')] } };
  }

  const input = schema.safeParse({
    number: formData.get("number"),
    date: formData.get("date"),
    companyId: formData.get("companyId"),
    amount: formData.get("amount"),
    payment: formData.get("payment"),
    paid: formData.has("paid") ? true : false
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }
  try {
    const newInvoice: Invoice = await db.invoice.create({
      data: {
        number: input.data.number,
        date: input.data.date,
        companyId: input.data.companyId,
        amount: input.data.amount,
        payment: input.data.payment,
        paid: input.data.paid
      }
    });
    if (!newInvoice) {
      return { errors: { _form: [t('failed_to_create_the_invoice')] } };
    }
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
          _form: [t('something_went_wrong')]
        }
      }
    }
  }

  const { invoices } = await paths();
  revalidatePath(invoices());
  redirect(invoices());
}