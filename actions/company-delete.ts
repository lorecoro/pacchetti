// actions/company-delete.ts

'use server';

import { auth } from "@/auth";
import { db } from "@/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import paths from "@/paths";

interface deleteCompanyState {
  errors?: {
    _form?: string[];
  }
};

export default async function DeleteCompany(id: string): Promise<deleteCompanyState> {
  const t = await getTranslations();
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: [t('not_logged_in')] } };
  }

  try {
    await db.company.delete({
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

  const { adminCompanies } = await paths();
  revalidatePath(adminCompanies());
  redirect(adminCompanies());
}