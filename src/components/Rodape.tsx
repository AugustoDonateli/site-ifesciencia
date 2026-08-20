"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type Rede = { rotulo: string; href: string };

/**
 * O rodapé aparece por trás: a página desliza pra cima e revela ele,
 * em vez de ele simplesmente vir depois.
 *
 * Só no computador. No celular um rodapé fixo briga com as barras do
 * navegador do Instagram, então lá ele é um rodapé normal — decisão
 * de propósito, não "desligado no celular".
 */
export function Rodape({ redes }: { redes: Rede[] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const medir = () => {
      const altura = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        "--altura-rodape",
        `${altura}px`,
      );
      document.documentElement.setAttribute("data-rodape-pronto", "");
    };

    medir();

    // Três gatilhos, porque um só não basta:
    // o ResizeObserver não entrega nada com a aba em segundo plano,
    // e a altura muda de verdade quando as fontes terminam de carregar.
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    window.addEventListener("resize", medir);
    document.fonts?.ready.then(medir);

    return () => {
      observador.disconnect();
      window.removeEventListener("resize", medir);
      document.documentElement.removeAttribute("data-rodape-pronto");
    };
  }, []);

  return (
    <footer ref={ref} className="rodape-atras border-t border-borda bg-creme">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-titulo text-2xl font-bold tracking-tight">
              <span className="text-verde">Ifesciência</span>
            </p>
            <p className="mt-3 text-sm text-tinta-2">
              Projeto de divulgação científica do Instituto Federal do Espírito
              Santo, campus Cachoeiro de Itapemirim.
            </p>
            <p className="mt-4 text-sm text-tinta-2">
              Financiado pela Fapes — Fundação de Amparo à Pesquisa e Inovação
              do Espírito Santo.
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-tinta-3">
                Site
              </p>
              <ul className="flex flex-col gap-2 text-sm text-tinta-2">
                <li>
                  <Link href="/#projeto" className="hover:text-tinta">
                    O projeto
                  </Link>
                </li>
                <li>
                  <Link href="/experimentos" className="hover:text-tinta">
                    Experimentos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-tinta-3">
                Redes
              </p>
              <ul className="flex flex-col gap-2 text-sm text-tinta-2">
                {redes.map((rede) => (
                  <li key={rede.rotulo}>
                    <a
                      href={rede.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-tinta"
                    >
                      {rede.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-14 border-t border-borda pt-8 font-mono text-xs text-tinta-3">
          © {new Date().getFullYear()} Ifesciência · Ifes Campus Cachoeiro de
          Itapemirim
        </p>
      </div>
    </footer>
  );
}
