"use client";

import { useEffect, useState } from "react";
import { listarClientes } from "@/lib/firestore";
import Link from "next/link";


export default function Clientes() {


  const [clientes, setClientes] = useState<any[]>([]);


  useEffect(() => {

    carregarClientes();

  }, []);



  async function carregarClientes(){

    const dados = await listarClientes();

    setClientes(dados);

  }



  return (

    <main className="min-h-screen bg-slate-100 p-6">


      <h1 className="text-3xl font-bold mb-6">
        👥 Clientes
      </h1>



      <div className="grid gap-4">


        {
          clientes.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-6">

              Nenhum cliente cadastrado.

            </div>


          ) : (


            clientes.map((cliente)=>(

              <div
                key={cliente.id}
                className="bg-white rounded-2xl shadow p-5"
              >


                <h2 className="text-xl font-bold">
                  👤 {cliente.nome}
                </h2>


                <p>
                  📱 {cliente.telefone}
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