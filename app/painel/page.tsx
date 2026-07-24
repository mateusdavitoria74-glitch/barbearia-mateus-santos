"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import {
  listarAgendamentos,
  atualizarStatusAgendamento,
  listarClientes,
  salvarBloqueio,
} from "@/lib/firestore";


export default function Painel() {

  const router = useRouter();


  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);


  // ===============================
  // BLOQUEIO DE HORÁRIOS
  // ===============================

  const [dataBloqueio, setDataBloqueio] = useState("");
  const [inicioBloqueio, setInicioBloqueio] = useState("");
  const [fimBloqueio, setFimBloqueio] = useState("");
  const [motivoBloqueio, setMotivoBloqueio] = useState("");



  async function carregarDados() {

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


    } catch (erro) {

      console.log(
        "Erro:",
        erro
      );


    } finally {

      setCarregando(false);

    }

  }



  async function mudarStatus(
    id: string,
    status: string
  ) {

    await atualizarStatusAgendamento(
      id,
      status
    );


    carregarDados();

  }



  async function bloquearHorario() {


    if (
      !dataBloqueio ||
      !inicioBloqueio ||
      !fimBloqueio
    ) {

      alert(
        "Preencha data e horários"
      );

      return;

    }



    await salvarBloqueio({

      data: dataBloqueio,

      inicio: inicioBloqueio,

      fim: fimBloqueio,

      motivo:
        motivoBloqueio ||
        "Bloqueio manual",

    });



    alert(
      "Horário bloqueado com sucesso!"
    );


    setDataBloqueio("");
    setInicioBloqueio("");
    setFimBloqueio("");
    setMotivoBloqueio("");

  }



  function abrirWhatsApp(
    agendamento: any
  ) {


    const numero =
      agendamento.telefone
      ?.replace(/\D/g, "");



    const mensagem =
      `Olá ${agendamento.nome}! 💈\n\n` +
      `Seu horário na Barbearia Mateus Santos está confirmado.\n\n` +
      `📅 Data: ${agendamento.data}\n` +
      `⏰ Horário: ${agendamento.horario}\n` +
      `✂️ Serviço: ${agendamento.servico}\n` +
      `💰 Valor: R$ ${agendamento.valor},00\n\n` +
      `Obrigado pela preferência!`;



    window.open(

      `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`,

      "_blank"

    );


  }



  useEffect(() => {


    const verificarUsuario =
      onAuthStateChanged(
        auth,
        (usuario) => {


          if (!usuario) {


            router.push("/login");


          } else {


            carregarDados();


          }


        }

      );



    return () =>
      verificarUsuario();



  }, [router]);



  const totalClientes =
    clientes.length;


  const totalAgendamentos =
    agendamentos.length;



  const totalConfirmados =
  agendamentos.filter(
    (a) =>
      a.status?.toLowerCase() === "confirmado"
  ).length;



  const faturamento =
  agendamentos
    .filter(
      (a) =>
        a.status?.toLowerCase() === "confirmado"
    )
    .reduce(
      (total, a) =>
        total + Number(a.valor || 0),
      0
    );



  const ticketMedio =
    totalConfirmados > 0
      ? faturamento / totalConfirmados
      : 0;

        return (

    <main className="min-h-screen bg-gray-100 p-8">


      <h1 className="text-3xl font-bold text-center">
        Painel da Barbearia
      </h1>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-8">


        <div className="bg-white rounded-lg shadow p-4 text-center">

          <p className="text-gray-500">
            💰 Faturamento
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            R$ {faturamento.toFixed(2)}
          </h2>

        </div>



        <div className="bg-white rounded-lg shadow p-4 text-center">

          <p className="text-gray-500">
            ✂️ Cortes confirmados
          </p>

          <h2 className="text-3xl font-bold">
            {totalConfirmados}
          </h2>

        </div>



        <div className="bg-white rounded-lg shadow p-4 text-center">

          <p className="text-gray-500">
            📈 Ticket médio
          </p>

          <h2 className="text-3xl font-bold">
            R$ {ticketMedio.toFixed(2)}
          </h2>

        </div>


      </div>



      <div className="grid grid-cols-2 gap-4 mb-8">


        <div className="bg-white rounded-lg shadow p-4 text-center">

          <p className="text-gray-500">
            👥 Clientes
          </p>

          <h2 className="text-3xl font-bold">
            {totalClientes}
          </h2>

        </div>



        <div className="bg-white rounded-lg shadow p-4 text-center">

          <p className="text-gray-500">
            📅 Agendamentos
          </p>

          <h2 className="text-3xl font-bold">
            {totalAgendamentos}
          </h2>

        </div>


      </div>




      {/* BLOQUEIO DE HORÁRIO */}

      <section className="bg-white p-6 rounded-lg shadow mb-8">

        <h2 className="text-2xl font-bold mb-4">
          🔒 Bloquear horário
        </h2>


        <input
          type="date"
          className="w-full border p-3 rounded mb-3"
          value={dataBloqueio}
          onChange={(e) =>
            setDataBloqueio(e.target.value)
          }
        />


        <input
          type="time"
          className="w-full border p-3 rounded mb-3"
          value={inicioBloqueio}
          onChange={(e) =>
            setInicioBloqueio(e.target.value)
          }
        />


        <input
          type="time"
          className="w-full border p-3 rounded mb-3"
          value={fimBloqueio}
          onChange={(e) =>
            setFimBloqueio(e.target.value)
          }
        />


        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Motivo"
          value={motivoBloqueio}
          onChange={(e) =>
            setMotivoBloqueio(e.target.value)
          }
        />


        <button
          onClick={bloquearHorario}
          className="w-full bg-black text-white p-3 rounded"
        >
          Bloquear horário
        </button>


      </section>





      {carregando ? (


        <div className="text-center mt-8">
          Carregando...
        </div>


      ) : (


        <div className="max-w-4xl mx-auto mt-8 grid gap-8">


          <section>

            <h2 className="text-2xl font-bold mb-4">
              👥 Clientes cadastrados
            </h2>


            <div className="grid gap-3">


              {clientes.length === 0 ? (

                <div className="bg-white p-4 rounded shadow">
                  Nenhum cliente cadastrado.
                </div>


              ) : (


                clientes.map((cliente) => (

                  <div
                    key={cliente.id}
                    className="bg-white p-4 rounded shadow"
                  >

                    <p className="font-bold">
                      👤 {cliente.nome}
                    </p>


                    <p>
                      📱 {cliente.telefone}
                    </p>


                  </div>

                ))

              )}


            </div>


          </section>





          <section>


            <h2 className="text-2xl font-bold mb-4">
              📅 Agendamentos
            </h2>



            {agendamentos.length === 0 ? (


              <div className="bg-white p-6 rounded shadow">
                Nenhum agendamento.
              </div>


            ) : (


              agendamentos
  .filter((agendamento) => {

    const hoje = new Date()
      .toISOString()
      .split("T")[0];

    return (
      agendamento.data >= hoje &&
      agendamento.status?.toLowerCase() !== "finalizado"
    );

  })
  .map((agendamento) => (


                <div
                  key={agendamento.id}
                  className="bg-white p-6 rounded-lg shadow mb-4"
                >


                  <h3 className="text-xl font-bold">
                    👤 {agendamento.nome}
                  </h3>


                  <p>
                    📱 {agendamento.telefone}
                  </p>


                  <p>
                    ✂️ {agendamento.servico}
                  </p>


                  <p>
                    💰 Valor: R$ {agendamento.valor}
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
                    onClick={() =>
                      abrirWhatsApp(agendamento)
                    }
                    className="bg-green-500 text-white p-3 rounded mt-3"
                  >
                    📲 Confirmar no WhatsApp
                  </button>





                  {agendamento.status?.toLowerCase() === "agendado" && (

                    <div className="grid gap-2 mt-4">


                      <button
                        onClick={() =>
                          mudarStatus(
                            agendamento.id,
                            "Confirmado"
                          )
                        }
                        className="bg-green-600 text-white p-3 rounded"
                      >
                        Confirmar corte
                      </button>



                      <button
                        onClick={() =>
                          mudarStatus(
                            agendamento.id,
                            "Cancelado"
                          )
                        }
                        className="bg-red-600 text-white p-3 rounded"
                      >
                        Cancelar
                      </button>


                    </div>

                  )}






                  {agendamento.status?.toLowerCase() === "confirmado" && (

  <div className="grid gap-2 mt-4">

    <div className="bg-blue-600 text-white p-3 rounded text-center">
      Corte confirmado ✅
    </div>

    <button
      onClick={() =>
        mudarStatus(
          agendamento.id,
          "Finalizado"
        )
      }
      className="bg-green-700 hover:bg-green-800 text-white p-3 rounded"
    >
      ✅ Finalizar Corte
    </button>

  </div>

)}

{agendamento.status?.toLowerCase() === "finalizado" && (

  <div className="mt-4 bg-green-700 text-white p-3 rounded text-center">
    Corte finalizado ✅
  </div>

)}






                  {agendamento.status?.toLowerCase() === "cancelado" && (

                    <div className="mt-4 bg-red-600 text-white p-3 rounded text-center">
                      Cancelado ❌
                    </div>

                  )}


                </div>


              ))

            )}


          </section>


        </div>


      )}


    </main>

  );

}