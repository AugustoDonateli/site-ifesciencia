"use client";

import { useState } from "react";

/**
 * WhatsApp é o canal de distribuição real do site: professora acha, gosta e
 * manda no grupo das colegas. Um botão de compartilhar não é enfeite aqui,
 * é o mecanismo de crescimento.
 *
 * No celular usa o menu de compartilhamento do próprio sistema, que já traz
 * o WhatsApp na frente. No computador, copia o link.
 */
export function BotaoCompartilhar({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);

  const compartilhar = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch {
        // Pessoa fechou o menu. Não é erro, não faz nada.
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <button
      type="button"
      onClick={compartilhar}
      className="inline-flex items-center gap-2 rounded-full border border-borda px-5 py-2.5 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta"
    >
      {copiado ? "Link copiado" : "Compartilhar"}
      <span aria-hidden="true" className="text-tinta-3">
        {copiado ? "✓" : "↗"}
      </span>
    </button>
  );
}
