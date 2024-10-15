'use server';

import { Chip } from "@nextui-org/react";
import { db } from "@/db";

export default async function EntryList() {
  const list = await db.entry.findMany();
  const renderedList = list.map((item) => {
    return (
      <div key={item.id}>
        <Chip color="warning" variant="shadow">{item.name}</Chip>
      </div>
    )
  });

  return <div>{renderedList}</div>
}