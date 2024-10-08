'use server';

import Link from "next/link";
import { Chip } from "@nextui-org/react";
import { db } from "@/db";
import paths from "@/paths";

export default async function PackageList() {
  const list = await db.package.findMany();
  const renderedList = list.map((item) => {
    return (
      <div key={item.id}>
        <Link href={paths.package(item.id)}>
          <Chip color="warning" variant="shadow">{item.name}</Chip>
        </Link>

      </div>
    )
  });

  return <div>{renderedList}</div>
}