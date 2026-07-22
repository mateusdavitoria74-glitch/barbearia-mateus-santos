"use client";

import Link from "next/link";

export default function BottomMenu() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white p-3 flex justify-around shadow-lg z-50">

      <Link
        href="/"
        className="text-center"
      >
        🏠
        <br />
        Início
      </Link>


      <Link
        href="/agendar"
        className="text-center"
      >
        📅
        <br />
        Agendar
      </Link>


      <Link
        href="/meus-agendamentos"
        className="text-center"
      >
        👤
        <br />
        Horários
      </Link>

    </nav>
  );
}