import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
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


  return snapshot.docs.map(
    (documento) => ({

      id: documento.id,

      ...documento.data(),

    })
  );

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



// TEMPO REAL

export function ouvirAgendamentos(
  callback: (dados: any[]) => void
) {

  return onSnapshot(
    agendamentosRef,
    (snapshot) => {

      callback(

        snapshot.docs.map(
          (documento) => ({

            id: documento.id,

            ...documento.data(),

          })
        )

      );

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


  return snapshot.docs.map(
    (documento) => ({

      id: documento.id,

      ...documento.data(),

    })
  );

}



// TEMPO REAL

export function ouvirClientes(
  callback: (dados: any[]) => void
) {

  return onSnapshot(
    clientesRef,
    (snapshot) => {

      callback(

        snapshot.docs.map(
          (documento) => ({

            id: documento.id,

            ...documento.data(),

          })
        )

      );

    }
  );

}



// ===============================
// BLOQUEIOS DE HORÁRIOS
// ===============================

const bloqueiosRef = collection(
  db,
  "bloqueios"
);



export async function salvarBloqueio(
  dados: any
) {

  await addDoc(
    bloqueiosRef,
    dados
  );

}



export async function listarBloqueios() {

  const snapshot = await getDocs(
    bloqueiosRef
  );


  return snapshot.docs.map(
    (documento) => ({

      id: documento.id,

      ...documento.data(),

    })
  );

}



// ===============================
// SERVIÇOS
// ===============================

const servicosRef = collection(
  db,
  "servicos"
);



export async function salvarServico(
  dados: any
) {

  await addDoc(
    servicosRef,
    dados
  );

}



export async function listarServicos() {

  const snapshot = await getDocs(
    servicosRef
  );


  return snapshot.docs.map(
    (documento) => {

      const dados = documento.data();


      return {

        id: documento.id,

        nome: dados.nome || "",

        valor: Number(
          dados.valor || 0
        ),

        duracao: Number(
          dados.duracao || 0
        ),

        status: dados.status || "Ativo",

      };

    }
  );

}



export async function atualizarServico(
  id: string,
  dados: any
) {

  const servicoRef = doc(
    db,
    "servicos",
    id
  );


  await updateDoc(
    servicoRef,
    dados
  );

}