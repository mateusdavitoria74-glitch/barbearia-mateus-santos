"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import BottomMenu from "@/components/BottomMenu";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const pathname = usePathname();


  const isPainel = pathname.startsWith("/painel");


  return (
    <>

      {!isPainel && <Navbar />}


      {children}


      {!isPainel && <BottomMenu />}


    </>
  );

}