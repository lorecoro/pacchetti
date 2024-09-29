import Link from "next/link";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
} from "@nextui-org/react";
import User from "@/components/client/user";

export default function Header() {
  return (
    <Navbar className="light light:bg-cyan-500 light:text-black bg-black text-white flex flex-col flex-nowrap">
      <NavbarBrand>
        <Link href="/">Dashboard</Link>
      </NavbarBrand>
      <NavbarContent>
        Invoices
      </NavbarContent>
      <NavbarContent>
        Request new package
      </NavbarContent>
      <NavbarContent>
        Past packages
      </NavbarContent>
      <NavbarContent>
        <NavbarItem><User /></NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}