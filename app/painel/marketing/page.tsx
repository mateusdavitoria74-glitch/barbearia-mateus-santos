"use client";

import Link from "next/link";


export default function Marketing() {


  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">


      <h1 className="text-3xl font-bold mb-6">
        📢 Marketing
      </h1>





      {/* LINK AGENDAMENTO */}


      <section className="bg-white rounded-3xl shadow p-6 mb-4">


        <h2 className="text-xl font-bold">
          🔗 Link de agendamento
        </h2>


        <p className="text-gray-500 mt-2">
          Compartilhe seu link com os clientes
        </p>



        <div className="bg-slate-100 p-3 rounded-xl mt-4 break-all">

          https://barbearia-mateus-santos.vercel.app/agendar

        </div>



        <button
          className="w-full bg-black text-white p-3 rounded-xl font-bold mt-4"
        >

          📋 Copiar link

        </button>


      </section>






      {/* WHATSAPP */}


      <section className="bg-white rounded-3xl shadow p-6 mb-4">


        <h2 className="text-xl font-bold">
          📲 WhatsApp
        </h2>


        <p className="text-gray-500 mt-2">
          Envie mensagens e lembretes para clientes
        </p>



        <button
          className="w-full bg-green-600 text-white p-3 rounded-xl font-bold mt-4"
        >

          Abrir WhatsApp

        </button>


      </section>






      {/* REDES SOCIAIS */}


      <section className="bg-white rounded-3xl shadow p-6 mb-4">


        <h2 className="text-xl font-bold">
          📸 Redes sociais
        </h2>



        <p className="text-gray-500">
          Divulgue seus cortes e promoções
        </p>




        <div className="grid gap-3 mt-4">


          <button className="bg-slate-100 p-3 rounded-xl font-bold">

            📷 Instagram

          </button>



          <button className="bg-slate-100 p-3 rounded-xl font-bold">

            🎵 TikTok

          </button>


        </div>


      </section>








      {/* PROMOÇÕES */}


      <section className="bg-white rounded-3xl shadow p-6">


        <h2 className="text-xl font-bold">
          ⭐ Promoções
        </h2>



        <p className="text-gray-500 mt-2">
          Crie campanhas para atrair clientes
        </p>



        <button
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold mt-4"
        >

          Criar promoção

        </button>



      </section>






      <Link
        href="/painel/configuracoes"
        className="block mt-6 bg-black text-white text-center p-4 rounded-xl font-bold"
      >

        ⬅ Voltar

      </Link>




    </main>

  );

}