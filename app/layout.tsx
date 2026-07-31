import type { Metadata } from "next";
import "./globals.css";

import ClientLayout from "@/components/ClientLayout";
import NotificationPermission from "@/components/NotificationPermission";

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
        <NotificationPermission />

        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}