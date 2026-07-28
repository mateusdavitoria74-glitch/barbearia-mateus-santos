"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  listarAgendamentos,
  listarClientes,
} from "@/lib/firestore";

export default function Painel() {

  const [totalAgendamentos, setTotalAgendamentos] =
    useState(0);

  const [totalClientes, setTotalClientes] =
    useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {

    try {

      const agendamentos =
        await listarAgendamentos();

      const clientes =
        await listarClientes();

      setTotalAgendamentos(
        agendamentos.length
      );

      setTotalClientes(
        clientes.length
      );

    } catch (erro) {

      console.log(
        "Erro ao carregar painel:",
        erro
      );

    }

  }

  return (

    <main className="min-h-screen bg-gray-100 p-6">

      {/* CABEÇALHO */}

      <div className="bg-white rounded-3xl shadow p-6 text-center mb-6">

        <div className="flex flex-col items-center gap-3">

          <img
            src="/logo.png"
            alt="Barbearia Mateus Santos"
            className="w-28 h-28 rounded-full object-cover shadow"
          />

          <h1 className="text-3xl font-bold">
            Barbearia Mateus Santos 💈
          </h1>

        </div>

        <p className="text-gray-500 mt-2">
          Painel Administrativo
        </p>

      </div>

      {/* CARDS */}

      <div className="grid gap-4 md:grid-cols-2">

        {/* AGENDAMENTOS */}

        <Link
          href="/painel/agendamento"
          className="bg-white rounded-3xl shadow p-6 block cursor-pointer hover:shadow-xl active:scale-95 transition"
        >

          <h2 className="text-xl font-bold">
            📅 Agendamentos
          </h2>

          <p className="text-gray-500 mt-2">
            {totalAgendamentos} horários cadastrados
          </p>

          <p className="text-blue-600 font-bold mt-4">
            Ver agendamentos →
          </p>

        </Link>

                {/* CLIENTES */}

        <Link
          href="/painel/clientes"
          className="bg-white rounded-3xl shadow p-6 block cursor-pointer hover:shadow-xl active:scale-95 transition"
        >

          <h2 className="text-xl font-bold">
            👥 Clientes
          </h2>

          <p className="text-gray-500 mt-2">
            {totalClientes} clientes cadastrados
          </p>

          <p className="text-blue-600 font-bold mt-4">
            Ver clientes →
          </p>

        </Link>

      </div>

      {/* ACESSOS */}

      <div className="grid gap-4 mt-6">

        <Link
          href="/painel/configuracoes"
          className="bg-black text-white p-5 rounded-3xl text-center font-bold hover:bg-gray-800 transition"
        >
          ⚙️ Configurações
        </Link>

        <Link
          href="/painel/servicos"
          className="bg-white p-5 rounded-3xl shadow text-center font-bold hover:shadow-lg transition"
        >
          💈 Gerenciar Serviços
        </Link>

        <Link
          href="/painel/horarios"
          className="bg-white p-5 rounded-3xl shadow text-center font-bold hover:shadow-lg transition"
        >
          🕒 Horários
        </Link>

      </div>

            {/* RODAPÉ */}

      <div className="text-center text-gray-400 text-sm mt-10">

        Painel Administrativo • Barbearia Mateus Santos

      </div>

    </main>

  );

}