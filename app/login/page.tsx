"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const router = useRouter();

  async function entrar() {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      router.push("/painel");

    } catch (error) {
      setErro("E-mail ou senha incorretos");
    }
  }


  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-6">
          Login Administrador
        </h1>


        <input
          type="email"
          placeholder="E-mail"
          className="w-full border p-3 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-3 rounded mb-3"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />


        {erro && (
          <p className="text-red-600 mb-3">
            {erro}
          </p>
        )}


        <button
          onClick={entrar}
          className="w-full bg-black text-white p-3 rounded"
        >
          Entrar
        </button>


      </div>

    </main>
  );
}