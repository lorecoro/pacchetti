// actions/entry-update.ts

'use server';

import type { Entry } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DateTime } from "luxon";
import paths from "@/paths";

const schema = z.object({
  id: z.string({ required_error: 'Id is required' }),
  start: z.string()
    .transform((val) => {
      const date = DateTime.fromISO(val);
      return date.isValid ? date.set({ millisecond: 0, second: 0 }).toISO() : null;
    })
    .refine((val) => val !== null, { message: "Invalid date format" }),
  end: z.string()
  .transform((val) => {
    const date = DateTime.fromISO(val);
    return date.isValid ? date.set({ millisecond: 0, second: 0 }).toISO() : null;
  })
  .refine((val) => val !== null, { message: "Invalid date format" }),
  name: z.string().min(1),
  packageId: z.string({ required_error: 'Package is required' }).min(1)
});

export interface updateEntryState {
  errors?: {
    start?: string[];
    end?: string[];
    name?: string[];
    packageId?: string[];
    _form?: string[];
  }
};

export async function UpdateEntry(
  formState: updateEntryState,
  formData: FormData
): Promise<updateEntryState> {
  const t = await getTranslations();
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: [t('not_logged_in')] } };
  }

  const input = schema.safeParse({
    id: formData.get("id"),
    start: formData.get("start"),
    end: formData.get("end"),
    name: formData.get("name"),
    packageId: formData.get("packageId"),
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  try {
    const editedEntry: Entry = await db.entry.update({
      where: {
        id: input.data.id,
      },
      data: {
        start: input.data.start,
        end: input.data.end,
        name: input.data.name,
        packageId: input.data.packageId
      }
    });
    if (!editedEntry) {
      return { errors: { _form: [t('failed_to_update_the_entry')] } };
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

  const { entries } = await paths();
  revalidatePath(entries());
  redirect(entries());
}