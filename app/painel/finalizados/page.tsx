"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  listarAgendamentos,
} from "@/lib/firestore";



type Agendamento = any;



export default function Finalizados(){


  const [finalizados,setFinalizados] =
    useState<Agendamento[]>([]);



  const [carregando,setCarregando] =
    useState(true);





  useEffect(()=>{

    carregarFinalizados();

  },[]);







  async function carregarFinalizados(){


    try{


      const dados =
        await listarAgendamentos();




      const lista =
        dados.filter(
          (item:any)=>
            item.status?.toLowerCase() === "finalizado"
        );



      setFinalizados(lista);



    }catch(erro){


      console.log(
        "Erro ao carregar finalizados:",
        erro
      );


    }finally{


      setCarregando(false);


    }


  }







  return (


    <main className="min-h-screen bg-gray-100 p-6 pb-20">



      <h1 className="text-3xl font-bold mb-6">

        ✂️ Cortes Finalizados

      </h1>






      <section className="bg-white rounded-3xl shadow p-6">



        <h2 className="text-xl font-bold mb-5">

          Histórico de atendimentos

        </h2>







        {carregando ? (


          <p className="text-gray-500">

            Carregando...

          </p>



        ) : finalizados.length === 0 ? (



          <div className="bg-gray-100 p-4 rounded-xl text-gray-500">

            Nenhum corte finalizado.

          </div>



        ) : (



          <div className="grid gap-4">



            {finalizados.map((item:Agendamento)=>(



              <div

                key={item.id}

                className="bg-white border rounded-2xl shadow-sm p-5"

              >



                <h3 className="text-xl font-bold">

                  👤 {item.nome}

                </h3>




                <p>

                  📱 {item.telefone}

                </p>




                <p>

                  ✂️ Serviço: {item.servico}

                </p>




                <p>

                  📅 Data: {item.data}

                </p>




                <p>

                  ⏰ Horário: {item.horario}

                </p>




                <p>

                  💰 Valor: R$ {item.valor}

                </p>





                <div className="mt-4 bg-green-600 text-white p-3 rounded-xl text-center font-bold">

                  Corte realizado ✅

                </div>



              </div>



            ))}



          </div>



        )}



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