// actions/invoice-update.ts

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
  id: z.string({ required_error: 'Id is required' }),
  number: z.string({ required_error: 'Number is required' })
    .min(1),
  date: z.coerce.date(),
  companyId: z.string({ required_error: 'Company is required' })
    .min(3),
  amount: z.coerce.number({ required_error: 'Amount is required' })
    .gt(0),
  payment: z.enum(['paypal', 'bank_transfer']),
  paid: z.boolean().default(false)
});

export interface updateInvoiceState {
  errors?: {
    number?: string[];
    companyId?: string[];
    amount?: string[];
    _form?: string[];
  }
};

export async function UpdateInvoice(
  formState: updateInvoiceState,
  formData: FormData
): Promise<updateInvoiceState> {
  const t = await getTranslations();
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: [t('not_logged_in')] } };
  }

  const input = schema.safeParse({
    id: formData.get("id"),
    number: formData.get("number"),
    date: formData.get("date"),
    companyId: formData.get("companyId"),
    amount: formData.get("amount"),
    payment: formData.get("payment"),
    paid: formData.has("paid") ? true : false
  });

  console.log(formData);
  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  try {
    const editedInvoice: Invoice = await db.invoice.update({
      where: {
        id: input.data.id,
      },
      data: {
        number: input.data.number,
        date: input.data.date,
        companyId: input.data.companyId,
        amount: input.data.amount,
        payment: input.data.payment,
        paid: input.data.paid,
      }
    });
    if (!editedInvoice) {
      return { errors: { _form: [t('failed_to_update_the_invoice')] } };
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