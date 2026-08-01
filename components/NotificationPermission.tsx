"use client";

import { useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

import app, { db } from "@/lib/firebase";

const VAPID_KEY =
  "BLsYdOoHwAyqkRdLv_rnsZkdirLwt8GF0TheO4A17du9HSvORaNIR1yXtHcXiy4En7EsraP8u8ci9mLYEmm6L4I";

export default function NotificationPermission() {
  useEffect(() => {
    const configurarNotificacoes = async () => {
      try {
        if (typeof window === "undefined") {
          return;
        }

        if (!("Notification" in window)) {
          console.log("Este navegador não suporta notificações.");
          return;
        }

        if (!("serviceWorker" in navigator)) {
          console.log("Este navegador não suporta Service Worker.");
          return;
        }

        let permissao = Notification.permission;

        if (permissao === "default") {
          permissao = await Notification.requestPermission();
        }

        if (permissao !== "granted") {
          console.log("Permissão para notificações não concedida.");
          return;
        }

        const registration =
          await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );

        await navigator.serviceWorker.ready;

        console.log("Service Worker registrado.");

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
    };

    configurarNotificacoes();
  }, []);

  return null;
}