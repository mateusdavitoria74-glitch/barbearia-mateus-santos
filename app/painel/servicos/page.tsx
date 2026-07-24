"use client";

import { useEffect, useState } from "react";
import {
  salvarServico,
  listarServicos,
} from "@/lib/firestore";

export default function Servicos() {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [duracao, setDuracao] = useState("");
  const [status, setStatus] = useState("Ativo");

  const [servicos, setServicos] = useState<any[]>([]);

  async function carregarServicos() {
    const dados = await listarServicos();
    setServicos(dados);
  }

  useEffect(() => {
    carregarServicos();
  }, []);

  async function salvar() {
    if (!nome || !valor || !duracao) {
      alert("Preencha todos os campos.");
      return;
    }

    await salvarServico({
      nome,
      valor: Number(valor),
      duracao: Number(duracao),
      status,
    });

    alert("Serviço cadastrado com sucesso!");

    setNome("");
    setValor("");
    setDuracao("");
    setStatus("Ativo");

    carregarServicos();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          ✂️ Serviços
        </h1>

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Novo Serviço
          </h2>

          <input
            className="w-full border rounded p-3 mb-3"
            placeholder="Nome do serviço"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="number"
            className="w-full border rounded p-3 mb-3"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <input
            type="number"
            className="w-full border rounded p-3 mb-3"
            placeholder="Duração (minutos)"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
          />

          <select
            className="w-full border rounded p-3 mb-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Ativo</option>
            <option>Inativo</option>
          </select>

          <button
            onClick={salvar}
            className="w-full bg-black text-white rounded p-3 hover:bg-gray-800"
          >
            Salvar Serviço
          </button>

        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Serviços cadastrados
          </h2>

          {servicos.length === 0 ? (

            <p className="text-gray-500">
              Nenhum serviço cadastrado.
            </p>

          ) : (

            <div className="space-y-4">

              {servicos.map((servico) => (

                <div
                  key={servico.id}
                  className="border rounded-lg p-4"
                >

                  <h3 className="text-xl font-bold">
                    ✂️ {servico.nome}
                  </h3>

                  <p>
                    💰 R$ {servico.valor}
                  </p>

                  <p>
                    ⏱️ {servico.duracao} minutos
                  </p>

                  <p>
                    Status: {servico.status}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}