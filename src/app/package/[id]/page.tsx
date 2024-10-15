import NewEntry from "@/components/entry/form-new";
import { Link } from "@nextui-org/react";
import paths from "@/paths";
import EntryList from "@/components/entry/list";

interface Props {
  params: {
    id: string;
  }
}

export default function Page({ params }: Props) {
  const { id } = params;
  return (
    <div>
      <h1>Package {id}</h1>

      <NewEntry />
      New package
      <EntryList />
    </div>
  )
}