"use client";

import Link from "next/link";


const servicos = [
  {
    nome: "Barba",
    valor: "R$ 25,00",
  },
  {
    nome: "Barba + Pezinho",
    valor: "R$ 30,00",
  },
  {
    nome: "Corte + Alisamento",
    valor: "R$ 70,00",
  },
  {
    nome: "Corte + Barba",
    valor: "R$ 50,00",
  },
  {
    nome: "Corte + Barba + Luzes Alinhada",
    valor: "R$ 100,00",
  },
  {
    nome: "Corte + Pigmentação",
    valor: "R$ 60,00",
  },
  {
    nome: "Navalhado",
    valor: "R$ 35,00",
  },
  {
    nome: "Corte Social",
    valor: "R$ 25,00",
  },
  {
    nome: "Nevou + Corte",
    valor: "R$ 120,00",
  },
];


export default function Home() {

  return (

    <main className="min-h-screen bg-gray-100">


      <section className="relative bg-black text-white p-12 text-center">


        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90"></div>


        <div className="relative z-10">


          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Barbearia Mateus Santos 💈
          </h1>


          <p className="text-lg">
            Cortes modernos, barba e transformação no seu estilo.
          </p>


          <Link
            href="/agendar"
            className="inline-block mt-6 bg-green-600 px-8 py-3 rounded-lg font-bold"
          >
            Agendar horário
          </Link>


        </div>


      </section>



      <section className="p-8 max-w-5xl mx-auto">


        <h2 className="text-3xl font-bold text-center mb-8">
          ✂️ Nossos Serviços
        </h2>


        <div className="grid md:grid-cols-3 gap-5">


          {servicos.map((servico) => (

            <div
              key={servico.nome}
              className="bg-white rounded-lg shadow p-5 text-center"
            >

              <h3 className="text-xl font-bold">
                {servico.nome}
              </h3>


              <p className="text-green-600 text-2xl font-bold mt-3">
                {servico.valor}
              </p>


            </div>

          ))}


        </div>


      </section>

            <section className="bg-gray-200 p-8 text-center">

        <h2 className="text-2xl font-bold mb-4">
          📍 Nossa localização
        </h2>


        <p className="text-lg font-bold">
          Barbearia Mateus Santos
        </p>


        <p className="mb-6">
          Rua Vinte e Cinco de Dezembro, N° 8<br />
          Bairro Retiro Saudoso<br />
          Cariacica - ES
        </p>


        <a
          href="https://www.google.com/maps/search/?api=1&query=Rua+Vinte+e+Cinco+de+Dezembro+n8+Retiro+Saudoso+Cariacica+ES"
          target="_blank"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold"
        >
          📍 Abrir no Google Maps
        </a>


      </section>




      <section className="bg-white p-8 text-center">


        <h2 className="text-2xl font-bold mb-4">
          📲 Fale conosco
        </h2>


        <p className="mb-5">
          Tire dúvidas ou agende seu horário pelo WhatsApp.
        </p>



        <a
          href="https://wa.me/SEUNUMERO"
          target="_blank"
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold"
        >
          WhatsApp
        </a>


      </section>




      <footer className="bg-black text-white text-center p-4">

        © Barbearia Mateus Santos 💈

      </footer>


    </main>

  );

}