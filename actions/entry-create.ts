// actions/entry-create.ts

'use server';

import type { Entry } from "@prisma/client";
import { auth } from '@/auth';
import { db } from '@/db';
import { getTranslations } from "next-intl/server";
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { DateTime } from "luxon";
import paths from '@/paths';

const schema = z.object({
  start: z.string()
    .transform((val) => {
      const date = DateTime.fromISO(val); // Parse the input
      return date.isValid ? date.set({ millisecond: 0, second: 0 }).toISO() : null; // Convert to standard ISO format
    })
    .refine((val) => val !== null, { message: "Invalid date format" }),
  end: z.string()
  .transform((val) => {
    const date = DateTime.fromISO(val);
    return date.isValid ? date.set({ millisecond: 0, second: 0 }).toISO() : null;
  })
  .refine((val) => val !== null, { message: "Invalid date format" }),
  name: z.string().min(1),
  packageId: z.string().min(1)
});

interface createEntryState {
  errors: {
    start?: string[];
    end?: string[];
    name?: string[];
    packageId?: string[];
    _form?: string[];
  }
};

export async function CreateEntry(
  formState: createEntryState,
  formData: FormData
): Promise<createEntryState> {
  const t = await getTranslations();
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ['not_logged_in'] } };
  }

  const input = schema.safeParse({
    start: formData.get("start"),
    end: formData.get("end"),
    name: formData.get("name"),
    packageId: formData.get("packageId")
  });

  if (!input.success) {
    console.log(formData);
    return { errors: input.error.flatten().fieldErrors }
  }

  try {
    let data: {
      start: string;
      end: string;
      name: string;
      packageId: string;
    } = {
      start: input.data.start,
      end: input.data.end,
      name: input.data.name,
      packageId: input.data.packageId
    }
    const newEntry: Entry = await db.entry.create({data: data});
    if (!newEntry) {
      return { errors: { _form: [t('failed_to_create_the_entry')] } };
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

  const { entries } = await paths();
  revalidatePath(entries());
  redirect(entries());
}