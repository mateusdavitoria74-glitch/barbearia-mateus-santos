"use client";

import Link from "next/link";
import { useState } from "react";


export default function Horarios() {


  const [inicio, setInicio] = useState("10:00");
  const [fim, setFim] = useState("17:00");



  const dias = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];




  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">



      <h1 className="text-3xl font-bold mb-6">
        🕒 Disponibilidade
      </h1>





      <section className="bg-white rounded-3xl shadow p-6 mb-6">


        <h2 className="text-xl font-bold mb-4">
          Horário de atendimento
        </h2>



        <div className="grid gap-4">


          <div>

            <label className="text-gray-500">
              Abertura
            </label>


            <input
              type="time"
              value={inicio}
              onChange={(e)=>setInicio(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1"
            />

          </div>





          <div>

            <label className="text-gray-500">
              Fechamento
            </label>


            <input
              type="time"
              value={fim}
              onChange={(e)=>setFim(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1"
            />

          </div>



        </div>



      </section>






      <section className="bg-white rounded-3xl shadow p-6">


        <h2 className="text-xl font-bold mb-4">
          📅 Dias de atendimento
        </h2>



        <div className="grid gap-3">


          {dias.map((dia)=>(


            <div
              key={dia}
              className="flex justify-between items-center bg-slate-100 p-4 rounded-xl"
            >


              <span className="font-bold">
                {dia}
              </span>


              <span className="text-green-600 font-bold">
                Aberto
              </span>


            </div>


          ))}


        </div>


      </section>






      <button
        className="w-full bg-black text-white p-4 rounded-xl font-bold mt-6"
      >

        💾 Salvar horários

      </button>





      <Link
        href="/painel/configuracoes"
        className="block mt-4 bg-gray-300 text-center p-4 rounded-xl font-bold"
      >
        ⬅ Voltar
      </Link>



    </main>

  );

}