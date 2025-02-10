// actions/package-list.ts

'use server';

import type { Package } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/db";

export type PackageIdName = Pick<Package, "id" | "name">;

export async function fetchPackagesIdName(): Promise<PackageIdName[]|void> {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error('Unauthenticated');
  }
  const list: PackageIdName[] = (await db.package.findMany({
    select: {
      id: true,
      name: true
    },
    orderBy: [{name: 'desc'}]
  }));
  return list;
}