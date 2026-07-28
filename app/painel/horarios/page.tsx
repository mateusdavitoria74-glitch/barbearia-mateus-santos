"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  salvarHorarios,
  buscarHorarios,
} from "@/lib/firestore";

export default function Horarios() {

  const [inicio, setInicio] = useState("10:00");
const [fim, setFim] = useState("17:00");

const [dias, setDias] = useState({
  segunda: false,
  terca: true,
  quarta: true,
  quinta: true,
  sexta: true,
  sabado: true,
  domingo: false,
});

  useEffect(() => {

    carregarHorarios();

  }, []);

  async function carregarHorarios() {

    try {

      const dados = await buscarHorarios();

      if (dados) {

        setInicio(dados.inicio || "10:00");
        setFim(dados.fim || "17:00");

      }

    } catch (erro) {

      console.log(erro);

    }

  }

  async function salvar() {

  try {await salvarHorarios({

  inicio,
  fim,
  dias,

});

    

    console.log("Horários salvos com sucesso!");

    alert("Horários salvos com sucesso!");

  } catch (erro: any) {

    console.error("Erro ao salvar horários:");

    console.error(erro);

    console.error(erro?.code);

    console.error(erro?.message);

    alert(
      "Erro ao salvar.\n\nVeja o Console (F12)."
    );

  }

}

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="text-3xl font-bold mb-6">

        🕒 Disponibilidade

      </h1>

      <section className="bg-white rounded-3xl shadow p-6 mb-6">

        <h2 className="text-xl font-bold mb-4">

          Horário de atendimento

        </h2>

        <div className="grid gap-4">

          <div>

            <label className="text-gray-500">

              Abertura

            </label>

            <input
              type="time"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1"
            />

          </div>

          <div>

            <label className="text-gray-500">

              Fechamento

            </label>

            <input
              type="time"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1"
            />

          </div>

        </div>

      </section>

      <section className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-xl font-bold mb-4">

          📅 Dias de atendimento

        </h2>

        <div className="grid gap-3">

          {Object.entries(dias).map(([dia, aberto]) => (

  <div
    key={dia}
    className="flex justify-between items-center bg-slate-100 p-4 rounded-xl"
  >

    <span className="font-bold capitalize">
      {dia}
    </span>

    <button
      onClick={() =>
        setDias({
          ...dias,
          [dia]: !aberto,
        })
      }
      className={`px-4 py-2 rounded-xl font-bold ${
        aberto
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      {aberto ? "Aberto" : "Fechado"}
    </button>

  </div>

))}
        </div>

      </section>

      <button
        onClick={salvar}
        className="w-full bg-black text-white p-4 rounded-xl font-bold mt-6"
      >

        💾 Salvar horários

      </button>

      <Link
        href="/painel/configuracoes"
        className="block mt-4 bg-gray-300 text-center p-4 rounded-xl font-bold"
      >

        ⬅ Voltar

      </Link>

    </main>

  );

}