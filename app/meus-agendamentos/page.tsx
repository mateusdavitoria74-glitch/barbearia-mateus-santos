"use client";

import { useState } from "react";

import { listarAgendamentos } from "@/lib/firestore";

type Agendamento = {
  id: string;
  nome?: string;
  telefone?: string;
  servico?: string;
  data?: string;
  horario?: string;
  status?: string;
};

export default function MeusAgendamentos() {
  const [telefone, setTelefone] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  function formatarTelefone(valor: string) {
    return valor.replace(/\D/g, "");
  }

  function formatarData(data?: string) {
    if (!data) return "Não informada";

    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  async function buscarAgendamentos() {
    const telefoneLimpo = formatarTelefone(telefone);

    if (!telefoneLimpo) {
      setMensagem("Digite seu WhatsApp.");
      setAgendamentos([]);
      return;
    }

    try {
      setCarregando(true);
      setMensagem("");

      const todos = await listarAgendamentos();

      const encontrados = (todos as Agendamento[]).filter(
        (item) => {
          const telefoneAgendamento =
            formatarTelefone(item.telefone || "");

          return telefoneAgendamento === telefoneLimpo;
        }
      );

      encontrados.sort((a, b) => {
        const dataA = `${a.data || ""} ${a.horario || ""}`;
        const dataB = `${b.data || ""} ${b.horario || ""}`;

        return dataA.localeCompare(dataB);
      });

      setAgendamentos(encontrados);

      if (encontrados.length === 0) {
        setMensagem(
          "Nenhum agendamento encontrado para este WhatsApp."
        );
      }
    } catch (erro) {
      console.error(
        "Erro ao buscar agendamentos:",
        erro
      );

      setMensagem(
        "Não foi possível consultar seus agendamentos."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 pb-20">

      <div className="max-w-md mx-auto">

        {/* CABEÇALHO */}

        <div className="text-center mb-8">

          <div className="text-5xl mb-3">
            📅
          </div>

          <h1 className="text-3xl font-bold">
            Meus Agendamentos
          </h1>

          <p className="text-gray-500 mt-2">
            Consulte seus horários usando seu WhatsApp.
          </p>

        </div>


        {/* BUSCA */}

        <div className="bg-white rounded-3xl shadow p-6">

          <label className="block font-bold mb-2">
            📱 Seu WhatsApp
          </label>

          <input
            type="tel"
            placeholder="Ex: (27) 99999-9999"
            value={telefone}
            onChange={(e) =>
              setTelefone(e.target.value)
            }
            className="w-full border p-4 rounded-xl text-black bg-white"
          />

          <button
            type="button"
            onClick={buscarAgendamentos}
            disabled={carregando}
            className="w-full bg-black text-white p-4 rounded-xl font-bold mt-4 disabled:opacity-50"
          >
            {carregando
              ? "Consultando..."
              : "🔎 Consultar meus horários"}
          </button>

        </div>


        {/* MENSAGEM */}

        {mensagem && (
          <div className="bg-white rounded-2xl shadow p-5 mt-5 text-center">

            <p className="font-bold">
              {mensagem}
            </p>

          </div>
        )}


        {/* AGENDAMENTOS */}

        {agendamentos.length > 0 && (

          <div className="mt-6 space-y-4">

            <h2 className="text-xl font-bold">
              Seus horários
            </h2>

            {agendamentos.map((item) => (

              <div
                key={item.id}
                className="bg-white rounded-3xl shadow p-6"
              >

                <h3 className="text-xl font-bold">
                  👤 {item.nome || "Cliente"}
                </h3>


                <div className="mt-4 space-y-2">

                  <p>
                    ✂️{" "}
                    <strong>Serviço:</strong>{" "}
                    {item.servico ||
                      "Não informado"}
                  </p>

                  <p>
                    📅{" "}
                    <strong>Data:</strong>{" "}
                    {formatarData(item.data)}
                  </p>

                  <p>
                    🕒{" "}
                    <strong>Horário:</strong>{" "}
                    {item.horario ||
                      "Não informado"}
                  </p>

                  <p>
                    📱{" "}
                    <strong>WhatsApp:</strong>{" "}
                    {item.telefone ||
                      "Não informado"}
                  </p>

                </div>


                <div className="mt-5 border-t pt-4">

                  <p className="font-bold">
                    Status:
                  </p>

                  <span
                    className={`inline-block mt-2 px-4 py-2 rounded-full font-bold ${
                      item.status === "Cancelado"
                        ? "bg-red-100 text-red-700"
                        : item.status === "Confirmado"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Finalizado"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status || "Agendado"}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}