"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  listarAgendamentos,
} from "@/lib/firestore";


export default function Financeiro() {


  const [agendamentos, setAgendamentos] = useState<any[]>([]);



  useEffect(() => {

    carregarFinanceiro();

  }, []);




  async function carregarFinanceiro(){

    try {

      const dados =
        await listarAgendamentos();


      setAgendamentos(dados);


    } catch(erro){

      console.log(
        "Erro financeiro:",
        erro
      );

    }

  }




  const confirmados =
    agendamentos.filter(
      (item)=>
        item.status?.toLowerCase() === "confirmado" ||
        item.status?.toLowerCase() === "finalizado"
    );




  const faturamento =
    confirmados.reduce(
      (total,item)=>
        total + Number(item.valor || 0),
      0
    );




  const ticketMedio =
    confirmados.length > 0
    ? faturamento / confirmados.length
    : 0;




  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">



      <h1 className="text-3xl font-bold mb-6">
        💼 Financeiro
      </h1>




      {/* CARDS */}


      <div className="grid gap-4">



        <div className="bg-white rounded-3xl shadow p-6">

          <p className="text-gray-500">
            💰 Faturamento
          </p>


          <h2 className="text-3xl font-bold text-green-600">
            R$ {faturamento.toFixed(2)}
          </h2>


        </div>





        <div className="bg-white rounded-3xl shadow p-6">

          <p className="text-gray-500">
            ✂️ Cortes realizados
          </p>


          <h2 className="text-3xl font-bold">
            {confirmados.length}
          </h2>


        </div>





        <div className="bg-white rounded-3xl shadow p-6">

          <p className="text-gray-500">
            📊 Ticket médio
          </p>


          <h2 className="text-3xl font-bold">
            R$ {ticketMedio.toFixed(2)}
          </h2>


        </div>


      </div>






      {/* HISTÓRICO */}


      <h2 className="text-xl font-bold mt-8 mb-4">
        📋 Histórico financeiro
      </h2>




      <div className="grid gap-3">


        {
          confirmados.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-5">

              Nenhum atendimento finalizado.

            </div>


          ) : (


            confirmados.map((item)=>(


              <div
                key={item.id}
                className="bg-white rounded-2xl shadow p-5"
              >


                <h3 className="font-bold">
                  👤 {item.nome}
                </h3>


                <p>
                  ✂️ {item.servico}
                </p>


                <p>
                  📅 {item.data}
                </p>


                <p className="font-bold text-green-600">
                  💰 R$ {item.valor}
                </p>


              </div>


            ))


          )
        }


      </div>






      <Link
        href="/painel/configuracoes"
        className="block mt-8 bg-black text-white text-center p-4 rounded-xl font-bold"
      >
        ⬅ Voltar
      </Link>



    </main>

  );

}