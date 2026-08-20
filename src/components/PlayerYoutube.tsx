"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * O player do YouTube pesa mais de um megabyte. Numa professora com 4G ruim
 * dentro do navegador do Instagram, isso é a diferença entre a página abrir
 * em 2 segundos ou em 10 — e boa parte nem vai assistir aqui, já viu o vídeo
 * antes no Instagram.
 *
 * Então: mostra a capa com um botão de play e só carrega o player de verdade
 * quando a pessoa toca.
 *
 * O formato é em pé (9:16) porque o acervo é todo de Shorts. Num player
 * deitado o vídeo fica espremido entre duas tarjas pretas enormes.
 */
export function PlayerYoutube({
  youtubeId,
  capa,
  titulo,
}: {
  youtubeId: string;
  capa: string | null;
  titulo: string;
}) {
  const [tocando, setTocando] = useState(false);

  if (tocando) {
    return (
      <div className="aspect-[9/16] w-full overflow-hidden rounded-xl bg-tinta">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={titulo}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTocando(true)}
      aria-label={`Assistir: ${titulo}`}
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-xl border border-borda bg-creme-2"
    >
      {capa ? (
        <Image
          src={capa}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
      ) : null}

      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-verde text-white shadow-sm transition-transform duration-300 ease-out group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>

      <span className="absolute inset-x-0 bottom-0 p-3 text-center font-mono text-[10px] uppercase tracking-widest text-tinta-3">
        assistir no YouTube
      </span>
    </button>
  );
}
