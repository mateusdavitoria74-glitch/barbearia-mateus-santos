"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  listarAgendamentos,
  atualizarStatusAgendamento,
} from "@/lib/firestore";

type Agendamento = {
  id: string;
  nome?: string;
  telefone?: string;
  servico?: string;
  data?: string;
  horario?: string;
  status?: string;
};

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] =
    useState<Agendamento | null>(null);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  async function carregarAgendamentos() {
    try {
      setCarregando(true);

      const dados = await listarAgendamentos();

      const lista = dados as Agendamento[];

      lista.sort((a, b) => {
        const dataA = `${a.data || ""} ${a.horario || ""}`;
        const dataB = `${b.data || ""} ${b.horario || ""}`;

        return dataA.localeCompare(dataB);
      });

      setAgendamentos(lista);
    } catch (erro) {
      console.log("Erro ao carregar agendamentos:", erro);
    } finally {
      setCarregando(false);
    }
  }

  async function alterarStatus(
    id: string,
    status: string
  ) {
    try {
      await atualizarStatusAgendamento(id, status);

      setAgendamentos((lista) =>
        lista.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSelecionado((item) =>
        item && item.id === id
          ? {
              ...item,
              status,
            }
          : item
      );
    } catch (erro) {
      console.log("Erro ao atualizar status:", erro);
    }
  }

  function formatarData(data?: string) {
    if (!data) return "Não informada";

    const partes = data.split("-");

    if (partes.length !== 3) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // ===============================
  // WHATSAPP
  // ===============================

  function enviarWhatsApp(agendamento: Agendamento) {
    if (!agendamento.telefone) {
      alert("Esse cliente não possui WhatsApp cadastrado.");
      return;
    }

    // Remove espaços, parênteses, hífens etc.
    let telefone = agendamento.telefone.replace(/\D/g, "");

    // Se o número tiver somente DDD + telefone,
    // adiciona o código do Brasil.
    if (telefone.length === 10 || telefone.length === 11) {
      telefone = "55" + telefone;
    }

    const mensagem = `
Olá, ${agendamento.nome || "cliente"}! 💈

Seu horário na Barbearia Mateus Santos está confirmado! ✂️

📅 Data: ${formatarData(agendamento.data)}
🕒 Horário: ${agendamento.horario || "Não informado"}
✂️ Serviço: ${agendamento.servico || "Não informado"}

Aguardamos você! 😊

Barbearia Mateus Santos 💈
`.trim();

    const linkWhatsApp =
      `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(linkWhatsApp, "_blank");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-4xl mx-auto">

        {/* CABEÇALHO */}

        <div className="flex items-center justify-between mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              📅 Agendamentos
            </h1>

            <p className="text-gray-500 mt-1">
              Gerencie os horários dos clientes
            </p>
          </div>

        </div>

        {/* CARREGANDO */}

        {carregando && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            Carregando agendamentos...
          </div>
        )}

        {/* NENHUM AGENDAMENTO */}

        {!carregando &&
          agendamentos.length === 0 && (

            <div className="bg-white rounded-2xl shadow p-6 text-center">

              <p className="text-lg font-bold">
                Nenhum agendamento cadastrado.
              </p>

              <p className="text-gray-500 mt-2">
                Quando um cliente fizer um agendamento,
                ele aparecerá aqui.
              </p>

            </div>

          )}

        {/* LISTA */}

        {!carregando &&
          agendamentos.length > 0 && (

            <div className="grid gap-4">

              {agendamentos.map(
                (agendamento) => (

                  <button
                    key={agendamento.id}
                    type="button"
                    onClick={() =>
                      setSelecionado(agendamento)
                    }
                    className="w-full text-left bg-white rounded-2xl shadow p-5 hover:shadow-lg hover:scale-[1.01] transition cursor-pointer"
                  >

                    <div className="flex justify-between items-start gap-4">

                      <div>

                        <h2 className="text-xl font-bold">
                          👤{" "}
                          {agendamento.nome ||
                            "Cliente"}
                        </h2>

                        <p className="text-gray-600 mt-2">
                          📅{" "}
                          {formatarData(
                            agendamento.data
                          )}
                        </p>

                        <p className="text-gray-600">
                          🕒{" "}
                          {agendamento.horario ||
                            "Horário não informado"}
                        </p>

                      </div>

                      <span className="text-blue-600 font-bold text-sm">
                        Ver detalhes →
                      </span>

                    </div>

                    <div className="mt-4 border-t pt-3">

                      <p className="font-medium">
                        ✂️{" "}
                        {agendamento.servico ||
                          "Serviço não informado"}
                      </p>

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        {/* VOLTAR */}

        <Link
          href="/painel"
          className="block mt-8 bg-black text-white text-center p-4 rounded-xl font-bold"
        >
          ⬅ Voltar ao painel
        </Link>

      </div>

      {/* DETALHES */}

      {selecionado && (

        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50"
          onClick={() =>
            setSelecionado(null)
          }
        >

          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                📋 Detalhes
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelecionado(null)
                }
                className="text-gray-500 text-2xl"
              >
                ✕
              </button>

            </div>

            <div className="mt-6 space-y-4">

              {/* CLIENTE */}

              <div>
                <p className="text-gray-500 text-sm">
                  Cliente
                </p>

                <p className="font-bold text-lg">
                  👤{" "}
                  {selecionado.nome ||
                    "Não informado"}
                </p>
              </div>

              {/* WHATSAPP */}

              <div>
                <p className="text-gray-500 text-sm">
                  WhatsApp
                </p>

                <p className="font-bold">
                  📱{" "}
                  {selecionado.telefone ||
                    "Não informado"}
                </p>
              </div>

              {/* SERVIÇO */}

              <div>
                <p className="text-gray-500 text-sm">
                  Serviço
                </p>

                <p className="font-bold">
                  ✂️{" "}
                  {selecionado.servico ||
                    "Não informado"}
                </p>
              </div>

              {/* DATA */}

              <div>
                <p className="text-gray-500 text-sm">
                  Data
                </p>

                <p className="font-bold">
                  📅{" "}
                  {formatarData(
                    selecionado.data
                  )}
                </p>
              </div>

              {/* HORÁRIO */}

              <div>
                <p className="text-gray-500 text-sm">
                  Horário
                </p>

                <p className="font-bold">
                  🕒{" "}
                  {selecionado.horario ||
                    "Não informado"}
                </p>
              </div>

              {/* STATUS */}

              <div>
                <p className="text-gray-500 text-sm">
                  Status
                </p>

                <p className="font-bold">
                  {selecionado.status ||
                    "Agendado"}
                </p>
              </div>

            </div>

            {/* BOTÕES */}

            <div className="grid gap-3 mt-6">

              {/* WHATSAPP */}

              <button
                type="button"
                onClick={() =>
                  enviarWhatsApp(selecionado)
                }
                className="bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700"
              >
                📲 Enviar confirmação pelo WhatsApp
              </button>

              {/* CONFIRMAR */}

              <button
                type="button"
                onClick={() =>
                  alterarStatus(
                    selecionado.id,
                    "Confirmado"
                  )
                }
                className="bg-green-800 text-white p-3 rounded-xl font-bold"
              >
                ✅ Confirmar
              </button>

              {/* FINALIZAR */}

              <button
                type="button"
                onClick={() =>
                  alterarStatus(
                    selecionado.id,
                    "Finalizado"
                  )
                }
                className="bg-blue-600 text-white p-3 rounded-xl font-bold"
              >
                ✂️ Finalizar corte
              </button>

              {/* CANCELAR */}

              <button
                type="button"
                onClick={() =>
                  alterarStatus(
                    selecionado.id,
                    "Cancelado"
                  )
                }
                className="bg-red-600 text-white p-3 rounded-xl font-bold"
              >
                ❌ Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}