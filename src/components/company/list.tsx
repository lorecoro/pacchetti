'use server';

import { Chip } from "@nextui-org/react";
import { db } from "@/db";

export default async function CompanyList() {
  const list = await db.company.findMany();
  const renderedList = list.map((item) => {
    return (
      <div key={item.id}>
        <Chip color="warning" variant="shadow">{item.name}</Chip>
      </div>
    )
  });

  return <div>{renderedList}</div>
}