"use client";

import { useEffect, useState } from "react";
import {
  buscarBarbearia,
  salvarBarbearia,
} from "@/lib/firestore";

export default function Barbearia() {
  const [nome, setNome] = useState("");
  const [slogan, setSlogan] = useState("");
  const [endereco, setEndereco] = useState("");
  const [maps, setMaps] = useState("");
  const [telefone, setTelefone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const dados = await buscarBarbearia();

    if (dados) {
      setNome(dados.nome || "");
      setSlogan(dados.slogan || "");
      setEndereco(dados.endereco || "");
      setMaps(dados.maps || "");
      setTelefone(dados.telefone || "");
      setInstagram(dados.instagram || "");
      setLogo(dados.logo || "");
    }
  }

  async function salvar() {
    await salvarBarbearia({
      nome,
      slogan,
      endereco,
      maps,
      telefone,
      instagram,
      logo,
    });

    alert("✅ Informações salvas com sucesso!");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">
        🏪 Barbearia
      </h1>

      <div className="bg-white rounded-3xl shadow p-6 space-y-4">

        <input
          type="text"
          placeholder="Nome da Barbearia"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="Slogan"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="Link Google Maps"
          value={maps}
          onChange={(e) => setMaps(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="WhatsApp"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="Instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="Logo (ex: /logo.png)"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        {logo && (
          <img
            src={logo}
            alt="Logo"
            className="w-32 h-32 rounded-full object-cover mx-auto shadow"
          />
        )}

        <button
          onClick={salvar}
          className="w-full bg-black text-white p-4 rounded-xl font-bold"
        >
          💾 Salvar Alterações
        </button>

      </div>

    </main>
  );
}