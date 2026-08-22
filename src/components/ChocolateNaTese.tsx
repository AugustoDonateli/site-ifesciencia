"use client";

import { useEffect, useRef, useState } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Enquanto a barra é um marcador, isto fica ligado. Trocar por `false` quando a
 * imagem entrar — o resto do componente não muda.
 */
const MARCADOR = true;

/**
 * Quanto scroll a barra leva pra entrar e quanto leva pra abrir, em PIXELS.
 *
 * Em pixels e não em fração porque a seção tem alturas diferentes no celular e
 * no computador — a mesma fração viraria velocidades diferentes. Lição da queda
 * do copo.
 */
const ENTRADA = 320;
const ABERTURA = 420;

/** Onde a barra encosta na frase, na travessia da seção. */
const POUSA = 0.52;

/**
 * No celular a conta é outra, e o motivo não é estético.
 *
 * A coluna de texto só gruda a partir de `md`. Solta, a frase sobe com a
 * rolagem, e aí a travessia da SEÇÃO deixa de dizer onde ela está: medido, a
 * abertura terminava com a frase em −418, bem fora da tela. Quem marca o tempo
 * lá é a própria frase atravessando o quadro.
 *
 * A janela também encurta. A frase cruza a tela inteira em cerca de 880px de
 * rolagem, e os 740 do computador não caberiam sem espremer o pouso contra a
 * borda de cima.
 */
const ENTRADA_SOLTA = 180;
const ABERTURA_SOLTA = 220;
const POUSA_SOLTA = 0.55;

/**
 * A barra de chocolate holográfico que parte em cima da tese do projeto.
 *
 * A frase é *a ciência está presente em diversos aspectos da vida diária*, e a
 * barra existe pra demonstrá-la em vez de deixar ela só afirmada: chocolate
 * holográfico é chocolate com um adesivo prensado — o objeto mais banal
 * possível, com um arco-íris dentro. Ela cobre a frase, parte, e as metades se
 * abrem devolvendo a frase.
 *
 * Foram oito lugares testados antes deste. O que reprovou os outros sete foi o
 * Augusto: "ele só existe". O objeto tem que SER a ideia da seção, não ficar do
 * lado dela — o copo abre em cima do botão que abre o catálogo, a bola é
 * literalmente alcance. Aqui, trocar o chocolate por outro objeto quebraria o
 * sentido, e é isso que faz ele valer o lugar.
 *
 * Entra deslizando de lado, não caindo: cair significaria atravessar o
 * parágrafo inteiro de cima, que é exatamente a reclamação que o copo já rendeu.
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
    if (!tese) return;

    const cima = palco.children[0] as HTMLElement;
    const baixo = palco.children[1] as HTMLElement;
    if (!cima || !baixo) return;

    let agendado = false;

    const posicionar = () => {
      /**
       * A barra é medida contra a frase a cada quadro, e não guardada de uma
       * vez. A frase muda de tamanho quando o texto reflui — outra largura de
       * tela, outra quebra de linha — e medida guardada sai do lugar calada.
       * Foi assim que o copo foi parar em cima do título.
       */
      const r = tese.getBoundingClientRect();

      /**
       * A referência é quem POSICIONA a barra, não a barra.
       *
       * `left` e `top` de um absoluto são relativos ao `offsetParent`, então
       * medir contra o retângulo do próprio palco fazia a conta se referenciar
       * a si mesma: cada quadro reposicionava a barra a partir de onde ela já
       * estava. Ela nascia no topo da coluna e nunca chegava na frase.
       */
      const base = palco.offsetParent as HTMLElement | null;
      if (!base) return;
      const p = base.getBoundingClientRect();

      /**
       * A barra cobre a frase e sobra um pouco pros lados, senão ela fica
       * rente demais e não lê como objeto pousado em cima de alguma coisa.
       * A altura sai da largura pra barra não distorcer: proporção de barra
       * deitada, umas seis divisões por duas.
       */
      const largura = r.width + 24;
      const altura = Math.round(largura * 0.3);
      const centroX = r.left - p.left + r.width / 2;
      const centroY = r.top - p.top + r.height / 2;

      palco.style.width = `${largura}px`;
      palco.style.height = `${altura}px`;
      palco.style.left = `${centroX - largura / 2}px`;
      palco.style.top = `${centroY - altura / 2}px`;

      if (reduzido) {
        palco.style.opacity = "0";
        return;
      }

      /**
       * Grudada, a frase fica imóvel na tela e não serve de relógio — quem
       * marca é a seção. Solta, é a frase que atravessa, e é ela que marca.
       */
      const empilhado = window.matchMedia("(max-width: 767px)").matches;
      const total = empilhado
        ? window.innerHeight + r.height
        : secao.getBoundingClientRect().height + window.innerHeight;
      if (total <= 0) return;

      const percorrido = empilhado
        ? window.innerHeight - r.top
        : window.innerHeight - secao.getBoundingClientRect().top;
      const t = Math.min(Math.max(percorrido / total, 0), 1);

      const pousa = empilhado ? POUSA_SOLTA : POUSA;
      const solta = pousa - (empilhado ? ENTRADA_SOLTA : ENTRADA) / total;
      const fim = pousa + (empilhado ? ABERTURA_SOLTA : ABERTURA) / total;

      if (t < solta) {
        palco.style.opacity = "0";
        return;
      }

      palco.style.opacity = "1";

      if (t < pousa) {
        // Entrada: desliza da esquerda e desacelera até encostar.
        const q = (t - solta) / (pousa - solta);
        const e = 1 - Math.pow(1 - q, 3);
        const x = -(largura + centroX) * (1 - e);
        palco.style.transform = `translateX(${x}px)`;
        cima.style.transform = "";
        baixo.style.transform = "";
        return;
      }

      palco.style.transform = "translateX(0px)";

      /**
       * A abertura. O tranco no começo é o estalo da quebra; depois as metades
       * só afastam. Vertical de propósito: é a frase que aparece no vão, e ela
       * está deitada.
       */
      const q = Math.min((t - pousa) / (fim - pousa), 1);
      const tranco = Math.max(0, 1 - q * 12);
      const abre = Math.pow(Math.max(0, (q - 0.04) / 0.96), 1.3);

      cima.style.transform = `translateY(${
        -abre * altura * 0.62 - tranco * 3
      }px) rotate(${-abre * 4}deg)`;
      baixo.style.transform = `translateY(${
        abre * altura * 0.68 + tranco * 3
      }px) rotate(${abre * 4}deg)`;
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
    };
  }, [reduzido]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform"
      style={{ opacity: 0, visibility: pronto ? "visible" : "hidden" }}
    >
      {/* Duas metades, cada uma a sua própria caixa: quebra de barra é corpo
          rígido, então isto é código puro. A imagem entra depois, cortada em
          duas com a borda irregular. */}
      <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden will-change-transform">
        {MARCADOR ? (
          <div className="flex h-full w-full items-end justify-center rounded-t-lg border-2 border-b-0 border-dashed border-verde bg-verde-claro">
            <span className="pb-1 font-mono text-[10px] text-verde-escuro">
              metade de cima
            </span>
          </div>
        ) : null}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden will-change-transform">
        {MARCADOR ? (
          <div className="flex h-full w-full items-start justify-center rounded-b-lg border-2 border-t-0 border-dashed border-verde bg-verde-claro">
            <span className="pt-1 font-mono text-[10px] text-verde-escuro">
              metade de baixo
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
