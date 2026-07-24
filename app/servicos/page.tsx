"use client";

import { useState } from "react";
import { salvarServico } from "@/lib/firestore";

export default function Servicos() {

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [duracao, setDuracao] = useState("");


  async function cadastrarServico() {

    try {

      if (!nome || !valor || !duracao) {
        alert("Preencha todos os campos");
        return;
      }


      const novoServico = {
        nome: nome,
        valor: Number(valor),
        duracao: Number(duracao),
      };


      console.log("Salvando serviço:", novoServico);


      await salvarServico(novoServico);


      alert("Serviço cadastrado com sucesso!");


      setNome("");
      setValor("");
      setDuracao("");


    } catch (erro) {

      console.log("Erro ao cadastrar serviço:", erro);

      alert("Erro ao cadastrar serviço");

    }

  }



  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-xl mx-auto">


        <h1 className="text-3xl font-bold mb-8">
          ✂️ Serviços
        </h1>



        <div className="bg-white rounded-lg shadow p-6">


          <h2 className="text-xl font-bold mb-4">
            Novo Serviço
          </h2>



          <input
            className="w-full border p-3 rounded mb-3"
            placeholder="Nome do serviço"
            value={nome}
            onChange={(e)=>setNome(e.target.value)}
          />



          <input
            type="number"
            className="w-full border p-3 rounded mb-3"
            placeholder="Valor"
            value={valor}
            onChange={(e)=>setValor(e.target.value)}
          />



          <input
            type="number"
            className="w-full border p-3 rounded mb-3"
            placeholder="Duração em minutos"
            value={duracao}
            onChange={(e)=>setDuracao(e.target.value)}
          />



          <button
            onClick={cadastrarServico}
            className="w-full bg-black text-white p-3 rounded"
          >
            Salvar Serviço
          </button>


        </div>


      </div>


    </main>

  );

}