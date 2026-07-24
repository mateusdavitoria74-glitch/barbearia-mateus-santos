"use client";

import { useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const servicos = [
  { nome: "Barba", valor: "R$ 25,00" },
  { nome: "Barba + Pezinho", valor: "R$ 30,00" },
  { nome: "Corte + Alisamento", valor: "R$ 70,00" },
  { nome: "Corte + Barba", valor: "R$ 50,00" },
  { nome: "Corte + Pigmentação", valor: "R$ 60,00" },
  { nome: "Navalhado", valor: "R$ 35,00" },
  { nome: "Corte Social", valor: "R$ 25,00" },
];

export default function Home() {

  const router = useRouter();


useEffect(() => {

  const verificarUsuario = onAuthStateChanged(
    auth,
    (usuario) => {

      if (
        usuario &&
        usuario.email === "mateusdavitoria74@gmail.com"
      ) {

        router.push("/painel");

      }

    }
  );


  return () => verificarUsuario();

}, [router]);

  return (

    <main className="min-h-screen bg-gray-100 pb-20">


      {/* Tela inicial estilo aplicativo */}

      <section className="bg-black text-white p-10 text-center rounded-b-3xl">


        <div className="text-6xl mb-4">
          💈
        </div>


        <h1 className="text-3xl font-bold">
          Mateus Santos
        </h1>


        <h2 className="text-xl">
          Barbershop
        </h2>


        <p className="mt-4 text-gray-300">
          Seu estilo, nosso cuidado.
        </p>



        <Link
          href="/agendar"
          className="block mt-8 bg-green-600 p-4 rounded-xl font-bold text-lg"
        >
          ✂️ Agendar horário
        </Link>


      </section>



      {/* Atalhos do app */}

      <section className="p-5 grid grid-cols-2 gap-4">


        <Link
          href="/meus-agendamentos"
          className="bg-white shadow rounded-xl p-5 text-center font-bold"
        >
          📅
          <br />
          Meus horários
        </Link>



        <Link
          href="/servicos"
          className="bg-white shadow rounded-xl p-5 text-center font-bold"
        >
          ✂️
          <br />
          Serviços
        </Link>


      </section>




      <section className="p-5">


        <h2 className="text-2xl font-bold mb-5 text-center">
          Nossos serviços
        </h2>


        <div className="grid gap-4">


          {servicos.map((servico)=>(

            <div
              key={servico.nome}
              className="bg-white rounded-xl shadow p-5 flex justify-between"
            >

              <span className="font-bold">
                {servico.nome}
              </span>


              <span className="text-green-600 font-bold">
                {servico.valor}
              </span>


            </div>

          ))}


        </div>


      </section>




      <section className="bg-gray-200 p-6 text-center">


        <h2 className="text-xl font-bold">
          📍 Localização
        </h2>


        <p className="mt-3">
          Rua Vinte e Cinco de Dezembro, N° 8
          <br/>
          Retiro Saudoso
          <br/>
          Cariacica - ES
        </p>


        <a
          href="https://www.google.com/maps/search/?api=1&query=Rua+Vinte+e+Cinco+de+Dezembro+n8+Retiro+Saudoso+Cariacica+ES"
          target="_blank"
          className="inline-block mt-5 bg-blue-600 text-white p-3 rounded-xl font-bold"
        >
          Abrir localização
        </a>


      </section>




      <section className="p-6 text-center">


        <h2 className="font-bold text-xl">
          📲 WhatsApp
        </h2>


        <a
          href="https://wa.me/SEUNUMERO"
          target="_blank"
          className="inline-block mt-4 bg-green-600 text-white px-8 py-3 rounded-xl font-bold"
        >
          Falar agora
        </a>


      </section>



      <footer className="bg-black text-white text-center p-5">
        © Mateus Santos Barbershop 💈
      </footer>



    </main>

  );
}