import { NextResponse } from "next/server";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";

function iniciarFirebaseAdmin() {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!base64) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_BASE64 não está configurada."
    );
  }

  const serviceAccount = JSON.parse(
    Buffer.from(base64, "base64").toString("utf-8")
  );

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return {
    db: getFirestore(),
    messaging: getMessaging(),
  };
}

export async function POST(request: Request) {
  try {
    const { db, messaging } = iniciarFirebaseAdmin();

    const dadosAgendamento = await request.json();

    const documento = await db
      .collection("notificacoes")
      .doc("administrador")
      .get();

    if (!documento.exists) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "Documento notificacoes/administrador não encontrado.",
        },
        { status: 404 }
      );
    }

    const dados = documento.data();
    const token = dados?.token;

    if (!token) {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "Token FCM não encontrado.",
        },
        { status: 404 }
      );
    }

    const nome = dadosAgendamento.nome || "Cliente";
    const data = dadosAgendamento.data || "";
    const horario = dadosAgendamento.horario || "";
    const servico = dadosAgendamento.servico || "Corte";

    const resposta = await messaging.send({
      token,

      notification: {
        title: "🔔 Novo agendamento!",
        body: `${nome} agendou ${servico}${data ? ` para ${data}` : ""}${
          horario ? ` às ${horario}` : ""
        }.`,
      },

      webpush: {
        notification: {
          title: "🔔 Novo agendamento!",
          body: `${nome} agendou ${servico}${data ? ` para ${data}` : ""}${
            horario ? ` às ${horario}` : ""
          }.`,
          icon: "/logo.png",
          badge: "/logo.png",
        },
      },
    });

    return NextResponse.json({
      sucesso: true,
      mensagem: "Notificação de agendamento enviada!",
      id: resposta,
    });
  } catch (error: any) {
    console.error(
      "Erro ao enviar notificação de agendamento:",
      error
    );

    return NextResponse.json(
      {
        sucesso: false,
        erro: error?.message || "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}