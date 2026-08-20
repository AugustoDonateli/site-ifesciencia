"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Medidas tiradas dos quadros de verdade, não chutadas.
 *
 * O objeto DESCE 42px dentro da própria imagem entre o primeiro quadro e os
 * seguintes — sobra da queda que veio no vídeo. Sem corrigir, o copo inteiro
 * pousa num lugar e as metades aparecem em outro.
 *
 * E ele ocupa pouco mais da metade da imagem, então o tamanho é definido pela
 * altura do COPO; a caixa sai daí.
 */
const QUADROS = 13;
const BASE_POR_QUADRO = [364, 394, 401, 402, 403, 404, 405, 405, 405, 406, 406, 406, 406];
const BASE_REFERENCIA = 406;

const ALTURA_DO_COPO = 150;
const ESCALA = ALTURA_DO_COPO / 253;
const LARGURA = Math.round(280 * ESCALA);
const ALTURA = Math.round(460 * ESCALA);
const BASE = Math.round(BASE_REFERENCIA * ESCALA);

/** Quanto scroll a queda inteira consome. Curta demais, vira pulinho. */
const PERCURSO = 1100;

const SOLTA = 0.3;
const POUSA = 0.62;

/**
 * A chamada final, com o copo caindo em cima do botão.
 *
 * A seção deixou de ser centralizada. Centralizada, qualquer coisa que caísse
 * do texto até o botão passava por cima do parágrafo — não existia posição que
 * resolvesse isso. Com o texto à esquerda e o botão à direita, o copo cai por
 * uma faixa livre e não cruza uma letra sequer.
 *
 * De quebra, ficou igual ao resto do site: "O projeto", "A equipe" e o
 * catálogo são todos alinhados à esquerda. A centralizada era a exceção.
 */
export function Chamada() {
  const secaoRef = useRef<HTMLElement>(null);
  const blocoRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const paragrafoRef = useRef<HTMLParagraphElement>(null);
  const botaoRef = useRef<HTMLAnchorElement>(null);
  const copoRef = useRef<HTMLDivElement>(null);
  const [quadro, setQuadro] = useState(0);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const secao = secaoRef.current;
    const bloco = blocoRef.current;
    const copo = copoRef.current;
    const titulo = tituloRef.current;
    const paragrafo = paragrafoRef.current;
    const botao = botaoRef.current;
    if (!secao || !bloco || !copo || !titulo || !paragrafo || !botao) return;

    let x = 0;
    let inicioY = 0;
    let fimY = 0;
    let agendado = false;

    /**
     * Tudo medido a partir do BLOCO, que é quem posiciona o copo. Medir contra
     * o palco travado foi o erro anterior: o bloco fica centralizado dentro
     * dele, e essa sobra virava deslocamento na hora de pousar.
     */
    const medir = () => {
      const b = bloco.getBoundingClientRect();
      const alvo = botao.getBoundingClientRect();

      // Cai em cima do botão: mesma linha vertical do centro dele.
      x = alvo.left - b.left + alvo.width / 2;
      /**
       * De onde ele cai muda com o formato da tela, e isso não é detalhe.
       *
       * No computador as colunas ficam lado a lado: o copo cai pela faixa da
       * direita, que está livre, então pode começar lá em cima.
       *
       * No celular as colunas empilham e o botão vai parar EMBAIXO do texto —
       * começar lá em cima faria ele atravessar o parágrafo inteiro, que é
       * exatamente o que a gente está consertando. Lá ele começa no vão entre
       * o texto e o botão.
       */
      const empilhado = window.matchMedia("(max-width: 767px)").matches;
      inicioY = empilhado
        ? paragrafo.getBoundingClientRect().bottom - b.top - BASE + 24
        : -BASE;
      fimY = alvo.top - b.top - BASE;
      posicionar();
    };

    const posicionar = () => {
      const total = secao.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const passado = Math.min(
        Math.max(-secao.getBoundingClientRect().top, 0),
        total,
      );
      const p = passado / total;

      const por = (y: number, giro = 0) =>
        `translate(${x}px, ${y}px) translateX(-50%) rotate(${giro}deg)`;

      if (reduzido) {
        copo.style.transform = por(fimY);
        botao.style.transform = "";
        setQuadro(QUADROS - 1);
        return;
      }

      if (p < SOLTA) {
        const balanco = Math.sin(p * 55) * 2.5;
        copo.style.transform = por(inicioY, balanco);
        botao.style.transform = "";
        setQuadro(0);
        return;
      }

      if (p < POUSA) {
        const q = (p - SOLTA) / (POUSA - SOLTA);
        const caida = q * q;
        copo.style.transform = por(
          inicioY + (fimY - inicioY) * caida,
          (1 - caida) * 3.5,
        );
        botao.style.transform = "";
        setQuadro(0);
        return;
      }

      const q = (p - POUSA) / (1 - POUSA);
      copo.style.transform = por(fimY);
      setQuadro(Math.min(Math.floor(q * QUADROS), QUADROS - 1));

      /**
       * O botão leva o tranco: achata no instante da batida e volta.
       * É isto que separa objeto que interage de adesivo colado por cima.
       */
      const tranco = Math.max(0, 1 - q * 4);
      botao.style.transform = `scaleY(${1 - 0.14 * tranco}) scaleX(${
        1 + 0.09 * tranco
      })`;
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        posicionar();
      });
    };

    medir();
    const aoRedimensionar = () => requestAnimationFrame(medir);
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRedimensionar);
    document.fonts?.ready.then(medir);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRedimensionar);
    };
  }, [reduzido]);

  return (
    <section
      ref={secaoRef}
      className="relative border-t border-borda bg-creme-2"
      style={{ height: `calc(100svh + ${PERCURSO}px)` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          ref={blocoRef}
          className="relative mx-auto w-full max-w-[1240px] px-6"
        >
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:items-stretch md:gap-20">
            <div className="max-w-xl">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
                Para professores
              </p>

              <h2 ref={tituloRef} className="text-4xl font-bold sm:text-5xl">
                Todo experimento, aberto
              </h2>

              <p ref={paragrafoRef} className="mt-6 text-lg text-tinta-2">
                Cada vídeo do Ifesciência vira uma ficha com os materiais, o
                passo a passo, o que costuma dar errado e um PDF para imprimir.
                Sem cadastro e sem custo, para qualquer professor do Brasil.
              </p>
            </div>

            {/* No celular a coluna vai parar embaixo do texto, então o recuo
                de cima é o que dá espaço pra queda acontecer sem cruzar nada. */}
            <div className="mt-56 flex flex-col justify-end md:mt-0 md:min-h-[420px]">
              <Link
                ref={botaoRef}
                href="/experimentos"
                className="relative z-10 inline-block self-center rounded-full bg-verde px-8 py-4 font-medium text-white transition-colors duration-200 hover:bg-verde-escuro md:self-start"
              >
                Ver experimentos
              </Link>
            </div>
          </div>

          <div
            ref={copoRef}
            className="pointer-events-none absolute left-0 top-0 z-[15] will-change-transform"
            style={{ width: LARGURA, height: ALTURA }}
          >
            {/* Todos os quadros montados de uma vez: trocar o endereço da
                imagem faria o navegador buscar arquivo no meio da rolagem. */}
            {Array.from({ length: QUADROS }, (_, i) => (
              <Image
                key={i}
                src={`/objetos/copo-${String(i).padStart(2, "0")}.webp`}
                alt=""
                width={280}
                height={460}
                priority={i === 0}
                className="absolute inset-0 h-full w-full object-contain"
                style={{
                  opacity: i === quadro ? 1 : 0,
                  transform: `translateY(${
                    (BASE_REFERENCIA - BASE_POR_QUADRO[i]) * ESCALA
                  }px)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
