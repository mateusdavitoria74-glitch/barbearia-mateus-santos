"use client";

import { useEffect, useState } from "react";

type Agendamento = {
  nome: string;
  servico: string;
  horario: string;
  status?: string;
};

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    const dados = JSON.parse(
      localStorage.getItem("agendamentos") || "[]"
    );

    setAgendamentos(dados);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center">
        Meus Agendamentos
      </h1>

      {agendamentos.length === 0 ? (
        <p className="text-center mt-8">
          Você ainda não possui agendamentos.
        </p>
      ) : (
        <div className="max-w-md mx-auto mt-8 space-y-4">
          {agendamentos.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow"
            >
              <h2 className="text-xl font-bold">
                {item.nome}
              </h2>

              <p>
                Serviço: {item.servico}
              </p>

              <p>
                Horário: {item.horario}
              </p>

              <p className="font-bold mt-2">
                Status: {item.status || "Agendado"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}