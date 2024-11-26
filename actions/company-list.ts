// actions/company-list.ts

'use server';

import type { Company } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";

export type CompanyIdName = Pick<Company, "id" | "name">;

export async function fetchCompaniesIdName(): Promise<CompanyIdName[]|void> {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error('Unauthenticated');
  }
  const list: CompanyIdName[] = (await db.company.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: [{name: 'asc'}]
  }));
  return list;
}