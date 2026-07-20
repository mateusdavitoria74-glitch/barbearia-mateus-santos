import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";


// ===============================
// AGENDAMENTOS
// ===============================

const agendamentosRef = collection(
  db,
  "agendamentos"
);


export async function salvarAgendamento(
  dados: any
) {

  await addDoc(
    agendamentosRef,
    dados
  );

}


export async function listarAgendamentos() {

  const snapshot = await getDocs(
    agendamentosRef
  );


  return snapshot.docs.map((documento) => ({

    id: documento.id,

    ...documento.data(),

  }));

}



export async function atualizarStatusAgendamento(
  id: string,
  status: string
) {

  const agendamentoRef = doc(
    db,
    "agendamentos",
    id
  );


  await updateDoc(
    agendamentoRef,
    {
      status,
    }
  );

}



// ===============================
// CLIENTES
// ===============================


const clientesRef = collection(
  db,
  "clientes"
);



export async function salvarCliente(
  dados: any
) {

  await addDoc(
    clientesRef,
    dados
  );

}



export async function listarClientes() {

  const snapshot = await getDocs(
    clientesRef
  );


  return snapshot.docs.map((documento) => ({

    id: documento.id,

    ...documento.data(),

  }));

}