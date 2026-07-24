"use client";

import { useRouter } from "next/navigation";

export default function Perfil(){

const router = useRouter();


return (

<main className="min-h-screen bg-gray-100 p-8">

<div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">


<h1 className="text-3xl font-bold mb-6">
👤 Alterar perfil
</h1>


<input
className="w-full border p-3 rounded mb-3"
placeholder="Nome do administrador"
/>


<input
className="w-full border p-3 rounded mb-3"
placeholder="E-mail"
/>


<input
className="w-full border p-3 rounded mb-3"
placeholder="Telefone"
/>


<button
className="w-full bg-black text-white p-3 rounded-xl font-bold"
>
Salvar alterações
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