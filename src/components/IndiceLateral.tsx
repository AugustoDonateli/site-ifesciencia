"use client";

import { useEffect, useState } from "react";

export type ItemIndice = { id: string; rotulo: string };

/**
 * Só no computador. No celular a barra de progresso sozinha já responde
 * "falta muito?", e um índice ali roubaria a largura da leitura.
 */
export function IndiceLateral({ itens }: { itens: ItemIndice[] }) {
  const [ativo, setAtivo] = useState(itens[0]?.id ?? "");

  useEffect(() => {
    const secoes = itens
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (secoes.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        // A seção que está mais perto do topo da tela é a "atual".
        const visiveis = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visiveis[0]) setAtivo(visiveis[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    secoes.forEach((s) => observador.observe(s));
    return () => observador.disconnect();
  }, [itens]);

  return (
    <nav aria-label="Nesta página" className="hidden lg:block">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
        Nesta página
      </p>
      <ul className="flex flex-col gap-2.5 border-l border-borda">
        {itens.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`-ml-px block border-l-2 pl-4 text-sm transition-colors ${
                ativo === item.id
                  ? "border-verde font-medium text-tinta"
                  : "border-transparent text-tinta-3 hover:text-tinta-2"
              }`}
            >
              {item.rotulo}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
