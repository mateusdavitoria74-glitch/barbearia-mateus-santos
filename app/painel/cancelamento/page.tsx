"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  listarAgendamentos,
} from "@/lib/firestore";


// TIPO DO AGENDAMENTO
type Agendamento = any;



export default function Cancelamentos(){


  const [cancelados, setCancelados] =
    useState<Agendamento[]>([]);



  const [carregando, setCarregando] =
    useState(true);





  useEffect(()=>{

    carregarCancelamentos();

  },[]);






  async function carregarCancelamentos(){


    try{


      const dados =
        await listarAgendamentos();



      const lista =
        dados.filter(
          (item: any) =>
            item.status?.toLowerCase() === "cancelado"
        );



      setCancelados(lista);



    }catch(erro){


      console.log(
        "Erro ao carregar cancelamentos:",
        erro
      );


    }finally{


      setCarregando(false);


    }


  }







  return (

    <main className="min-h-screen bg-gray-100 p-6 pb-20">



      <h1 className="text-3xl font-bold mb-6">

        ❌ Cancelamentos

      </h1>





      <section className="bg-white rounded-3xl shadow p-6">


        <h2 className="text-xl font-bold mb-5">

          Agendamentos cancelados

        </h2>






        {carregando ? (


          <div className="text-gray-500">

            Carregando...

          </div>



        ) : cancelados.length === 0 ? (



          <div className="bg-gray-100 p-4 rounded-xl text-gray-500">

            Nenhum cancelamento encontrado.

          </div>



        ) : (



          <div className="grid gap-4">



            {cancelados.map((item: Agendamento)=>(



              <div

                key={item.id}

                className="bg-white border rounded-2xl shadow p-5"

              >



                <h3 className="text-xl font-bold">

                  👤 {item.nome}

                </h3>





                <p>

                  📱 {item.telefone}

                </p>





                <p>

                  ✂️ {item.servico}

                </p>





                <p>

                  📅 {item.data}

                </p>





                <p>

                  ⏰ {item.horario}

                </p>





                <div className="mt-4 bg-red-600 text-white p-3 rounded-xl text-center font-bold">

                  Cancelado ❌

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