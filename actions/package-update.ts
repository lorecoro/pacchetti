// actions/package-update.ts

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
  id: z.string({ required_error: 'Id is required' }),
  name: z.string({ required_error: 'Name is required' })
    .min(1),
  companyId: z.string({ required_error: 'Company is required' })
    .min(3),
  invoiceId: z.string(),
  carried: z.coerce.number()
});

export interface updatePackageState {
  errors?: {
    name?: string[];
    companyId?: string[];
    invoiceId?: string[];
    carried?: string[];
    _form?: string[];
  }
};

export async function UpdatePackage(
  formState: updatePackageState,
  formData: FormData
): Promise<updatePackageState> {
  const t = await getTranslations();
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: [t('not_logged_in')] } };
  }

  const input = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    companyId: formData.get("companyId"),
    invoiceId: formData.get("invoiceId"),
    carried: formData.get("carried"),
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  try {
    const editedPackage: Package = await db.package.update({
      where: {
        id: input.data.id,
      },
      data: {
        name: input.data.name,
        company: { connect: { id: input.data.companyId }},
        invoice: { connect: { id: input.data.invoiceId }},
        carried: input.data.carried,
      }
    });
    if (!editedPackage) {
      return { errors: { _form: [t('failed_to_update_the_package')] } };
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