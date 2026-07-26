"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  salvarBarbearia,
  buscarBarbearia,
} from "@/lib/firestore";

export default function Barbearia() {

  const router = useRouter();

  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [horario, setHorario] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    const dados =
      await buscarBarbearia();

    if (dados) {

      setNome(dados.nome || "");
      setEndereco(dados.endereco || "");
      setHorario(dados.horario || "");

    }

  }

  async function salvar() {

    await salvarBarbearia({

      nome,
      endereco,
      horario,

    });

    alert("Dados da barbearia salvos com sucesso!");

  }

  return (

    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          💈 Dados da Barbearia
        </h1>

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Nome da Barbearia"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Endereço"
          value={endereco}
          onChange={(e) =>
            setEndereco(e.target.value)
          }
        />

        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Horário de funcionamento"
          value={horario}
          onChange={(e) =>
            setHorario(e.target.value)
          }
        />

        <button
          onClick={salvar}
          className="w-full bg-black text-white p-3 rounded-xl font-bold"
        >
          Salvar alterações
        </button>

        <button
          onClick={() => router.back()}
          className="w-full bg-gray-300 p-3 rounded-xl font-bold mt-4"
        >
          ⬅ Voltar
        </button>

      </div>

    </main>

  );

}