"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * "O projeto" aponta pra `/#projeto`, com a barra, e ela não é detalhe: a
 * seção só existe na home. Como `#projeto` puro, o link não fazia nada em
 * /experimentos e na ficha de cada experimento — o navegador procurava a
 * âncora na página em que já estava, não achava, e ficava parado.
 */
const itens = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Experimentos", href: "/experimentos" },
  { rotulo: "O projeto", href: "/#projeto" },
];

/**
 * A faixa do fim da página onde o menu para de mudar de tamanho.
 *
 * Ele é `sticky`, e sticky entra na altura do documento. Encolher tira 20px
 * dessa altura, e colado no fim da página isso vira um laço fechado: encolhe,
 * a página fica mais curta, o navegador puxa a rolagem pra dentro do novo
 * limite, o puxão é lido como "subiu", o menu cresce, a página alonga, dá
 * espaço pra descer de novo. Com o Lenis empurrando pro fim, não para sozinho
 * — era a vibração no rodapé, e acontecia em toda página que tem menu.
 *
 * 64 é bem mais que os 20px do puxão, de propósito: a folga tem que cobrir o
 * estrago com sobra, e nos últimos 64px de rolagem ninguém repara que o menu
 * ficou do tamanho que estava.
 */
const FOLGA_DO_FIM = 64;

/**
 * O menu encolhe quando você desce e volta ao normal quando sobe.
 * Devolve espaço de tela pra quem está lendo — importante no celular,
 * onde a barra do Instagram já come um pedaço.
 */
export function Menu() {
  const [encolhido, setEncolhido] = useState(false);
  const ref = useRef<HTMLElement>(null);

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
        const limite =
          document.documentElement.scrollHeight - window.innerHeight;

        // Colado no fim, o menu fica do tamanho que está. Ver FOLGA_DO_FIM.
        if (limite - atual > FOLGA_DO_FIM) {
          // Só encolhe depois de sair do topo, pra não piscar no começo.
          const deveEncolher = atual > 120 && atual > anterior;
          const deveVoltar = atual < anterior;

          if (deveEncolher) setEncolhido(true);
          else if (deveVoltar) setEncolhido(false);
        }

        anterior = atual;
      });
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  /**
   * A abertura do site precisa saber a altura do menu pra ocupar o resto
   * exato da primeira tela. Medimos só com o menu no tamanho normal —
   * encolhido o valor seria menor e a conta da primeira dobra sairia errada.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el || encolhido) return;

    const medir = () => {
      const altura = Math.round(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--altura-menu", altura + "px");
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    document.fonts?.ready.then(medir);

    return () => observador.disconnect();
  }, [encolhido]);

  return (
    <header
      ref={ref}
      className="sticky top-0 z-50 border-b border-borda bg-creme md:bg-creme/90 md:backdrop-blur"
    >
      <nav
        className={`mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6 px-6 transition-all duration-300 ease-out ${
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
