// src/actions/company-create.ts

'use server';

import type { Company } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import paths from "@/paths";

const schema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  price: z.coerce.number({ required_error: 'Price is required' })
    .gt(0),
});

interface createCompanyState {
  errors?: {
    companyName?: string[];
    price?: string[];
    _form?: string[];
  }
};

export async function createCompany(
  formState: createCompanyState,
  formData: FormData
): Promise<createCompanyState> {
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ['Not logged in'] } };
  }

  const input = schema.safeParse({
    name: formData.get("companyName"),
    price: formData.get("price"),
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  try {
    const newCompany: Company = await db.company.create({
      data: {
        name: input.data.name,
        price: input.data.price,
      }
    });
    if (!newCompany) {
      return { errors: { _form: ['Failed to create the company'] } };
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