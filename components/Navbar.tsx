import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4">
      <div className="flex justify-center gap-4 flex-wrap">

        <Link href="/">
          🏠 Início
        </Link>

        <Link href="/servicos">
          ✂️ Serviços
        </Link>

        <Link href="/agendamento">
          📅 Agendar
        </Link>

        <Link href="/meus-agendamentos">
          📋 Meus Agendamentos
        </Link>

      </div>
    </nav>
  );
}