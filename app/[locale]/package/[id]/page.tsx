// import NewEntry from "@/app/components/entry/new";
// import EntryList from "@/app/components/entry/list";

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

      {/* <NewEntry />
      New package
      <EntryList /> */}
    </div>
  )
}