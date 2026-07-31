"use client";

import { useEffect } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import app from "@/lib/firebase";

const VAPID_KEY =
  "BCgPLmc1NBqbuwt92FFHK_qnIZHjh4Is_P-Bk52CtgYEpbEfMJEtp_Z1fOe2fAAtIy9S1cnIP4ZpYYsYM6zj9Iw";

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
          console.log("Permissão para notificações não concedida.");
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

        if (token) {
          console.log("Token FCM:", token);
        } else {
          console.log("Não foi possível obter o token FCM.");
        }
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