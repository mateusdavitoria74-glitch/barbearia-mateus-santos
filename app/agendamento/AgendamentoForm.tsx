"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  salvarAgendamento,
  listarAgendamentos,
  buscarHorarios,
  listarServicos,
} from "@/lib/firestore";

type Servico = {
  id: string;
  nome: string;
  valor: number;
  duracao: number;
  status: string;
};

type Agendamento = {
  id?: string;
  nome: string;
  telefone: string;
  servico: string;
  data: string;
  horario: string;
  status: string;
};

export default function AgendamentoForm() {
  const searchParams = useSearchParams();

  const servicoSelecionado =
    searchParams.get("servico") || "";

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] =
    useState(servicoSelecionado);

  const [data, setData] = useState("");
  const [horario, setHorario] =
    useState("");

  const [servicos, setServicos] =
    useState<Servico[]>([]);

  const [agendamentosDoDia, setAgendamentosDoDia] =
    useState<Agendamento[]>([]);

  const [mensagem, setMensagem] =
    useState("");

  const [whatsappLink, setWhatsappLink] =
    useState("");

  const [agendamentoConfirmado, setAgendamentoConfirmado] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const [inicio, setInicio] =
    useState("10:00");

  const [fim, setFim] =
    useState("17:00");

  const [diasFuncionamento, setDiasFuncionamento] =
    useState({
      segunda: false,
      terca: true,
      quarta: true,
      quinta: true,
      sexta: true,
      sabado: true,
      domingo: false,
    });

  // ===============================
  // CARREGAR SERVIÇOS
  // ===============================

  useEffect(() => {
    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {
      const dados = await listarServicos();

      const servicosAtivos =
        dados.filter(
          (item: any) =>
            item.status === "Ativo"
        );

      setServicos(
        servicosAtivos as Servico[]
      );

      if (
        servicoSelecionado &&
        servicosAtivos.some(
          (item: any) =>
            item.nome ===
            servicoSelecionado
        )
      ) {
        setServico(
          servicoSelecionado
        );
      } else if (
        servicosAtivos.length > 0
      ) {
        setServico(
          servicosAtivos[0].nome
        );
      }
    } catch (erro) {
      console.error(
        "Erro ao carregar serviços:",
        erro
      );

      setMensagem(
        "Erro ao carregar os serviços."
      );
    }
  }

  // ===============================
  // CARREGAR HORÁRIOS
  // ===============================

  useEffect(() => {
    carregarConfiguracaoHorarios();
  }, []);

  async function carregarConfiguracaoHorarios() {
    try {
      const dados =
        await buscarHorarios();

      if (dados) {
        setInicio(
          dados.inicio || "10:00"
        );

        setFim(
          dados.fim || "17:00"
        );

        if (dados.dias) {
          setDiasFuncionamento({
            segunda:
              dados.dias.segunda ??
              false,

            terca:
              dados.dias.terca ??
              true,

            quarta:
              dados.dias.quarta ??
              true,

            quinta:
              dados.dias.quinta ??
              true,

            sexta:
              dados.dias.sexta ??
              true,

            sabado:
              dados.dias.sabado ??
              true,

            domingo:
              dados.dias.domingo ??
              false,
          });
        }
      }
    } catch (erro) {
      console.error(
        "Erro ao carregar horários:",
        erro
      );
    }
  }

  // ===============================
  // HORA -> MINUTOS
  // ===============================

  function horaParaMinutos(
    hora: string
  ) {
    const partes =
      hora.split(":");

    const horas =
      Number(partes[0]);

    const minutos =
      Number(partes[1]);

    return (
      horas * 60 +
      minutos
    );
  }

  // ===============================
  // MINUTOS -> HORA
  // ===============================

  function minutosParaHora(
    minutos: number
  ) {
    const horas =
      Math.floor(minutos / 60);

    const minutosRestantes =
      minutos % 60;

    return `${horas
      .toString()
      .padStart(2, "0")}:${minutosRestantes
      .toString()
      .padStart(2, "0")}`;
  }

  // ===============================
  // DURAÇÃO DO SERVIÇO SELECIONADO
  // ===============================

  function obterDuracaoServico() {
    const servicoAtual =
      servicos.find(
        (item) =>
          item.nome === servico
      );

    const duracao =
      Number(
        servicoAtual?.duracao
      );

    if (
      Number.isFinite(duracao) &&
      duracao > 0
    ) {
      return duracao;
    }

    return 30;
  }

  // ===============================
  // DURAÇÃO DE UM AGENDAMENTO
  // ===============================

  function obterDuracaoAgendamento(
    agendamento: Agendamento
  ) {
    const servicoAgendado =
      servicos.find(
        (item) =>
          item.nome ===
          agendamento.servico
      );

    const duracao =
      Number(
        servicoAgendado?.duracao
      );

    if (
      Number.isFinite(duracao) &&
      duracao > 0
    ) {
      return duracao;
    }

    return 30;
  }

  // ===============================
  // VERIFICAR CONFLITO
  // ===============================

  function existeConflito(
    horarioInicio: number,
    duracao: number
  ) {
    const horarioFim =
      horarioInicio + duracao;

    return agendamentosDoDia.some(
      (agendamento) => {
        if (
          agendamento.status ===
          "Cancelado"
        ) {
          return false;
        }

        if (
          !agendamento.horario
        ) {
          return false;
        }

        const inicioExistente =
          horaParaMinutos(
            agendamento.horario
          );

        const duracaoExistente =
          obterDuracaoAgendamento(
            agendamento
          );

        const fimExistente =
          inicioExistente +
          duracaoExistente;

        return (
          horarioInicio <
            fimExistente &&
          horarioFim >
            inicioExistente
        );
      }
    );
  }

  // ===============================
  // ENCONTRAR FIM DO CONFLITO
  // ===============================

  function obterFimDoConflito(
    horarioInicio: number,
    duracao: number
  ) {
    const horarioFim =
      horarioInicio + duracao;

    let maiorFim = horarioFim;

    for (
      const agendamento of
        agendamentosDoDia
    ) {
      if (
        agendamento.status ===
        "Cancelado"
      ) {
        continue;
      }

      if (
        !agendamento.horario
      ) {
        continue;
      }

      const inicioExistente =
        horaParaMinutos(
          agendamento.horario
        );

      const duracaoExistente =
        obterDuracaoAgendamento(
          agendamento
        );

      const fimExistente =
        inicioExistente +
        duracaoExistente;

      const conflito =
        horarioInicio <
          fimExistente &&
        horarioFim >
          inicioExistente;

      if (
        conflito &&
        fimExistente > maiorFim
      ) {
        maiorFim =
          fimExistente;
      }
    }

    return maiorFim;
  }

  // ===============================
  // GERAR HORÁRIOS DISPONÍVEIS
  // ===============================

  function gerarHorarios() {
    const lista: string[] = [];

    if (
      !servico ||
      !data
    ) {
      return lista;
    }

    const inicioMinutos =
      horaParaMinutos(
        inicio
      );

    const fimMinutos =
      horaParaMinutos(
        fim
      );

    const duracaoServico =
      obterDuracaoServico();

      console.log(
  "SERVIÇO SELECIONADO:",
  servico
);

console.log(
  "DURAÇÃO:",
  obterDuracaoServico()
);

    let horarioAtual =
      inicioMinutos;

    while (
      horarioAtual +
        duracaoServico <=
      fimMinutos
    ) {
      const conflito =
        existeConflito(
          horarioAtual,
          duracaoServico
        );

      if (!conflito) {
        lista.push(
          minutosParaHora(
            horarioAtual
          )
        );

        horarioAtual +=
          duracaoServico;
      } else {
        horarioAtual =
          obterFimDoConflito(
            horarioAtual,
            duracaoServico
          );
      }
    }

    return lista;
  }

  // ===============================
  // VERIFICAR DIA FECHADO
  // ===============================

  function verificarDiaFechado(
    valorData: string
  ) {
    if (!valorData) {
      return false;
    }

    const dataSelecionada =
      new Date(
        `${valorData}T00:00:00`
      );

    const dia =
      dataSelecionada.getDay();

    const nomesDias = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];

    const nomeDia =
      nomesDias[dia];

    return !diasFuncionamento[
      nomeDia as keyof typeof diasFuncionamento
    ];
  }

    // ===============================
  // BUSCAR AGENDAMENTOS DO DIA
  // ===============================

  async function buscarAgendamentosDoDia() {
    if (!data) {
      setAgendamentosDoDia([]);
      return;
    }

    try {
      const agendamentos =
        await listarAgendamentos();

      const agendamentosDoDia =
        agendamentos.filter(
          (item: any) =>
            item.data === data &&
            item.status !==
              "Cancelado"
        );

      setAgendamentosDoDia(
        agendamentosDoDia as unknown as Agendamento[]
      );
    } catch (erro) {
      console.error(
        "Erro ao buscar agendamentos:",
        erro
      );

      setAgendamentosDoDia([]);
    }
  }

  useEffect(() => {
    if (data) {
      buscarAgendamentosDoDia();
    } else {
      setAgendamentosDoDia([]);
    }
  }, [
    data,
    servico,
    servicos,
  ]);

  // ===============================
  // ESCOLHER DATA
  // ===============================

  function escolherData(
    novaData: string
  ) {
    if (
      verificarDiaFechado(
        novaData
      )
    ) {
      setMensagem(
        "Não atendemos neste dia."
      );

      setData("");
      setHorario("");

      return;
    }

    setMensagem("");
    setData(novaData);
    setHorario("");
  }

  // ===============================
  // ESCOLHER SERVIÇO
  // ===============================

  function escolherServico(
    novoServico: string
  ) {
    setServico(novoServico);
    setHorario("");
    setMensagem("");
  }

  // ===============================
  // CONFIRMAR AGENDAMENTO
  // ===============================

  async function confirmarAgendamento() {
    if (
      salvando ||
      agendamentoConfirmado
    ) {
      return;
    }

    if (
      !nome ||
      !telefone ||
      !servico ||
      !data ||
      !horario
    ) {
      setMensagem(
        "Preencha nome, WhatsApp, serviço, data e horário."
      );

      return;
    }

    if (
      verificarDiaFechado(data)
    ) {
      setMensagem(
        "Não atendemos neste dia."
      );

      return;
    }

    try {
      // ===============================
      // ATUALIZA DO FIREBASE
      // ===============================

      const agendamentos =
        await listarAgendamentos();

      const agendamentosDoDiaAtual =
        agendamentos.filter(
          (item: any) =>
            item.data === data &&
            item.status !==
              "Cancelado"
        ) as unknown as Agendamento[];

      setAgendamentosDoDia(
        agendamentosDoDiaAtual
      );

      // ===============================
      // DURAÇÃO DO SERVIÇO
      // ===============================

      const servicoAtual =
        servicos.find(
          (item) =>
            item.nome === servico
        );

      const duracao =
        Number(
          servicoAtual?.duracao
        ) > 0
          ? Number(
              servicoAtual?.duracao
            )
          : 30;

      const horarioInicio =
        horaParaMinutos(
          horario
        );

      const horarioFim =
        horarioInicio +
        duracao;

      // ===============================
      // VERIFICAR CONFLITO NOVAMENTE
      // ===============================

      const conflito =
        agendamentosDoDiaAtual.some(
          (agendamento) => {
            if (
              agendamento.status ===
              "Cancelado"
            ) {
              return false;
            }

            if (
              !agendamento.horario
            ) {
              return false;
            }

            const inicioExistente =
              horaParaMinutos(
                agendamento.horario
              );

            const duracaoExistente =
              obterDuracaoAgendamento(
                agendamento
              );

            const fimExistente =
              inicioExistente +
              duracaoExistente;

            return (
              horarioInicio <
                fimExistente &&
              horarioFim >
                inicioExistente
            );
          }
        );

      if (conflito) {
        setMensagem(
          "Esse horário não está mais disponível. Escolha outro horário."
        );

        setHorario("");

        await buscarAgendamentosDoDia();

        return;
      }

      // ===============================
      // VERIFICAR LIMITE DO EXPEDIENTE
      // ===============================

      const fimExpediente =
        horaParaMinutos(fim);

      if (
        horarioFim >
        fimExpediente
      ) {
        setMensagem(
          "Esse serviço não cabe no horário de atendimento."
        );

        setHorario("");

        return;
      }

      // ===============================
      // SALVAR
      // ===============================

      const novoAgendamento = {
        nome,
        telefone,
        servico,
        data,
        horario,
        status: "Agendado",
        criadoEm: new Date(),
      };

      setSalvando(true);

      setMensagem(
        "Confirmando seu agendamento..."
      );

      await salvarAgendamento(
        novoAgendamento
      );

      // ===============================
      // WHATSAPP
      // ===============================

      const mensagemWhatsApp =
        `Olá! Meu nome é ${nome}.%0A%0A` +
        `Gostaria de confirmar meu agendamento na Barbearia Mateus Santos 💈%0A%0A` +
        `✂️ Serviço: ${servico}%0A` +
        `📅 Data: ${data}%0A` +
        `🕒 Horário: ${horario}`;

      const telefoneLimpo =
        telefone.replace(
          /\D/g,
          ""
        );

      const linkWhatsApp =
        `https://wa.me/55${telefoneLimpo}?text=${mensagemWhatsApp}`;

      setWhatsappLink(
        linkWhatsApp
      );

      setAgendamentoConfirmado(
        true
      );

      setMensagem(
        "Agendamento confirmado com sucesso! 🎉"
      );

      setNome("");
      setTelefone("");
      setData("");
      setHorario("");

      setAgendamentosDoDia([]);

    } catch (erro) {
      console.error(
        "Erro ao salvar agendamento:",
        erro
      );

      setMensagem(
        "Erro ao salvar agendamento. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  }

  // ===============================
  // HORÁRIOS DISPONÍVEIS
  // ===============================

  const horariosDisponiveis =
    gerarHorarios();

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-center">
        Agendar Horário 💈
      </h1>

      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-2xl shadow">

        {/* NOME */}

        <label className="block mb-2 font-bold">
          Nome do cliente
        </label>

        <input
          className="w-full border p-3 rounded mb-4 text-black"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          disabled={
            agendamentoConfirmado
          }
        />

        {/* WHATSAPP */}

        <label className="block mb-2 font-bold">
          WhatsApp
        </label>

        <input
          type="tel"
          className="w-full border p-3 rounded mb-4 text-black"
          placeholder="Ex: 27999999999"
          value={telefone}
          onChange={(e) =>
            setTelefone(e.target.value)
          }
          disabled={
            agendamentoConfirmado
          }
        />

        {/* SERVIÇO */}

        <label className="block mb-2 font-bold">
          Serviço escolhido
        </label>

        <select
          className="w-full border p-3 rounded mb-4 text-black bg-white"
          value={servico}
          onChange={(e) =>
            escolherServico(
              e.target.value
            )
          }
          disabled={
            agendamentoConfirmado
          }
        >
          <option value="">
            ✂️ Escolha o serviço
          </option>

          {servicos.map(
            (item) => (
              <option
                key={item.id}
                value={item.nome}
              >
                {item.nome} - R${" "}
                {Number(
                  item.valor || 0
                )
                  .toFixed(2)
                  .replace(
                    ".",
                    ","
                  )}
              </option>
            )
          )}
        </select>

        {/* DATA */}

        <label className="block mb-2 font-bold">
          Data
        </label>

        <input
          type="date"
          className="w-full border p-3 rounded mb-4 text-black"
          value={data}
          onChange={(e) =>
            escolherData(
              e.target.value
            )
          }
          disabled={
            agendamentoConfirmado
          }
        />

        {/* HORÁRIO */}

        <label className="block mb-2 font-bold">
          Horário
        </label>

        <select
          className="w-full border p-3 rounded mb-4 text-black bg-white"
          value={horario}
          onChange={(e) =>
            setHorario(
              e.target.value
            )
          }
          disabled={
            agendamentoConfirmado ||
            !data ||
            !servico
          }
        >
          <option value="">
            Escolha um horário
          </option>

          {horariosDisponiveis.map(
            (hora) => (
              <option
                key={hora}
                value={hora}
              >
                {hora}
              </option>
            )
          )}
        </select>

                {/* BOTÃO CONFIRMAR */}

        <button
          onClick={
            confirmarAgendamento
          }
          disabled={
            salvando ||
            agendamentoConfirmado
          }
          className={`w-full p-3 rounded-xl font-bold text-white transition ${
            agendamentoConfirmado
              ? "bg-green-600 cursor-default"
              : salvando
              ? "bg-gray-500 cursor-wait"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {agendamentoConfirmado
            ? "✅ Agendamento confirmado!"
            : salvando
            ? "⏳ Confirmando..."
            : "Confirmar Agendamento"}
        </button>

        {/* MENSAGEM */}

        {mensagem && (
          <div
            className={`mt-4 text-center font-bold p-3 rounded-xl ${
              agendamentoConfirmado
                ? "bg-green-100 text-green-700"
                : "text-gray-800"
            }`}
          >
            {mensagem}
          </div>
        )}

        {/* WHATSAPP */}

        {whatsappLink && (
          <div className="mt-5">

            <p className="text-center text-green-700 font-bold mb-3">
              📲 Seu horário foi reservado!
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 text-white text-center p-4 rounded-xl font-bold hover:bg-green-700"
            >
              📲 Confirmar pelo WhatsApp
            </a>

          </div>
        )}

      </div>

    </main>
  );
}