"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleInstall = (event: any) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleInstall
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleInstall
      );
    };
  }, []);

  async function instalarApp() {
    if (!installPrompt) return;

    installPrompt.prompt();

    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      console.log("Aplicativo instalado");
    }

    setInstallPrompt(null);
  }

  if (!installPrompt) return null;

  return (
    <button
      onClick={instalarApp}
      className="
        fixed 
        bottom-24 
        right-4 
        bg-black 
        text-white 
        px-5 
        py-3 
        rounded-xl 
        shadow-lg 
        font-bold
        z-50
      "
    >
      📲 Instalar App
    </button>
  );
}