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

export async function POST() {
  try {
    const { db, messaging } = iniciarFirebaseAdmin();

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

    const resposta = await messaging.send({
      token,

      notification: {
        title: "Barbearia Mateus Santos ✂️",
        body: "Teste de notificação funcionando!",
      },

      webpush: {
        notification: {
          title: "Barbearia Mateus Santos ✂️",
          body: "Teste de notificação funcionando!",
          icon: "/logo.png",
          badge: "/logo.png",
        },
      },
    });

    return NextResponse.json({
      sucesso: true,
      mensagem: "Notificação enviada com sucesso!",
      id: resposta,
    });
  } catch (error: any) {
    console.error("Erro ao enviar notificação:", error);

    return NextResponse.json(
      {
        sucesso: false,
        erro: error?.message || "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}