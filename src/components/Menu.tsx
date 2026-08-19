"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const itens = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Experimentos", href: "/experimentos" },
  { rotulo: "O projeto", href: "#projeto" },
];

/**
 * O menu encolhe quando você desce e volta ao normal quando sobe.
 * Devolve espaço de tela pra quem está lendo — importante no celular,
 * onde a barra do Instagram já come um pedaço.
 */
export function Menu() {
  const [encolhido, setEncolhido] = useState(false);

  useEffect(() => {
    let anterior = window.scrollY;
    let agendado = false;

    // O cálculo roda no máximo uma vez por quadro. Sem isso, cada evento de
    // rolagem dispararia uma renderização do React e a página engasga.
    const aoRolar = () => {
      if (agendado) return;
      agendado = true;

      requestAnimationFrame(() => {
        agendado = false;
        const atual = window.scrollY;

        // Só encolhe depois de sair do topo, pra não piscar no começo.
        const deveEncolher = atual > 120 && atual > anterior;
        const deveVoltar = atual < anterior;

        if (deveEncolher) setEncolhido(true);
        else if (deveVoltar) setEncolhido(false);

        anterior = atual;
      });
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-borda bg-creme md:bg-creme/90 md:backdrop-blur">
      <nav
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 transition-all duration-300 ease-out ${
          encolhido ? "py-2" : "py-4"
        }`}
      >
        <Link
          href="/"
          className={`font-titulo font-bold tracking-tight transition-all duration-300 ease-out ${
            encolhido ? "text-lg" : "text-xl"
          }`}
        >
          <span className="text-verde">Ifesciência</span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm text-tinta-2 sm:flex">
          {itens.map((item) => (
            <li key={item.rotulo}>
              <Link
                href={item.href}
                className="transition-colors hover:text-tinta"
              >
                {item.rotulo}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href="https://www.instagram.com/ifesciencia/"
          target="_blank"
          rel="noreferrer"
          className={`rounded-full bg-verde text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-verde-escuro ${
            encolhido ? "px-4 py-1.5" : "px-5 py-2"
          }`}
        >
          Contato
        </a>
      </nav>
    </header>
  );
}
