"use client";

import { useEffect, useState } from "react";

import {
  salvarAgendamento,
  salvarCliente,
  listarServicos,
} from "@/lib/firestore";


type Servico = {
  id?: string;
  nome: string;
  valor: number;
  duracao?: number;
  status?: string;
};


// GERA HORÁRIOS PELO TEMPO DO SERVIÇO
function gerarHorarios(duracao: number) {

  const inicio = 10 * 60; // 10:00
  const fim = 17 * 60; // 17:00

  const lista: string[] = [];

  for (
    let minutos = inicio;
    minutos < fim;
    minutos += duracao
  ) {

    const hora = Math.floor(minutos / 60);

    const minuto = minutos % 60;


    lista.push(
      `${hora.toString().padStart(2, "0")}:${minuto
        .toString()
        .padStart(2, "0")}`
    );

  }

  return lista;

}



const datas = Array.from(
  { length: 7 },
  (_, i) => {

    const data = new Date();

    data.setDate(
      data.getDate() + i
    );


    return {

      valor: data
        .toISOString()
        .split("T")[0],

      texto: data.toLocaleDateString(
        "pt-BR",
        {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        }
      ),

    };

  }
);



export default function Agendar() {


  const [nome, setNome] = useState("");

  const [telefone, setTelefone] = useState("");

  const [servico, setServico] = useState("");

  const [data, setData] = useState("");

  const [horario, setHorario] = useState("");

  const [servicos, setServicos] = useState<Servico[]>([]);

  const [duracaoSelecionada, setDuracaoSelecionada] = useState(0);



  async function carregarServicos() {

    try {

      const dados = await listarServicos();


      setServicos(
        dados.filter(
          (servico) =>
            servico.status === "Ativo"
        )
      );


    } catch (erro) {

      console.log(
        "Erro ao carregar serviços:",
        erro
      );

    }

  }



  useEffect(() => {

    carregarServicos();

  }, []);




  function escolherServico(nomeServico: string) {

    setServico(nomeServico);


    const escolhido =
      servicos.find(
        (item) =>
          item.nome === nomeServico
      );


    setDuracaoSelecionada(
      escolhido?.duracao || 0
    );

  }





  async function agendar() {


    const escolhido =
      servicos.find(
        (item) =>
          item.nome === servico
      );



    if (
      !nome ||
      !telefone ||
      !servico ||
      !data ||
      !horario
    ) {

      alert(
        "Preencha todos os campos"
      );

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

      valor:
        escolhido?.valor || 0,

      duracao:
        escolhido?.duracao || 0,

      data,

      horario,

      status:
        "Agendado",

    });



    alert(
      "Agendamento realizado com sucesso!"
    );



    setNome("");

    setTelefone("");

    setServico("");

    setData("");

    setHorario("");

    setDuracaoSelecionada(0);

  }





  return (

    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">


      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">


        <h1 className="text-3xl font-bold text-center mb-6">
          Agende seu horário 💈
        </h1>



        <input
          className="w-full border p-3 rounded mb-3 text-black bg-white"
          placeholder="Seu nome"
          value={nome}
          onChange={(e)=>setNome(e.target.value)}
        />



        <input
          className="w-full border p-3 rounded mb-3 text-black bg-white"
          placeholder="WhatsApp"
          value={telefone}
          onChange={(e)=>setTelefone(e.target.value)}
        />



        <select
          className="w-full border p-3 rounded mb-3 text-black bg-white"
          value={servico}
          onChange={(e)=>
            escolherServico(e.target.value)
          }
        >

          <option value="">
            ✂️ Escolha o serviço
          </option>


          {servicos.map((item)=>(

            <option
              key={item.id || item.nome}
              value={item.nome}
            >

              {item.nome} - R$ {item.valor} ({item.duracao} min)

            </option>

          ))}


        </select>




        <select
          className="w-full border p-3 rounded mb-3 text-black bg-white"
          value={data}
          onChange={(e)=>setData(e.target.value)}
        >

          <option value="">
            📅 Escolha a data
          </option>


          {datas.map((item)=>(

            <option
              key={item.valor}
              value={item.valor}
            >

              {item.texto}

            </option>

          ))}


        </select>




        <select
          className="w-full border p-3 rounded mb-3 text-black bg-white"
          value={horario}
          onChange={(e)=>setHorario(e.target.value)}
        >

          <option value="">
            🕒 Escolha o horário
          </option>


          {duracaoSelecionada > 0 && 
            gerarHorarios(duracaoSelecionada).map((hora)=>(

              <option
                key={hora}
                value={hora}
              >

                {hora}

              </option>

            ))
          }


        </select>




        <button
          onClick={agendar}
          className="w-full bg-black text-white p-3 rounded hover:bg-gray-800"
        >

          Confirmar Agendamento

        </button>


      </div>


    </main>

  );

}