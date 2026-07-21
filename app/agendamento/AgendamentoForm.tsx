"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  salvarAgendamento,
  listarAgendamentos,
} from "@/lib/firestore";


export default function AgendamentoForm() {

  const searchParams = useSearchParams();

  const servicoSelecionado =
    searchParams.get("servico") || "Corte social";


  const [nome, setNome] = useState("");
  const [servico, setServico] = useState(servicoSelecionado);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState("");


  const horarios = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];


  async function buscarHorarios() {

    const agendamentos = await listarAgendamentos();

    const ocupados = agendamentos
      .filter(
        (item: any) =>
          item.data === data &&
          item.status !== "Cancelado"
      )
      .map(
        (item: any) =>
          item.horario
      );


    setHorariosOcupados(ocupados);

  }


  useEffect(() => {

    if (data) {
      buscarHorarios();
    }

  }, [data]);


  async function confirmarAgendamento() {


    if (!nome || !data || !horario) {

      setMensagem(
        "Preencha nome, data e horário."
      );

      return;

    }


    if (horariosOcupados.includes(horario)) {

      setMensagem(
        "Esse horário já está ocupado."
      );

      return;

    }


    const novoAgendamento = {

      nome,
      servico,
      data,
      horario,
      status: "Agendado",
      criadoEm: new Date(),

    };


    try {

      await salvarAgendamento(
        novoAgendamento
      );


      setMensagem(
        "Agendamento confirmado!"
      );


      setNome("");
      setData("");
      setHorario("");


    } catch (erro) {

      console.log(erro);

      setMensagem(
        "Erro ao salvar agendamento."
      );

    }

  }


  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <h1 className="text-3xl font-bold text-center">
        Agendar Horário
      </h1>



      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow">


        <label className="block mb-2">
          Nome do cliente
        </label>


        <input

          className="w-full border p-3 rounded mb-4"

          placeholder="Digite seu nome"

          value={nome}

          onChange={(e) =>
            setNome(e.target.value)
          }

        />



        <label className="block mb-2">
          Serviço escolhido
        </label>



        <select

          className="w-full border p-3 rounded mb-4"

          value={servico}

          onChange={(e) =>
            setServico(e.target.value)
          }

        >

          <option>Corte social</option>
          <option>Corte navalhado</option>
          <option>Low Fade</option>
          <option>Mid Fade</option>
          <option>Corte + barba</option>
          <option>Pigmentação</option>
          <option>Luzes</option>
          <option>Nevou</option>

        </select>



        <label className="block mb-2">
          Data
        </label>


        <input

          type="date"

          className="w-full border p-3 rounded mb-4"

          value={data}

          onChange={(e) =>
            setData(e.target.value)
          }

        />



        <label className="block mb-2">
          Horário
        </label>



        <select

          className="w-full border p-3 rounded mb-4"

          value={horario}

          onChange={(e) =>
            setHorario(e.target.value)
          }

        >


          <option value="">
            Escolha um horário
          </option>



          {horarios.map((hora) => (

            <option

              key={hora}

              value={hora}

              disabled={horariosOcupados.includes(hora)}

            >

              {hora}

              {horariosOcupados.includes(hora)
                ? " - Ocupado"
                : ""}

            </option>

          ))}


        </select>



        <button

          onClick={confirmarAgendamento}

          className="w-full bg-black text-white p-3 rounded"

        >

          Confirmar Agendamento

        </button>



        {mensagem && (

          <p className="mt-4 text-center font-bold">

            {mensagem}

          </p>

        )}


      </div>


    </main>

  );

}