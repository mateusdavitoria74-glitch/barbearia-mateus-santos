"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import {
  ouvirAgendamentos,
  atualizarStatusAgendamento,
  listarClientes,
  salvarBloqueio,
  buscarPerfil,
  buscarBarbearia,
} from "@/lib/firestore";



export default function Painel() {


  const router = useRouter();



  const [agendamentos, setAgendamentos] =
    useState<any[]>([]);


  const [clientes, setClientes] =
    useState<any[]>([]);



  const [carregando, setCarregando] =
    useState(true);




  // CONTROLE DE NOVO AGENDAMENTO

  const primeiraCarga =
    useRef(true);


  const quantidadeAgendamentos =
    useRef(0);



  const audioNotificacao =
    useRef<HTMLAudioElement | null>(null);





  // DADOS DO PAINEL

  const [nomeAdmin, setNomeAdmin] =
    useState("Mateus Santos");



  const [nomeBarbearia, setNomeBarbearia] =
    useState("Barbearia Mateus Santos");






  // BLOQUEIO DE HORÁRIO

  const [dataBloqueio, setDataBloqueio] =
    useState("");



  const [inicioBloqueio, setInicioBloqueio] =
    useState("");



  const [fimBloqueio, setFimBloqueio] =
    useState("");



  const [motivoBloqueio, setMotivoBloqueio] =
    useState("");





  useEffect(()=>{


    audioNotificacao.current =
      new Audio("/notificacao.mp3");



    if(
      Notification.permission !== "granted"
    ){

      Notification.requestPermission();

    }


  },[]);

    async function carregarPerfil(){

    const perfil =
      await buscarPerfil();


    if(perfil){

      setNomeAdmin(
        perfil.nome || "Administrador"
      );

    }



    const barbearia =
      await buscarBarbearia();


    if(barbearia){

      setNomeBarbearia(
        barbearia.nome || "Barbearia"
      );

    }


  }






  async function carregarClientes(){

    const dados =
      await listarClientes();


    setClientes(
      dados
    );

  }







  useEffect(()=>{


    const verificarUsuario =
      onAuthStateChanged(

        auth,

        (usuario)=>{


          if(!usuario){


            router.push("/login");


            return;


          }



          carregarPerfil();


          carregarClientes();





          // TEMPO REAL DOS AGENDAMENTOS

          const cancelar =
            ouvirAgendamentos(

              (dados)=>{



                if(
                  !primeiraCarga.current &&
                  dados.length >
                  quantidadeAgendamentos.current
                ){



                  // TOCA SOM

                  if(
                    audioNotificacao.current
                  ){

                    audioNotificacao.current
                    .play()
                    .catch(
                      (erro)=>
                      console.log(
                        "Som bloqueado:",
                        erro
                      )
                    );

                  }




                  // NOTIFICAÇÃO DO NAVEGADOR

                  if(
                    Notification.permission === "granted"
                  ){


                    new Notification(

                      "Novo agendamento 💈",

                      {

                        body:
                        "Um cliente acabou de agendar um horário."

                      }

                    );


                  }



                }





                primeiraCarga.current =
                  false;



                quantidadeAgendamentos.current =
                  dados.length;



                setAgendamentos(
                  dados
                );



                setCarregando(
                  false
                );



              }

            );





          return ()=>{

            cancelar();

          };


        }

      );





    return ()=>{

      verificarUsuario();

    };



  },[router]);

    async function mudarStatus(
    id:string,
    status:string
  ){

    await atualizarStatusAgendamento(
      id,
      status
    );

  }





  async function bloquearHorario(){


    if(
      !dataBloqueio ||
      !inicioBloqueio ||
      !fimBloqueio
    ){

      alert(
        "Preencha data e horários"
      );

      return;

    }



    await salvarBloqueio({

      data:dataBloqueio,

      inicio:inicioBloqueio,

      fim:fimBloqueio,

      motivo:
      motivoBloqueio ||
      "Bloqueio manual",

    });



    alert(
      "Horário bloqueado!"
    );


  }






  function abrirWhatsApp(
    agendamento:any
  ){


    const numero =
      agendamento.telefone
      ?.replace(/\D/g,"");



    const mensagem =
    `Olá ${agendamento.nome}! 💈\n\n`+
    `Seu horário na ${nomeBarbearia} está confirmado.\n\n`+
    `📅 Data: ${agendamento.data}\n`+
    `⏰ Horário: ${agendamento.horario}\n`+
    `✂️ Serviço: ${agendamento.servico}`;



    window.open(

      `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`,

      "_blank"

    );


  }






  const totalClientes =
    clientes.length;



  const totalAgendamentos =
    agendamentos.length;



  const confirmados =
    agendamentos.filter(
      (a)=>
      a.status?.toLowerCase()
      === "confirmado"
    );



  const faturamento =
    confirmados.reduce(

      (total,a)=>
      total + Number(a.valor || 0),

      0

    );





  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="bg-black text-white rounded-2xl p-8 text-center mb-8">


        <div className="text-6xl">
          👤
        </div>


        <h1 className="text-3xl font-bold">

          {nomeAdmin}

        </h1>


        <p className="text-xl">

          💈 Administrador

        </p>


        <p className="text-gray-300">

          {nomeBarbearia}

        </p>



        <Link

          href="/painel/configuracoes"

          className="inline-block bg-white text-black p-3 rounded-xl mt-5 font-bold"

        >

          ⚙️ Configurações

        </Link>


      </div>





      <div className="grid md:grid-cols-3 gap-4 mb-8">


        <div className="bg-white p-5 rounded shadow">

          💰 Faturamento

          <h2 className="text-3xl font-bold">

            R$ {faturamento.toFixed(2)}

          </h2>

        </div>



        <div className="bg-white p-5 rounded shadow">

          👥 Clientes

          <h2 className="text-3xl font-bold">

            {totalClientes}

          </h2>

        </div>



        <div className="bg-white p-5 rounded shadow">

          📅 Agendamentos

          <h2 className="text-3xl font-bold">

            {totalAgendamentos}

          </h2>

        </div>


      </div>





      <section className="bg-white p-6 rounded shadow mb-8">


        <h2 className="text-2xl font-bold mb-4">

          📅 Agendamentos

        </h2>



        {carregando ? (

          <p>
            Carregando...
          </p>


        ) : (


          agendamentos.map((agendamento)=>(


            <div

              key={agendamento.id}

              className="border p-5 rounded mb-4"

            >


              <h3 className="font-bold text-xl">

                👤 {agendamento.nome}

              </h3>


              <p>
                📱 {agendamento.telefone}
              </p>


              <p>
                ✂️ {agendamento.servico}
              </p>


              <p>
                📅 {agendamento.data}
              </p>


              <p>
                ⏰ {agendamento.horario}
              </p>


              <p>
                Status: {agendamento.status}
              </p>



              <button

                onClick={()=>abrirWhatsApp(agendamento)}

                className="bg-green-600 text-white p-3 rounded w-full mt-3"

              >

                📲 WhatsApp

              </button>



              {agendamento.status === "agendado" && (

                <button

                  onClick={()=>
                    mudarStatus(
                      agendamento.id,
                      "Confirmado"
                    )
                  }

                  className="bg-blue-600 text-white p-3 rounded w-full mt-3"

                >

                  Confirmar corte

                </button>

              )}



            </div>


          ))

        )}


      </section>


    </main>

  );

}
