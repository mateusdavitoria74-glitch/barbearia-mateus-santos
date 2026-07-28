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

  const [servico, setServico] =
    useState(servicoSelecionado);

  const [servicos, setServicos] =
    useState<Servico[]>([]);

  const [data, setData] = useState("");

  const [horario, setHorario] = useState("");

  const [horariosOcupados, setHorariosOcupados] =
    useState<string[]>([]);

  const [mensagem, setMensagem] =
    useState("");


  // CONFIGURAÇÃO DO PAINEL

  const [inicio, setInicio] =
    useState("10:00");

  const [fim, setFim] =
    useState("17:00");


  const [dias, setDias] = useState({

    segunda: false,

    terca: true,

    quarta: true,

    quinta: true,

    sexta: true,

    sabado: true,

    domingo: false,

  });


  const [carregando, setCarregando] =
    useState(false);


  // ===============================
  // CARREGAR SERVIÇOS
  // ===============================

  async function carregarServicos() {

    try {

      const lista =
        await listarServicos();

      const ativos =
        lista.filter(
          (item: any) =>
            item.status === "Ativo"
        );

      setServicos(
        ativos as Servico[]
      );


      // Se veio um serviço pela URL
      // e ele ainda está ativo,
      // mantém selecionado.

      if (
        servicoSelecionado &&
        ativos.some(
          (item: any) =>
            item.nome === servicoSelecionado
        )
      ) {

        setServico(
          servicoSelecionado
        );

      } else if (ativos.length > 0) {

        setServico(
          ativos[0].nome
        );

      } else {

        setServico("");

      }


    } catch (erro) {

      console.log(
        "Erro ao carregar serviços:",
        erro
      );

      setServicos([]);

    }

  }


  // ===============================
  // CONFIGURAÇÃO DE HORÁRIOS
  // ===============================

  async function carregarConfiguracao() {

    try {

      const dados =
        await buscarHorarios();

      console.log(
        "CONFIG HORARIOS:",
        dados
      );


      if (dados) {

        setInicio(
          dados.inicio || "10:00"
        );

        setFim(
          dados.fim || "17:00"
        );


        if (dados.dias) {

          setDias({

            segunda:
              dados.dias.segunda ?? false,

            terca:
              dados.dias.terca ?? true,

            quarta:
              dados.dias.quarta ?? true,

            quinta:
              dados.dias.quinta ?? true,

            sexta:
              dados.dias.sexta ?? true,

            sabado:
              dados.dias.sabado ?? true,

            domingo:
              dados.dias.domingo ?? false,

          });

        }

      }


    } catch (erro) {

      console.log(
        "Erro configuração:",
        erro
      );

    } finally {

      setCarregando(false);

    }

  }


  useEffect(() => {

    carregarConfiguracao();

    carregarServicos();

  }, []);


  // ===============================
  // GERAR HORÁRIOS
  // ===============================

  function gerarHorarios(
    horaInicio: string,
    horaFim: string
  ) {

    const lista: string[] = [];


    if (!horaInicio || !horaFim) {

      return lista;

    }


    const inicioMinutos =
      horaInicio
        .split(":")
        .map(Number);


    const fimMinutos =
      horaFim
        .split(":")
        .map(Number);


    let atual =
      inicioMinutos[0] * 60 +
      inicioMinutos[1];


    const final =
      fimMinutos[0] * 60 +
      fimMinutos[1];


    while (atual <= final) {

      const hora =
        Math.floor(atual / 60);

      const minuto =
        atual % 60;


      lista.push(

        `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`

      );


      atual += 60;

    }


    return lista;

  }


  const horarios =
    gerarHorarios(inicio, fim);

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
        valorData + "T00:00:00"
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


    return (
      !dias[
        nomeDia as keyof typeof dias
      ]
    );

  }


  // ===============================
  // BUSCAR HORÁRIOS OCUPADOS
  // ===============================

  async function buscarHorariosOcupados(
    dataSelecionada: string
  ) {

    try {

      const agendamentos =
        await listarAgendamentos();


      const ocupados =
        agendamentos

          .filter(
            (item: any) =>
              item.data === dataSelecionada &&
              item.status !== "Cancelado"
          )

          .map(
            (item: any) =>
              item.horario
          );


      setHorariosOcupados(
        ocupados
      );


    } catch (erro) {

      console.log(
        "Erro horários ocupados:",
        erro
      );

    }

  }


  // ===============================
  // ATUALIZAR HORÁRIOS AO ESCOLHER DATA
  // ===============================

  useEffect(() => {

    if (data) {

      buscarHorariosOcupados(
        data
      );

    } else {

      setHorariosOcupados([]);

    }

  }, [data]);


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


    if (
      verificarDiaFechado(data)
    ) {

      setMensagem(
        "Não atendemos neste dia."
      );

      return;

    }


    if (
      horariosOcupados.includes(
        horario
      )
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


      setMensagem(
        "Agendamento confirmado!"
      );


      setNome("");

      setTelefone("");

      setData("");

      setHorario("");


    } catch (erro) {

      console.log(
        "Erro ao salvar agendamento:",
        erro
      );


      setMensagem(
        "Erro ao salvar agendamento."
      );

    }

  }


  // ===============================
  // SERVIÇO SELECIONADO
  // ===============================

  const servicoAtual =
    servicos.find(
      (item) =>
        item.nome === servico
    );

      return (

    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-center">

        Agendar Horário

      </h1>


      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow">


        {/* NOME */}

        <label className="block mb-2">

          Nome do cliente

        </label>

        <input

          className="w-full border p-3 rounded mb-4"

          placeholder="Digite seu nome"

          value={nome}

          onChange={(e) =>
            setNome(e.target.value)
          }

        />


        {/* WHATSAPP */}

        <label className="block mb-2">

          WhatsApp

        </label>

        <input

          type="tel"

          className="w-full border p-3 rounded mb-4"

          placeholder="Digite seu WhatsApp"

          value={telefone}

          onChange={(e) =>
            setTelefone(e.target.value)
          }

        />


        {/* SERVIÇO */}

        <label className="block mb-2">

          Serviço escolhido

        </label>

        <select

          className="w-full border p-3 rounded mb-2"

          value={servico}

          disabled={
            carregando ||
            servicos.length === 0
          }

          onChange={(e) =>
            setServico(e.target.value)
          }

        >

          {servicos.length === 0 ? (

            <option value="">

              Nenhum serviço disponível

            </option>

          ) : (

            servicos.map((item) => (

              <option
                key={item.id}
                value={item.nome}
              >

                {item.nome} — R$ {item.valor
                  .toFixed(2)
                  .replace(".", ",")}

              </option>

            ))

          )}

        </select>


        {/* INFORMAÇÃO DO SERVIÇO */}

        {servicoAtual && (

          <div className="mb-4 bg-gray-100 p-3 rounded-xl">

            <p className="font-bold">

              {servicoAtual.nome}

            </p>

            <p className="text-green-600 font-bold">

              R$ {servicoAtual.valor
                .toFixed(2)
                .replace(".", ",")}

            </p>

            <p className="text-sm text-gray-500">

              Duração: {servicoAtual.duracao} minutos

            </p>

          </div>

        )}


        {/* DATA */}

        <label className="block mb-2">

          Data

        </label>

        <input

          type="date"

          className="w-full border p-3 rounded mb-4"

          value={data}

          disabled={carregando}

          onChange={(e) => {

            const novaData =
              e.target.value;


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

            setHorario("");

            setData(novaData);

          }}

        />


        {/* HORÁRIO */}

        <label className="block mb-2">

          Horário

        </label>

        <select

          className="w-full border p-3 rounded mb-4"

          value={horario}

          disabled={
            !data ||
            carregando
          }

          onChange={(e) =>
            setHorario(
              e.target.value
            )
          }

        >

          <option value="">

            {!data
              ? "Escolha a data primeiro"
              : "Escolha um horário"}

          </option>


          {horarios.map(
            (hora) => (

              <option

                key={hora}

                value={hora}

                disabled={
                  horariosOcupados.includes(
                    hora
                  )
                }

              >

                {hora}

                {horariosOcupados.includes(
                  hora
                )
                  ? " - Ocupado"
                  : ""}

              </option>

            )
          )}

        </select>


        {/* CONFIRMAR */}

        <button

          onClick={
            confirmarAgendamento
          }

          disabled={
            carregando ||
            servicos.length === 0
          }

          className="w-full bg-black text-white p-3 rounded font-bold disabled:bg-gray-400"

        >

          Confirmar Agendamento

        </button>


        {/* MENSAGEM */}

        {mensagem && (

          <p className="mt-4 text-center font-bold">

            {mensagem}

          </p>

        )}

      </div>

    </main>

  );

}