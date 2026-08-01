import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
  getDoc,
} from "firebase/firestore";

// ===============================
// AGENDAMENTOS
// ===============================

const agendamentosRef = collection(
  db,
  "agendamentos"
);

// ===============================
// SALVAR AGENDAMENTO + CLIENTE
// ===============================

export async function salvarAgendamento(
  dados: any
) {
  // Salva o agendamento
  await addDoc(
    agendamentosRef,
    dados
  );

  // Se tiver WhatsApp, salva o cliente
  if (dados.telefone) {
    const clientesSnapshot =
      await getDocs(clientesRef);

    const clienteExistente =
      clientesSnapshot.docs.find(
        (documento) => {
          const cliente =
            documento.data();

          return (
            cliente.telefone ===
            dados.telefone
          );
        }
      );

    if (!clienteExistente) {
      await addDoc(
        clientesRef,
        {
          nome: dados.nome,
          telefone: dados.telefone,
          criadoEm: new Date(),
        }
      );
    }
  }

  // ===============================
  // NOTIFICAÇÃO
  // ===============================

  try {
    const resposta =
      await fetch(
        "/api/notificacoes/agendamento",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            dados
          ),
        }
      );

    if (!resposta.ok) {
      console.error(
        "Erro ao enviar notificação:",
        await resposta.text()
      );
    } else {
      console.log(
        "Notificação enviada com sucesso."
      );
    }

  } catch (erro) {
    console.error(
      "Erro ao enviar notificação:",
      erro
    );
  }
}

// ===============================
// LISTAR AGENDAMENTOS
// ===============================

export async function listarAgendamentos() {
  const snapshot =
    await getDocs(
      agendamentosRef
    );

  return snapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );
}

// ===============================
// ATUALIZAR STATUS
// ===============================

export async function atualizarStatusAgendamento(
  id: string,
  status: string
) {
  const agendamentoRef =
    doc(
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
// AGENDAMENTOS EM TEMPO REAL
// ===============================

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

// ===============================
// SALVAR CLIENTE
// ===============================

export async function salvarCliente(
  dados: any
) {
  await addDoc(
    clientesRef,
    dados
  );
}

// ===============================
// LISTAR CLIENTES
// ===============================

export async function listarClientes() {
  const snapshot =
    await getDocs(
      clientesRef
    );

  return snapshot.docs.map(
    (documento) => ({
      id: documento.id,
      ...documento.data(),
    })
  );
}

// ===============================
// CLIENTES EM TEMPO REAL
// ===============================

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
// BLOQUEIOS
// ===============================

const bloqueiosRef = collection(
  db,
  "bloqueios"
);

// ===============================
// SALVAR BLOQUEIO
// ===============================

export async function salvarBloqueio(
  dados: any
) {
  await addDoc(
    bloqueiosRef,
    dados
  );
}

// ===============================
// LISTAR BLOQUEIOS
// ===============================

export async function listarBloqueios() {
  const snapshot =
    await getDocs(
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

// ===============================
// SALVAR SERVIÇO
// ===============================

export async function salvarServico(
  dados: any
) {
  await addDoc(
    servicosRef,
    dados
  );
}

// ===============================
// LISTAR SERVIÇOS
// ===============================

export async function listarServicos() {
  const snapshot =
    await getDocs(
      servicosRef
    );

  return snapshot.docs.map(
    (documento) => {
      const dados =
        documento.data();

      return {
        id: documento.id,

        nome:
          dados.nome || "",

        valor:
          Number(
            dados.valor || 0
          ),

        duracao:
          Number(
            dados.duracao || 0
          ),

        status:
          dados.status || "Ativo",
      };
    }
  );
}

// ===============================
// ATUALIZAR SERVIÇO
// ===============================

export async function atualizarServico(
  id: string,
  dados: any
) {
  const servicoRef =
    doc(
      db,
      "servicos",
      id
    );

  await updateDoc(
    servicoRef,
    dados
  );
}

// ===============================
// PERFIL ADMINISTRADOR
// ===============================

export async function salvarPerfil(
  dados: any
) {
  await setDoc(
    doc(
      db,
      "configuracoes",
      "admin"
    ),
    dados,
    {
      merge: true,
    }
  );
}

export async function buscarPerfil() {
  const resultado =
    await getDoc(
      doc(
        db,
        "configuracoes",
        "admin"
      )
    );

  if (resultado.exists()) {
    return resultado.data();
  }

  return null;
}

// ===============================
// BARBEARIA
// ===============================

export async function salvarBarbearia(
  dados: any
) {
  await setDoc(
    doc(
      db,
      "configuracoes",
      "barbearia"
    ),
    dados,
    {
      merge: true,
    }
  );
}

export async function buscarBarbearia() {
  const resultado =
    await getDoc(
      doc(
        db,
        "configuracoes",
        "barbearia"
      )
    );

  if (resultado.exists()) {
    return resultado.data();
  }

  return null;
}

// ===============================
// WHATSAPP
// ===============================

export async function salvarWhatsApp(
  dados: any
) {
  await setDoc(
    doc(
      db,
      "configuracoes",
      "whatsapp"
    ),
    dados,
    {
      merge: true,
    }
  );
}

export async function buscarWhatsApp() {
  const resultado =
    await getDoc(
      doc(
        db,
        "configuracoes",
        "whatsapp"
      )
    );

  if (resultado.exists()) {
    return resultado.data();
  }

  return null;
}

// ===============================
// HORÁRIOS
// ===============================

export async function salvarHorarios(
  dados: any
) {
  await setDoc(
    doc(
      db,
      "configuracoes",
      "horarios"
    ),
    dados,
    {
      merge: true,
    }
  );
}

export async function buscarHorarios() {
  const resultado =
    await getDoc(
      doc(
        db,
        "configuracoes",
        "horarios"
      )
    );

  if (resultado.exists()) {
    return resultado.data();
  }

  return null;
}