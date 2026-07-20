"use client";

import { useState } from "react";
import { salvarCliente } from "@/lib/firestore";

export default function Clientes() {

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");


  async function cadastrarCliente() {

    if (!nome || !telefone) {

      setMensagem(
        "Preencha nome e telefone."
      );

      return;

    }


    const novoCliente = {

      nome,
      telefone,
      criadoEm: new Date(),

    };


    try {

      await salvarCliente(
        novoCliente
      );


      setMensagem(
        "Cliente cadastrado com sucesso!"
      );


      setNome("");
      setTelefone("");


    } catch (erro) {

      console.log(erro);

      setMensagem(
        "Erro ao cadastrar cliente."
      );

    }

  }



  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <h1 className="text-3xl font-bold text-center">
        Cadastro de Clientes
      </h1>



      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow">


        <label className="block mb-2">
          Nome do cliente
        </label>


        <input

          className="w-full border p-3 rounded mb-4"

          placeholder="Digite o nome"

          value={nome}

          onChange={(e) =>
            setNome(e.target.value)
          }

        />



        <label className="block mb-2">
          WhatsApp / Telefone
        </label>


        <input

          className="w-full border p-3 rounded mb-4"

          placeholder="(27) 99999-9999"

          value={telefone}

          onChange={(e) =>
            setTelefone(e.target.value)
          }

        />



        <button

          onClick={cadastrarCliente}

          className="w-full bg-black text-white p-3 rounded"

        >

          Cadastrar Cliente

        </button>



        {mensagem && (

          <p className="mt-4 text-center font-bold">

            {mensagem}

          </p>

        )}


      </div>


    </main>

  );

}