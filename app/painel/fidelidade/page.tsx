"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  listarClientes,
} from "@/lib/firestore";



export default function Fidelidade(){


  const [clientes,setClientes] = useState<any[]>([]);

  const [carregando,setCarregando] = useState(true);




  useEffect(()=>{

    carregarClientes();

  },[]);




  async function carregarClientes(){


    try{

      const dados =
        await listarClientes();


      setClientes(dados);


    }catch(erro){

      console.log(
        "Erro:",
        erro
      );


    }finally{

      setCarregando(false);

    }


  }





  return (

    <main className="min-h-screen bg-slate-100 p-6">


      <h1 className="text-3xl font-bold mb-6">
        ⭐ Fidelidade
      </h1>




      <div className="bg-white rounded-3xl shadow p-6">


        <h2 className="text-xl font-bold mb-4">
          Clientes fiéis
        </h2>



        <p className="text-gray-500 mb-5">
          Controle clientes do plano mensal e quantidade de cortes.
        </p>




        {carregando ? (


          <p>
            Carregando...
          </p>



        ) : clientes.length === 0 ? (


          <div className="bg-gray-100 p-4 rounded-xl">
            Nenhum cliente cadastrado.
          </div>



        ) : (


          <div className="grid gap-4">


            {clientes.map((cliente)=>(


              <div

                key={cliente.id}

                className="border rounded-2xl p-4"

              >


                <h3 className="font-bold text-lg">
                  👤 {cliente.nome}
                </h3>


                <p>
                  📱 {cliente.telefone}
                </p>



                <div className="mt-3 bg-blue-100 p-3 rounded-xl">

                  ⭐ Cliente fidelidade

                </div>



              </div>


            ))}


          </div>


        )}



      </div>





      <Link
        href="/painel/configuracoes"
        className="block mt-6 bg-black text-white text-center p-4 rounded-xl"
      >
        Voltar
      </Link>



    </main>

  );

}