import Link from "next/link";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
} from "@nextui-org/react";
import paths from "@/paths";
import User from "@/components/client/user";

export default function Header() {
  return (
    <Navbar className="light light:bg-cyan-500 light:text-black bg-black text-white flex flex-col flex-nowrap">
      <NavbarBrand>
        <Link href={paths.home()}>Dashboard</Link>
      </NavbarBrand>
      <NavbarContent>
        <Link href={paths.invoices()}>Invoices</Link>
      </NavbarContent>
      <NavbarContent>
        <Link href={paths.newPackage()}>Request new package</Link>
      </NavbarContent>
      <NavbarContent>
        <Link href={paths.packages()}>Past packages</Link>
      </NavbarContent>
      <NavbarContent>
        <NavbarItem><User /></NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}