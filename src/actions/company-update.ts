// src/actions/company-update.ts

'use server';

import type { Company } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import paths from "@/paths";

const schema = z.object({
  id: z.string({ required_error: 'Id is required' }),
  name: z.string({ required_error: 'Name is required' }),
  price: z.coerce.number({ required_error: 'Price is required' })
    .gt(0),
});

interface updateCompanyState {
  errors?: {
    companyName?: string[];
    price?: string[];
    _form?: string[];
  }
};

export default async function UpdateCompany(
  formState: updateCompanyState,
  formData: FormData
): Promise<updateCompanyState> {
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ['Not logged in'] } };
  }

  const input = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("companyName"),
    price: formData.get("price"),
  });

  console.log(formData);
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
      return { errors: { _form: ['Failed to update the company'] } };
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
          _form: ['Something went wrong']
        }
      }
    }
  }

  revalidatePath(paths.companies());
  redirect(paths.companies());
}