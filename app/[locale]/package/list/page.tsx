import PackageList from "@/app/components/package/list";
import { Divider } from "@nextui-org/react";

export default function Page() {
  return (
    <div>
      <h1>Packages</h1>
      <Divider />
      <PackageList />
    </div>
  )
}