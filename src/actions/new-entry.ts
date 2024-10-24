'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import paths from '@/paths';

const schema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  name: z.string()
});

interface newEntryFormState {
  errors: {
    start?: string[];
    end?: string[];
    name?: string[];
    _form?: string[];
  }
};

export async function newEntry(
  formState: newEntryFormState,
  formData: FormData
): Promise<newEntryFormState> {
  // check if the user is logged in
  const session = await auth();
  if (!session || !session.user) {
    return { errors: { _form: ['Not logged in'] } };
  }

  const input = schema.safeParse({
    start: formData.get("start"),
    end: formData.get("end"),
    name: formData.get("name")
  });

  if (!input.success) {
    return { errors: input.error.flatten().fieldErrors }
  }

  try {
    await db.entry.create({
      data: {
        start: input.data.start,
        end: input.data.end,
        name: input.data.name,
        packageId: ''
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

  revalidatePath(paths.home());
  redirect(paths.home());

  return { errors: {} }
}