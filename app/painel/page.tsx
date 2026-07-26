"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  listarAgendamentos,
  listarClientes,
} from "@/lib/firestore";


export default function Painel() {


  const [totalAgendamentos, setTotalAgendamentos] =
    useState(0);

  const [totalClientes, setTotalClientes] =
    useState(0);



  useEffect(() => {

    carregarDados();

  }, []);




  async function carregarDados(){

    try{

      const agendamentos =
        await listarAgendamentos();


      const clientes =
        await listarClientes();



      setTotalAgendamentos(
        agendamentos.length
      );


      setTotalClientes(
        clientes.length
      );


    }catch(erro){

      console.log(
        "Erro ao carregar painel:",
        erro
      );

    }

  }




  return (


    <main className="min-h-screen bg-gray-100 p-6">


      {/* CABEÇALHO COM LOGO */}

      <div className="bg-white rounded-3xl shadow p-6 text-center mb-6">


        <img

          src="/icon-192.png"

          alt="Barbearia Mateus Santos"

          className="w-28 h-28 rounded-full object-cover mx-auto shadow"

        />


        <h1 className="text-3xl font-bold mt-4">

          Barbearia Mateus Santos 💈

        </h1>


        <p className="text-gray-500 mt-2">

          Painel Administrativo

        </p>


      </div>





      {/* CARDS */}

      <div className="grid gap-4 md:grid-cols-2">



        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-xl font-bold">

            📅 Agendamentos

          </h2>


          <p className="text-gray-500 mt-2">

            {totalAgendamentos} horários cadastrados

          </p>


        </div>





        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="text-xl font-bold">

            👥 Clientes

          </h2>


          <p className="text-gray-500 mt-2">

            {totalClientes} clientes cadastrados

          </p>


        </div>




      </div>






      {/* ACESSOS */}

      <div className="grid gap-4 mt-6">



        <Link

          href="/painel/configuracoes"

          className="bg-black text-white p-5 rounded-3xl text-center font-bold"

        >

          ⚙️ Configurações

        </Link>





        <Link

          href="/painel/servicos"

          className="bg-white p-5 rounded-3xl shadow text-center font-bold"

        >

          💈 Gerenciar Serviços

        </Link>





        <Link

          href="/painel/horarios"

          className="bg-white p-5 rounded-3xl shadow text-center font-bold"

        >

          🕒 Horários

        </Link>



      </div>




    </main>


  );


}