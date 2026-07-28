"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  listarServicos,
  buscarBarbearia,
} from "@/lib/firestore";


type Servico = {

  id: string;

  nome: string;

  valor: number;

  duracao: number;

  status: string;

};



type Barbearia = {

  nome?: string;

  slogan?: string;

  endereco?: string;

  maps?: string;

  telefone?: string;

  instagram?: string;

  logo?: string;

};




export default function Home() {


  const [servicos, setServicos] =
    useState<Servico[]>([]);




  const [barbearia, setBarbearia] =
    useState<Barbearia>({

      nome: "Mateus Santos",

      slogan: "Seu estilo, nosso cuidado.",

      endereco:
        "Rua Vinte e Cinco de Dezembro, Nº 8",

      maps: "",

      telefone: "",

      instagram: "",

      logo: "/logo.png",

    });





  useEffect(() => {


    carregarServicos();

    carregarBarbearia();


  }, []);





  async function carregarServicos() {


    try {


      const lista =
        await listarServicos();



      setServicos(
        lista as Servico[]
      );



    } catch (erro) {


      console.log(erro);


    }


  }





  async function carregarBarbearia() {


    try {


      const dados =
        await buscarBarbearia();



      if (dados) {


        setBarbearia(dados);


      }



    } catch (erro) {


      console.log(erro);


    }


  }

  
  return (

    <main className="min-h-screen bg-gray-100 pb-20">



      <section className="bg-black text-white p-10 text-center rounded-b-3xl">



        <img

          src={
            barbearia.logo || "/logo.png"
          }

          className="w-28 h-28 rounded-full object-cover mx-auto shadow"

          alt="Logo"

        />




        <h1 className="text-3xl font-bold mt-4">


          {barbearia.nome}


        </h1>





        <p className="mt-4 text-gray-300">


          {barbearia.slogan}


        </p>





        <Link

          href="/agendamento"

          className="block mt-8 bg-green-600 p-4 rounded-xl font-bold text-lg"

        >

          ✂️ Agendar horário

        </Link>



      </section>







      <section className="p-5">


        <Link

          href="/meus-agendamentos"

          className="bg-white shadow rounded-xl p-5 text-center font-bold block"

        >

          📅

          <br />

          Meus horários


        </Link>


      </section>








      {/* Serviços */}



      <section className="p-5">



        <h2 className="text-2xl font-bold mb-5 text-center">


          Nossos serviços


        </h2>






        <div className="grid gap-4">





          {servicos.length === 0 ? (



            <div className="bg-white rounded-xl shadow p-5 text-center text-gray-500">


              Nenhum serviço cadastrado.


            </div>




          ) : (




            servicos

              .filter(
                (servico) =>
                  servico.status === "Ativo"
              )

              .map(
                (servico) => (



                  <div

                    key={
                      servico.id
                    }

                    className="bg-white rounded-xl shadow p-5 flex justify-between items-center"

                  >



                    <div>



                      <p className="font-bold">


                        {servico.nome}


                      </p>




                      <p className="text-sm text-gray-500">


                        {servico.duracao} min


                      </p>



                    </div>





                    <span className="text-green-600 font-bold">


                      R$ {servico.valor.toFixed(2).replace(".", ",")}


                    </span>



                  </div>



                )

              )



          )}




        </div>



      </section>

      
      {/* Localização */}


      <section className="bg-gray-200 p-6 text-center">


        <h2 className="text-xl font-bold">


          📍 Localização


        </h2>




        <p className="mt-3">


          {barbearia.endereco}


        </p>





        <a

          href={
            barbearia.maps || "#"
          }

          target="_blank"

          rel="noopener noreferrer"

          className="inline-block mt-5 bg-blue-600 text-white p-3 rounded-xl font-bold"

        >

          Abrir localização


        </a>



      </section>







      {/* WhatsApp */}



      <section className="p-6 text-center">


        <h2 className="font-bold text-xl">


          📲 WhatsApp


        </h2>





        <a

          href={`https://wa.me/${barbearia.telefone}`}

          target="_blank"

          rel="noopener noreferrer"

          className="inline-block mt-4 bg-green-600 text-white px-8 py-3 rounded-xl font-bold"

        >

          Falar agora


        </a>



      </section>







      <footer className="bg-black text-white text-center p-5">


        © {barbearia.nome} 💈


      </footer>





    </main>

  );

}
