"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  salvarPerfil,
  buscarPerfil,
} from "@/lib/firestore";


export default function Perfil() {

  const router = useRouter();


  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");



  useEffect(() => {

    carregarPerfil();

  }, []);



  async function carregarPerfil() {

    try {

      const dados = await buscarPerfil();


      if (dados) {

        setNome(dados.nome || "");
        setEmail(dados.email || "");
        setTelefone(dados.telefone || "");

      }

    } catch (erro) {

      console.error(
        "Erro ao carregar perfil:",
        erro
      );

    }

  }





  async function salvar() {

    console.log("CLICOU NO SALVAR");


    try {

      await salvarPerfil({

        nome,
        email,
        telefone,

      });


      console.log(
        "SALVOU NO FIREBASE"
      );


      alert(
        "Perfil salvo com sucesso!"
      );


    } catch (erro) {

      console.error(
        "ERRO AO SALVAR:",
        erro
      );


      alert(
        "Erro ao salvar perfil."
      );

    }

  }





  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">


        <h1 className="text-3xl font-bold mb-6">
          👤 Alterar perfil
        </h1>



        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Nome do administrador"
          value={nome}
          onChange={(e)=>
            setNome(e.target.value)
          }
        />



        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="E-mail"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
        />



        <input
          className="w-full border p-3 rounded mb-3"
          placeholder="Telefone"
          value={telefone}
          onChange={(e)=>
            setTelefone(e.target.value)
          }
        />



        <button
          onClick={() => {

            console.log("BOTAO FOI CLICADO");

            salvar();

          }}
          className="w-full bg-black text-white p-3 rounded-xl font-bold"
        >
          💾 Salvar alterações
        </button>



        <button
          onClick={() => router.back()}
          className="w-full bg-gray-300 p-3 rounded-xl font-bold mt-4"
        >
          ⬅ Voltar
        </button>



      </div>


    </main>

  );

}