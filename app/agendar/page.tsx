"use client";

import { useState } from "react";
import { salvarAgendamento, salvarCliente } from "@/lib/firestore";


const servicos = [
  { nome: "Barba", valor: 25 },
  { nome: "Barba + Pezinho", valor: 30 },
  { nome: "Corte de cabelo + Alisamento", valor: 70 },
  { nome: "Corte + Barba", valor: 50 },
  { nome: "Corte + Barba + Luzes Alinhada", valor: 100 },
  { nome: "Corte + Pigmentação", valor: 60 },
  { nome: "Navalhado", valor: 35 },
  { nome: "Corte Social", valor: 25 },
  { nome: "Nevou + Corte", valor: 120 },
];


export default function Agendar() {

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");


  async function agendar() {

    const escolhido = servicos.find(
      (item) => item.nome === servico
    );


    if (!nome || !telefone || !servico || !data || !horario) {
      alert("Preencha todos os campos");
      return;
    }


    await salvarCliente({
      nome,
      telefone,
    });


    await salvarAgendamento({

      nome,

      telefone,

      servico,

      valor: escolhido?.valor || 0,

      data,

      horario,

      status: "Agendado",

    });


    alert("Agendamento realizado com sucesso!");

    setNome("");
    setTelefone("");
    setServico("");
    setData("");
    setHorario("");

  }



  return (

    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">


      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">


        <h1 className="text-3xl font-bold text-center mb-6">
          Agende seu horário 💈
        </h1>



        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />



        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="WhatsApp"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />



        <select
          className="w-full border p-3 rounded mb-3"
          value={servico}
          onChange={(e) => setServico(e.target.value)}
        >

          <option value="">
            Escolha o serviço
          </option>


          {servicos.map((item) => (

            <option key={item.nome} value={item.nome}>

              {item.nome} - R$ {item.valor}

            </option>

          ))}


        </select>




        <input
          type="date"
          className="w-full border p-3 rounded mb-3"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />



        <input
          type="time"
          className="w-full border p-3 rounded mb-3"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
        />



        <button
          onClick={agendar}
          className="w-full bg-black text-white p-3 rounded"
        >
          Confirmar Agendamento
        </button>


      </div>


    </main>

  );

}