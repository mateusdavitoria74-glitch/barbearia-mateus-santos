import { Suspense } from "react";
import AgendamentoForm from "./AgendamentoForm";

export default function Agendamento() {
  return (
    <Suspense fallback={<p className="text-center p-8">Carregando...</p>}>
      <AgendamentoForm />
    </Suspense>
  );
}