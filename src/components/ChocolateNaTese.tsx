"use client";

import { useEffect, useRef, useState } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Enquanto a barra é um marcador, isto fica ligado. Trocar por `false` quando a
 * imagem entrar — o resto do componente não muda.
 */
const MARCADOR = true;

/** Quanto scroll a passagem inteira consome, em pixels. */
const PASSAGEM = 460;
const PASSAGEM_SOLTA = 280;

/** Onde a passagem acontece, na travessia da seção (ou da frase, no celular). */
const MEIO = 0.5;
const MEIO_SOLTA = 0.55;

/**
 * O reflexo prismático. Discreto de propósito — arco-íris cheio ao lado de
 * texto sério vira enfeite de festa. São os verdes e azuis da paleta puxados
 * para roxo e âmbar, que é o caminho que um filme de difração faz de verdade.
 */
const IRIDESCENCIA =
  "#2f9e44 0%, #2a93a8 28%, #6f5aa0 54%, #b8558a 78%, #b07a2a 100%";

/**
 * A barra de chocolate holográfico que passa por cima da tese e a deixa acesa.
 *
 * A frase é *a ciência está presente em diversos aspectos da vida diária*.
 *
 * O objeto não bate em nada e não quebra: ele PASSA, como a luz passa.
 * Chocolate holográfico não brilha sozinho — tem um filme prensado que difrata
 * a luz, e sem luz atravessando é uma barra marrom comum. Então a barra
 * deslizando sobre a frase é o próprio fenômeno acontecendo, e o que ela deixa
 * para trás é a frase iridescente. A ideia é do Augusto.
 *
 * Isso resolveu o que travou oito tentativas antes. A tese fica espremida no
 * meio de um parágrafo denso e não tem folga nenhuma em volta — mas objeto que
 * só passa não precisa de folga. E nada fica coberto parado: a versão anterior
 * pousava em cima da frase e tapava o parágrafo inteiro.
 *
 * O texto acende e não apaga. Uma vez que a luz passou, passou.
 */
export function ChocolateNaTese() {
  const ref = useRef<HTMLDivElement>(null);
  const [pronto, setPronto] = useState(false);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const palco = ref.current;
    const secao = palco?.closest("section");
    if (!palco || !secao) return;

    const tese = secao.querySelector<HTMLElement>("[data-tese]");
    const base = palco.offsetParent as HTMLElement | null;
    if (!tese || !base) return;

    /**
     * O brilho é pintado por cima, em `lighten`, e não trocando a cor do texto.
     *
     * `lighten` fica com o mais claro entre o que está embaixo e o que está em
     * cima, canal a canal. O creme do fundo é mais claro que qualquer cor do
     * reflexo, então ele não muda; a tinta do texto é mais escura que todas,
     * então ela vira o reflexo. Resultado: acende as letras e não pinta o fundo.
     *
     * A alternativa seria `background-clip: text`, que era mais curta e estava
     * errada: texto que quebra em duas linhas tem o fundo pintado numa caixa
     * só, emendada, e a divisa do brilho andaria fora de sincronia com a barra.
     *
     * Uma camada por LINHA, porque `getClientRects` devolve um retângulo por
     * pedaço quebrado — e é isso que dá a divisa reta atravessando as duas.
     */
    const camadas: HTMLElement[] = [];
    const camada = (i: number) => {
      if (camadas[i]) return camadas[i];
      const el = document.createElement("span");
      el.setAttribute("aria-hidden", "true");
      el.style.position = "absolute";
      el.style.pointerEvents = "none";
      el.style.mixBlendMode = "lighten";
      el.style.backgroundImage = `linear-gradient(90deg, ${IRIDESCENCIA})`;
      el.style.backgroundRepeat = "no-repeat";
      el.style.zIndex = "10";
      base.appendChild(el);
      camadas[i] = el;
      return el;
    };

    /** Uma vez aceso, não apaga. Guarda o ponto mais longe que a luz chegou. */
    let maisLonge = 0;
    let agendado = false;

    const posicionar = () => {
      const r = tese.getBoundingClientRect();
      const p = base.getBoundingClientRect();

      /**
       * A barra é pequena e a altura sai da frase, não da largura. Tirando da
       * largura, a proporção de barra dava 158px em cima de uma frase de 44 e o
       * parágrafo inteiro ficava ilegível na passagem.
       */
      const largura = Math.max(96, Math.min(140, r.width * 0.22));
      const altura = Math.round(r.height + 16);
      const centroY = r.top - p.top + r.height / 2;

      palco.style.width = `${largura}px`;
      palco.style.height = `${altura}px`;
      palco.style.left = `${r.left - p.left}px`;
      palco.style.top = `${centroY - altura / 2}px`;

      /** Onde a borda esquerda da barra está, para um dado avanço da passagem. */
      const bordaEm = (q: number) =>
        r.left + (-largura - 20 + q * (r.width + largura * 2 + 40));

      const empilhado = window.matchMedia("(max-width: 767px)").matches;
      const s = secao.getBoundingClientRect();
      const total = empilhado
        ? window.innerHeight + r.height
        : s.height + window.innerHeight;
      if (total <= 0) return;

      let q: number;
      if (reduzido) {
        // Sem movimento: a frase já nasce acesa e a barra não aparece.
        q = 1;
        palco.style.opacity = "0";
      } else {
        /**
         * Grudada, a frase fica imóvel na tela e não serve de relógio — quem
         * marca é a seção. Solta, é a frase que atravessa, e é ela que marca.
         */
        const percorrido = empilhado
          ? window.innerHeight - r.top
          : window.innerHeight - s.top;
        const t = Math.min(Math.max(percorrido / total, 0), 1);
        const janela = (empilhado ? PASSAGEM_SOLTA : PASSAGEM) / total;
        const meio = empilhado ? MEIO_SOLTA : MEIO;
        q = (t - (meio - janela / 2)) / janela;

        palco.style.opacity = q >= 0 && q <= 1 ? "1" : "0";
        if (q >= 0 && q <= 1) {
          palco.style.transform = `translateX(${bordaEm(q) - r.left}px)`;
        }
        q = Math.min(Math.max(q, 0), 1);
      }

      if (q > maisLonge) maisLonge = q;
      const borda = bordaEm(maisLonge);

      /**
       * Cada linha acende da própria borda esquerda até a divisa. O degradê
       * corre pela frase INTEIRA e não se repete por linha: por isso a largura
       * dele é a soma das linhas, e cada uma recebe o pedaço que lhe cabe.
       */
      const pedacos = [...tese.getClientRects()];
      const larguraTotal = pedacos.reduce((soma, x) => soma + x.width, 0);
      let acumulado = 0;

      pedacos.forEach((rect, i) => {
        const el = camada(i);
        const visivel = Math.min(Math.max(borda - rect.left, 0), rect.width);
        el.style.left = `${rect.left - p.left}px`;
        el.style.top = `${rect.top - p.top}px`;
        el.style.height = `${rect.height}px`;
        el.style.width = `${visivel}px`;
        el.style.backgroundSize = `${larguraTotal}px 100%`;
        el.style.backgroundPosition = `${-acumulado}px center`;
        el.style.display = visivel > 0.5 ? "block" : "none";
        acumulado += rect.width;
      });

      // Sobrou camada de um layout anterior com mais linhas: some com ela.
      for (let i = pedacos.length; i < camadas.length; i++) {
        camadas[i].style.display = "none";
      }
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        posicionar();
      });
    };

    setPronto(true);
    posicionar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    document.fonts?.ready.then(aoRolar);
    const observador = new ResizeObserver(aoRolar);
    observador.observe(tese);
    observador.observe(secao);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      observador.disconnect();
      camadas.forEach((el) => el.remove());
    };
  }, [reduzido]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform"
      style={{ opacity: 0, visibility: pronto ? "visible" : "hidden" }}
    >
      {MARCADOR ? (
        <div className="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed border-verde bg-verde-claro">
          <span className="font-mono text-[10px] text-verde-escuro">barra</span>
        </div>
      ) : null}
    </div>
  );
}
