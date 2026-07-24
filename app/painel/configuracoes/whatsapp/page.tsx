"use client";

import { useRouter } from "next/navigation";

export default function WhatsApp(){

const router = useRouter();


return (

<main className="min-h-screen bg-gray-100 p-8">

<div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">


<h1 className="text-3xl font-bold mb-6">
📱 WhatsApp
</h1>


<input
className="w-full border p-3 rounded mb-3"
placeholder="Número do WhatsApp"
/>


<textarea
className="w-full border p-3 rounded mb-3"
placeholder="Mensagem automática de confirmação"
/>


<button
className="w-full bg-green-600 text-white p-3 rounded-xl font-bold"
>
Salvar WhatsApp
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