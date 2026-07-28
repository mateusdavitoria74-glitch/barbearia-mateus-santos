"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { listarClientes } from "@/lib/firestore";

type Cliente = {
  id: string;
  nome?: string;
  telefone?: string;
};

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] =
    useState<Cliente | null>(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      setCarregando(true);

      const dados = await listarClientes();

      setClientes(dados as Cliente[]);
    } catch (erro) {
      console.log(
        "Erro ao carregar clientes:",
        erro
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">

      <div className="max-w-4xl mx-auto">

        {/* CABEÇALHO */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold">
            👥 Clientes
          </h1>

          <p className="text-gray-500 mt-1">
            Clientes cadastrados na barbearia
          </p>

        </div>


        {/* CARREGANDO */}

        {carregando && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            Carregando clientes...
          </div>
        )}


        {/* SEM CLIENTES */}

        {!carregando &&
          clientes.length === 0 && (

            <div className="bg-white rounded-2xl shadow p-6 text-center">

              <p className="text-lg font-bold">
                Nenhum cliente cadastrado.
              </p>

              <p className="text-gray-500 mt-2">
                Os clientes aparecerão aqui quando
                forem cadastrados.
              </p>

            </div>

          )}


        {/* LISTA DE CLIENTES */}

        {!carregando &&
          clientes.length > 0 && (

            <div className="grid gap-4">

              {clientes.map((cliente) => (

                <button
                  key={cliente.id}
                  type="button"
                  onClick={() =>
                    setSelecionado(cliente)
                  }
                  className="w-full text-left bg-white rounded-2xl shadow p-5 hover:shadow-lg hover:scale-[1.01] transition cursor-pointer"
                >

                  <div className="flex justify-between items-center gap-4">

                    <div>

                      <h2 className="text-xl font-bold">
                        👤{" "}
                        {cliente.nome ||
                          "Cliente"}
                      </h2>

                      <p className="text-gray-600 mt-2">
                        📱{" "}
                        {cliente.telefone ||
                          "WhatsApp não informado"}
                      </p>

                    </div>

                    <span className="text-blue-600 font-bold text-sm">
                      Ver detalhes →
                    </span>

                  </div>

                </button>

              ))}

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


      {/* MODAL DO CLIENTE */}

      {selecionado && (

        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50"
          onClick={() =>
            setSelecionado(null)
          }
        >

          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-xl p-6"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex justify-between items-center">

              <h2 className="text-2xl font-bold">
                👤 Cliente
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


            <div className="mt-6 space-y-5">

              <div>

                <p className="text-gray-500 text-sm">
                  Nome
                </p>

                <p className="font-bold text-lg">
                  {selecionado.nome ||
                    "Não informado"}
                </p>

              </div>


              <div>

                <p className="text-gray-500 text-sm">
                  WhatsApp
                </p>

                <p className="font-bold text-lg">
                  📱{" "}
                  {selecionado.telefone ||
                    "Não informado"}
                </p>

              </div>

            </div>


            {/* WHATSAPP */}

            {selecionado.telefone && (

              <a
                href={`https://wa.me/${selecionado.telefone.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-6 bg-green-600 text-white text-center p-3 rounded-xl font-bold"
              >
                📲 Falar no WhatsApp
              </a>

            )}


            <button
              type="button"
              onClick={() =>
                setSelecionado(null)
              }
              className="w-full mt-3 bg-gray-200 p-3 rounded-xl font-bold"
            >
              Fechar
            </button>

          </div>

        </div>

      )}

    </main>
  );
}