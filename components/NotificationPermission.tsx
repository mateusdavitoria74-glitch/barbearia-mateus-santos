"use client";

import { useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

import app, { db } from "@/lib/firebase";

const VAPID_KEY =
  "BCgPLmc1NBqbuwt92FFHK_qnIZHjh4Is_P-Bk52CtgYEpbEfMJEt9S1cnIP4ZpYYsYM6zj9Iw";

export default function NotificationPermission() {
  useEffect(() => {
    async function configurarNotificacoes() {
      try {
        if (!("Notification" in window)) {
          console.log("Este navegador não suporta notificações.");
          return;
        }

        if (!("serviceWorker" in navigator)) {
          console.log("Este navegador não suporta Service Worker.");
          return;
        }

        const permissao = await Notification.requestPermission();

        if (permissao !== "granted") {
          console.log("Permissão não concedida.");
          return;
        }

        const registration =
          await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );

        const messaging = getMessaging(app);

        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!token) {
          console.log("Não foi possível obter o token FCM.");
          return;
        }

        console.log("Token FCM obtido com sucesso.");

        await setDoc(
          doc(db, "notificacoes", "administrador"),
          {
            token,
            atualizadoEm: new Date(),
          },
          {
            merge: true,
          }
        );

        console.log("Token salvo no Firestore.");
      } catch (error) {
        console.error(
          "Erro ao configurar notificações:",
          error
        );
      }
    }

    configurarNotificacoes();
  }, []);

  return null;
}