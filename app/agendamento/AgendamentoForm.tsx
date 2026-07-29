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

export default function AgendamentoForm() {
  const searchParams = useSearchParams();

  const servicoSelecionado =
    searchParams.get("servico") || "";

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servico, setServico] = useState(servicoSelecionado);
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");

  const [servicos, setServicos] = useState<Servico[]>([]);

  const [horariosOcupados, setHorariosOcupados] =
    useState<string[]>([]);

  const [mensagem, setMensagem] = useState("");

  const [whatsappLink, setWhatsappLink] = useState("");

  const [inicio, setInicio] = useState("10:00");
  const [fim, setFim] = useState("17:00");

  const [diasFuncionamento, setDiasFuncionamento] = useState({
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

      const servicosAtivos = dados.filter(
        (servico: Servico) =>
          servico.status === "Ativo"
      );

      setServicos(servicosAtivos);

      if (
        !servicoSelecionado &&
        servicosAtivos.length > 0
      ) {
        setServico(servicosAtivos[0].nome);
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
      const dados = await buscarHorarios();

      if (dados) {
        setInicio(dados.inicio || "10:00");
        setFim(dados.fim || "17:00");

        if (dados.dias) {
          setDiasFuncionamento(dados.dias);
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
  // GERAR HORÁRIOS
  // ===============================

  function gerarHorarios() {
    const lista: string[] = [];

    const [horaInicio, minutoInicio] =
      inicio.split(":").map(Number);

    const [horaFim, minutoFim] =
      fim.split(":").map(Number);

    let inicioMinutos =
      horaInicio * 60 + minutoInicio;

    const fimMinutos =
      horaFim * 60 + minutoFim;

    while (inicioMinutos < fimMinutos) {
      const hora = Math.floor(
        inicioMinutos / 60
      );

      const minuto =
        inicioMinutos % 60;

      lista.push(
        `${hora
          .toString()
          .padStart(2, "0")}:${minuto
          .toString()
          .padStart(2, "0")}`
      );

      inicioMinutos += 60;
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

    const dataSelecionada = new Date(
      valorData + "T00:00:00"
    );

    const dia = dataSelecionada.getDay();

    const nomesDias = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];

    const nomeDia = nomesDias[dia];

    return !diasFuncionamento[
      nomeDia as keyof typeof diasFuncionamento
    ];
  }

  // ===============================
  // BUSCAR HORÁRIOS OCUPADOS
  // ===============================

  async function buscarHorariosOcupados() {
    if (!data) {
      return;
    }

    try {
      const agendamentos =
        await listarAgendamentos();

      const ocupados = agendamentos
        .filter(
          (item: any) =>
            item.data === data &&
            item.status !== "Cancelado"
        )
        .map(
          (item: any) =>
            item.horario
        );

      setHorariosOcupados(ocupados);

    } catch (erro) {
      console.error(
        "Erro ao buscar horários:",
        erro
      );
    }
  }

  useEffect(() => {
    if (data) {
      buscarHorariosOcupados();
    } else {
      setHorariosOcupados([]);
    }
  }, [data]);

  // ===============================
  // ESCOLHER DATA
  // ===============================

  function escolherData(
    novaData: string
  ) {
    if (verificarDiaFechado(novaData)) {
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
  // CONFIRMAR AGENDAMENTO
  // ===============================

  async function confirmarAgendamento() {
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

    if (verificarDiaFechado(data)) {
      setMensagem(
        "Não atendemos neste dia."
      );

      return;
    }

    if (
      horariosOcupados.includes(horario)
    ) {
      setMensagem(
        "Esse horário já está ocupado."
      );

      return;
    }

    const novoAgendamento = {
      nome,
      telefone,
      servico,
      data,
      horario,
      status: "Agendado",
      criadoEm: new Date(),
    };

    try {
      await salvarAgendamento(
        novoAgendamento
      );

      const mensagemWhatsApp =
        `Olá! Meu nome é ${nome}.%0A%0A` +
        `Gostaria de confirmar meu agendamento na Barbearia Mateus Santos 💈%0A%0A` +
        `✂️ Serviço: ${servico}%0A` +
        `📅 Data: ${data}%0A` +
        `🕒 Horário: ${horario}`;

      const telefoneLimpo =
        telefone.replace(/\D/g, "");

      const linkWhatsApp =
        `https://wa.me/55${telefoneLimpo}?text=${mensagemWhatsApp}`;

      setWhatsappLink(linkWhatsApp);

      setMensagem(
        "Agendamento confirmado com sucesso! 🎉"
      );

      setNome("");
      setTelefone("");
      setData("");
      setHorario("");

      setHorariosOcupados([]);

    } catch (erro) {
      console.error(
        "Erro ao salvar agendamento:",
        erro
      );

      setMensagem(
        "Erro ao salvar agendamento."
      );
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
        />

        {/* SERVIÇO */}

        <label className="block mb-2 font-bold">
          Serviço escolhido
        </label>

        <select
          className="w-full border p-3 rounded mb-4 text-black bg-white"
          value={servico}
          onChange={(e) =>
            setServico(e.target.value)
          }
        >
          <option value="">
            ✂️ Escolha o serviço
          </option>

          {servicos.map((item) => (
            <option
              key={item.id}
              value={item.nome}
            >
              {item.nome} - R${" "}
              {Number(item.valor || 0)
                .toFixed(2)
                .replace(".", ",")}
            </option>
          ))}
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
            escolherData(e.target.value)
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
            setHorario(e.target.value)
          }
        >
          <option value="">
            Escolha um horário
          </option>

          {horariosDisponiveis.map((hora) => {
            const ocupado =
              horariosOcupados.includes(hora);

            return (
              <option
                key={hora}
                value={hora}
                disabled={ocupado}
              >
                {hora}
                {ocupado
                  ? " - Ocupado"
                  : ""}
              </option>
            );
          })}
        </select>

        {/* BOTÃO CONFIRMAR */}

        <button
          onClick={confirmarAgendamento}
          className="w-full bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800"
        >
          Confirmar Agendamento
        </button>

        {/* MENSAGEM */}

        {mensagem && (
          <p className="mt-4 text-center font-bold">
            {mensagem}
          </p>
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