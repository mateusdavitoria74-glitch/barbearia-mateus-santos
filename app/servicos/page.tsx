import Link from "next/link";

export default function Servicos() {
  const servicos = [
    {
      nome: "Corte social",
      preco: "R$ 40",
    },
    {
      nome: "Corte navalhado",
      preco: "R$ 50",
    },
    {
      nome: "Low Fade",
      preco: "R$ 50",
    },
    {
      nome: "Mid Fade",
      preco: "R$ 50",
    },
    {
      nome: "Corte + barba",
      preco: "R$ 60",
    },
    {
      nome: "Pigmentação",
      preco: "R$ 40",
    },
    {
      nome: "Luzes",
      preco: "R$ 70",
    },
    {
      nome: "Nevou",
      preco: "R$ 80",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-center">
        Nossos Serviços
      </h1>

      <div className="max-w-3xl mx-auto mt-8 grid gap-4">

        {servicos.map((servico, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow flex justify-between items-center"
          >

            <div>
              <h2 className="text-xl font-bold">
                {servico.nome}
              </h2>

              <p className="text-gray-600">
                {servico.preco}
              </p>
            </div>


            <Link
              href={`/agendamento?servico=${encodeURIComponent(servico.nome)}`}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Agendar
            </Link>

          </div>
        ))}

      </div>

    </main>
  );
}