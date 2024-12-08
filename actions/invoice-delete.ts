// actions/invoice-delete.ts

'use server';

import { auth } from "@/auth";
import { db } from "@/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import paths from "@/paths";

interface deleteInvoiceState {
  errors?: {
    _form?: string[];
  }
};

export default async function DeleteInvoice(id: string): Promise<deleteInvoiceState> {
  const t = await getTranslations();
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: [t('not_logged_in')] } };
  }

  try {
    await db.invoice.delete({
      where: {
        id: id,
      },
    })
  }
  catch(err:unknown) {
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