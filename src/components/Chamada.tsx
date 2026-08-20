"use client";

import Link from "next/link";
import { useRef } from "react";
import { CopoQueCai } from "./CopoQueCai";

/**
 * Os experimentos vêm por último, como recompensa de quem desceu a página.
 *
 * Era o único ponto parado do site de propósito. O copo tomou esse lugar:
 * a página agora termina em movimento, e a troca vale porque o copo caindo
 * e se abrindo diz o que a seção quer dizer — está tudo aberto.
 *
 * A seção ficou mais alta de propósito. Queda precisa de espaço vertical
 * para ser lida como queda; curta demais, vira um pulinho.
 */
export function Chamada() {
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const botaoRef = useRef<HTMLAnchorElement>(null);

  return (
    <section className="relative overflow-hidden border-t border-borda bg-creme-2">
      <CopoQueCai tituloRef={tituloRef} botaoRef={botaoRef} />

      <div className="mx-auto w-full max-w-2xl px-6 py-40 text-center md:py-56">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Para professores
        </p>

        <h2 ref={tituloRef} className="text-4xl font-bold sm:text-5xl">
          Todo experimento, aberto
        </h2>

        <p className="mx-auto mt-6 max-w-md text-lg text-tinta-2">
          Cada vídeo do Ifesciência vira uma ficha com os materiais, o passo a
          passo, o que costuma dar errado e um PDF para imprimir. Sem cadastro e
          sem custo, para qualquer professor do Brasil.
        </p>

        <Link
          ref={botaoRef}
          href="/experimentos"
          className="relative z-30 mt-40 inline-block rounded-full bg-verde px-8 py-4 font-medium text-white transition-colors hover:bg-verde-escuro md:mt-52"
        >
          Ver experimentos
        </Link>
      </div>
    </section>
  );
}
