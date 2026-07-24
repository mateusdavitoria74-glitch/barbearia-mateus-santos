"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Configuracoes() {

  const router = useRouter();


  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">


        <h1 className="text-3xl font-bold mb-6 text-center">
          ⚙️ Configurações
        </h1>



        <div className="space-y-4">



          <Link
            href="/painel/configuracoes/perfil"
            className="block w-full bg-black text-white p-4 rounded-xl text-center font-bold"
          >
            👤 Alterar perfil
          </Link>




          <Link
            href="/painel/configuracoes/barbearia"
            className="block w-full bg-black text-white p-4 rounded-xl text-center font-bold"
          >
            💈 Dados da barbearia
          </Link>




          <Link
            href="/painel/configuracoes/whatsapp"
            className="block w-full bg-black text-white p-4 rounded-xl text-center font-bold"
          >
            📱 WhatsApp
          </Link>





          <button
            onClick={() => router.push("/painel")}
            className="w-full bg-gray-300 p-4 rounded-xl font-bold"
          >
            ⬅ Voltar ao painel
          </button>



        </div>


      </div>


    </main>

  );

}