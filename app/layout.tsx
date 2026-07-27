import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import BottomMenu from "@/components/BottomMenu";
import InstallButton from "@/components/InstallButton";


export const metadata: Metadata = {
  title: "Barbearia Mateus Santos",
  description: "Agendamento de horários da barbearia",

  manifest: "/manifest.json",

  icons: {
  icon: "/logo.png",
  apple: "/logo.png",
},

  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "Barbearia Mateus Santos",
  },
};


export const viewport = {
  themeColor: "#111111",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="pt-BR">

      <body>

        <Navbar />

        {children}

        <BottomMenu />

      </body>

    </html>

  );

}