importScripts("https://www.gstatic.com/firebasejs/12.17.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.17.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCE_higu6acP7qlQbGQfglYnYSY6qr6-xg",
  authDomain: "barbearia-app-3e6a8.firebaseapp.com",
  projectId: "barbearia-app-3e6a8",
  storageBucket: "barbearia-app-3e6a8.firebasestorage.app",
  messagingSenderId: "342597064819",
  appId: "1:342597064819:web:0363e5aee19bf77cd3b206",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Notificação recebida:",
    payload
  );

  const notificationTitle =
    payload.notification?.title || "Novo agendamento!";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "Você recebeu um novo agendamento.",
    icon: "/logo.png",
    badge: "/logo.png",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});