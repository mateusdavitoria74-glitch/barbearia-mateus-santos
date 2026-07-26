"use client";

import Link from "next/link";


export default function Configuracoes(){


  return (

    <main className="min-h-screen bg-gray-100 p-6">


      <h1 className="text-3xl font-bold mb-6">
        ⚙️ Configurações
      </h1>




      <div className="grid gap-4">



        <Link
          href="/painel/servicos"
          className="bg-white p-6 rounded-3xl shadow"
        >

          <h2 className="font-bold text-xl">
            💈 Serviços
          </h2>

          <p className="text-gray-500">
            Gerencie cortes e valores
          </p>

        </Link>






        <Link
          href="/painel/horarios"
          className="bg-white p-6 rounded-3xl shadow"
        >

          <h2 className="font-bold text-xl">
            🕒 Horários
          </h2>

          <p className="text-gray-500">
            Defina funcionamento
          </p>

        </Link>






        <Link
          href="/painel/fidelidade"
          className="bg-white p-6 rounded-3xl shadow"
        >

          <h2 className="font-bold text-xl">
            ⭐ Fidelidade
          </h2>

          <p className="text-gray-500">
            Controle clientes fiéis
          </p>

        </Link>







        <Link
          href="/painel/whatsapp"
          className="bg-white p-6 rounded-3xl shadow"
        >

          <h2 className="font-bold text-xl">
            📲 WhatsApp
          </h2>

          <p className="text-gray-500">
            Mensagens automáticas
          </p>

        </Link>







        <Link
          href="/painel/cancelamento"
          className="bg-white p-6 rounded-3xl shadow"
        >

          <h2 className="font-bold text-xl">
            ❌ Cancelamentos
          </h2>

          <p className="text-gray-500">
            Controle cancelamentos
          </p>

        </Link>







        <Link
          href="/painel/finalizados"
          className="bg-white p-6 rounded-3xl shadow"
        >

          <h2 className="font-bold text-xl">
            ✂️ Cortes finalizados
          </h2>

          <p className="text-gray-500">
            Histórico de cortes realizados
          </p>

        </Link>







        <Link
          href="/painel/financeiro"
          className="bg-white p-6 rounded-3xl shadow"
        >

          <h2 className="font-bold text-xl">
            💰 Financeiro
          </h2>

          <p className="text-gray-500">
            Controle faturamento e valores
          </p>

        </Link>







        <Link
          href="/painel/marketing"
          className="bg-white p-6 rounded-3xl shadow"
        >

          <h2 className="font-bold text-xl">
            📢 Marketing
          </h2>

          <p className="text-gray-500">
            Divulgação da barbearia
          </p>

        </Link>







        <Link
          href="/painel/relatorios"
          className="bg-white p-6 rounded-3xl shadow"
        >

          <h2 className="font-bold text-xl">
            📊 Relatórios
          </h2>

          <p className="text-gray-500">
            Análise dos resultados
          </p>

        </Link>




      </div>



    </main>

  );


}