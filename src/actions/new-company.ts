'use server';

import type { Company } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import paths from "@/paths";

const schema = z.object({
  name: z.string(),
  price: z.number(),
});

interface newCompanyFormState {
  errors: {
    name?: string[];
    price?: string[];
    _form?: string[];
  }
};

export async function newCompany(
  formState: newCompanyFormState,
  formData: FormData
): Promise<newCompanyFormState> {
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ['Not logged in'] } };
  }

  const input = schema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  let newCompany: Company;
  try {
    newCompany = await db.company.create({
      data: {
        name: input.data.name,
        price: input.data.price,
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

  revalidatePath(paths.companies());
  redirect(paths.companies());

  return { errors: {} }
}