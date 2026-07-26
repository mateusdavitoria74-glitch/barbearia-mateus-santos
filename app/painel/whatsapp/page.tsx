"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  buscarWhatsApp,
  salvarWhatsApp,
} from "@/lib/firestore";



export default function WhatsApp(){


  const [numero,setNumero] = useState("");

  const [mensagem,setMensagem] = useState(
    "Olá! Seu horário na Barbearia Mateus Santos está confirmado 💈"
  );


  const [carregando,setCarregando] = useState(true);





  useEffect(()=>{

    carregarWhatsApp();

  },[]);






  async function carregarWhatsApp(){


    try{


      const dados =
        await buscarWhatsApp();



      if(dados){


        setNumero(
          dados.numero || ""
        );


        setMensagem(
          dados.mensagem ||
          "Olá! Seu horário está confirmado 💈"
        );


      }



    }catch(erro){


      console.log(
        "Erro ao carregar WhatsApp:",
        erro
      );


    }finally{


      setCarregando(false);


    }


  }








  async function salvar(){


    try{


      await salvarWhatsApp({

        numero,

        mensagem,

      });



      alert(
        "WhatsApp salvo com sucesso!"
      );



    }catch(erro){


      console.log(
        erro
      );


      alert(
        "Erro ao salvar WhatsApp"
      );


    }


  }







  return (


    <main className="min-h-screen bg-gray-100 p-6">



      <h1 className="text-3xl font-bold mb-6">

        📲 WhatsApp

      </h1>





      <section className="bg-white rounded-3xl shadow p-6">


        <h2 className="text-xl font-bold mb-5">

          Configuração de mensagens

        </h2>





        {carregando ? (


          <p>
            Carregando...
          </p>



        ) : (


          <div className="space-y-4">



            <div>

              <label className="font-bold">

                Número do WhatsApp

              </label>


              <input

                className="w-full border p-3 rounded-xl mt-2"

                placeholder="Ex: 27999999999"

                value={numero}

                onChange={(e)=>
                  setNumero(e.target.value)
                }

              />

            </div>







            <div>

              <label className="font-bold">

                Mensagem automática

              </label>


              <textarea

                className="w-full border p-3 rounded-xl mt-2"

                rows={5}

                value={mensagem}

                onChange={(e)=>
                  setMensagem(e.target.value)
                }

              />

            </div>







            <button

              onClick={salvar}

              className="w-full bg-green-600 text-white p-3 rounded-xl font-bold"

            >

              💾 Salvar WhatsApp

            </button>




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