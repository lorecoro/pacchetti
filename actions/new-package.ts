'use server';

import { auth } from "@/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import paths from "@/paths";

const schema = z.object({
  payment: z.string()
});

interface newPackageFormState {
  errors: {
    package?: string[];
    _form?: string[];
  }
};

export async function newPackage(
  formState: newPackageFormState,
  formData: FormData
) {
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ['Not logged in'] } };
  }

  const input = schema.safeParse({
    payment: formData.get("payment")
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  try {
    await db.package.create({
      data: {
        name: '',
        companyId: ''
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

  const { packages } = await paths();
  revalidatePath(packages());
  redirect(packages());
}