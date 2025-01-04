// actions/company-update.ts

'use server';

import type { Company } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import paths from "@/paths";

const schema = z.object({
  id: z.string({ required_error: 'Id is required' }),
  name: z.string({ required_error: 'Name is required' })
    .min(3),
  price: z.coerce.number({ required_error: 'Price is required' })
    .gt(0),
});

export interface updateCompanyState {
  errors?: {
    name?: string[];
    price?: string[];
    _form?: string[];
  }
};

export async function UpdateCompany(
  formState: updateCompanyState,
  formData: FormData
): Promise<updateCompanyState> {
  const t = await getTranslations();
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: [t('not_logged_in')] } };
  }

  const input = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  try {
    const editedCompany: Company = await db.company.update({
      where: {
        id: input.data.id,
      },
      data: {
        name: input.data.name,
        price: input.data.price,
      }
    });
    if (!editedCompany) {
      return { errors: { _form: [t('failed_to_update_the_company')] } };
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

  const { adminCompanies } = await paths();
  revalidatePath(adminCompanies());
  redirect(adminCompanies());
}