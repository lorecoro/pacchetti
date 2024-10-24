// src/actions/company-delete.ts

'use server';

import { auth } from "@/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import paths from "@/paths";

interface deleteCompanyState {
  errors?: {
    _form?: string[];
  }
};

export default async function DeleteCompany(id: string): Promise<deleteCompanyState> {
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ['Not logged in'] } };
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
          _form: ['Something went wrong']
        }
      }
    }
  }

  revalidatePath(paths.companies());
  redirect(paths.companies());
}