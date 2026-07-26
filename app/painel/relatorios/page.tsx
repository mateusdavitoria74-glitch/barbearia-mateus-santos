"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  listarAgendamentos,
  listarClientes,
} from "@/lib/firestore";


export default function Relatorios() {


  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);



  useEffect(() => {

    carregarRelatorios();

  }, []);




  async function carregarRelatorios(){


    try {


      const dadosAgendamentos =
        await listarAgendamentos();



      const dadosClientes =
        await listarClientes();



      setAgendamentos(
        dadosAgendamentos
      );


      setClientes(
        dadosClientes
      );



    } catch(erro){


      console.log(
        "Erro relatório:",
        erro
      );


    }


  }





  const finalizados =
    agendamentos.filter(
      (item)=>
        item.status?.toLowerCase() === "finalizado"
    );




  const faturamento =
    finalizados.reduce(
      (total,item)=>
        total + Number(item.valor || 0),
      0
    );




  const ticketMedio =
    finalizados.length > 0
    ? faturamento / finalizados.length
    : 0;




  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">



      <h1 className="text-3xl font-bold mb-6">
        📊 Relatórios
      </h1>





      <div className="grid gap-4">



        <div className="bg-white rounded-3xl shadow p-6">

          <p className="text-gray-500">
            👥 Clientes cadastrados
          </p>


          <h2 className="text-3xl font-bold">
            {clientes.length}
          </h2>


        </div>






        <div className="bg-white rounded-3xl shadow p-6">

          <p className="text-gray-500">
            📅 Total de agendamentos
          </p>


          <h2 className="text-3xl font-bold">
            {agendamentos.length}
          </h2>


        </div>






        <div className="bg-white rounded-3xl shadow p-6">

          <p className="text-gray-500">
            ✅ Cortes finalizados
          </p>


          <h2 className="text-3xl font-bold">
            {finalizados.length}
          </h2>


        </div>






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
            📈 Ticket médio
          </p>


          <h2 className="text-3xl font-bold">
            R$ {ticketMedio.toFixed(2)}
          </h2>


        </div>



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