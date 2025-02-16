// actions/package-create.ts

'use server';

import type { Package } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import paths from "@/paths";

const schema = z.object({
  name: z.string()
    .min(1),
  companyId: z.string(),
  invoiceId: z.string().optional(),
  carried: z.coerce.number()
});

interface createPackageState {
  errors: {
    name?: string[];
    companyId?: string[];
    invoiceId?: string[];
    carried?: string[];
    _form?: string[];
  }
};

export async function CreatePackage(
  formState: createPackageState,
  formData: FormData
): Promise<createPackageState> {
  const t = await getTranslations();
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: [t('not_logged_in')] } };
  }

  const input = schema.safeParse({
    name: formData.get("name"),
    companyId: formData.get("companyId"),
    invoiceId: formData.get("invoiceId"),
    carried: formData.get("carried"),
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  try {
    let data: {
      name: string;
      companyId: string;
      invoiceId?: string | null;
      carried: number;
    } = {
      name: input.data.name,
      companyId: input.data.companyId,
      carried: input.data.carried,
    }
    if (input.data.invoiceId) {
      data.invoiceId = input.data.invoiceId
    }
    const newPackage: Package = await db.package.create({data: data});
    if (!newPackage) {
      return { errors: { _form: [t('failed_to_create_the_package')] } };
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

  const { packages } = await paths();
  revalidatePath(packages());
  redirect(packages());
}