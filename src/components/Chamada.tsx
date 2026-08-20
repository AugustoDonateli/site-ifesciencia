"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Medidas tiradas dos quadros de verdade, não chutadas.
 *
 * O objeto DESCE 42px dentro da própria caixa entre o primeiro quadro e os
 * seguintes — é a queda que sobrou do vídeo. Sem corrigir isso, o copo
 * inteiro pousava num lugar e as metades apareciam em outro, mais embaixo.
 *
 * E o objeto ocupa pouco mais da metade da caixa: dimensionar pela caixa
 * deixava o copo pequeno demais na tela.
 */
const QUADROS = 13;

/** Onde fica a base do objeto em cada quadro, na imagem original de 460px. */
const BASE_POR_QUADRO = [364, 394, 401, 402, 403, 404, 405, 405, 405, 406, 406, 406, 406];
const BASE_REFERENCIA = 406;

/** Altura que o copo tem que ter na tela. Tudo o mais sai daqui. */
const ALTURA_DO_COPO = 150;
const ESCALA = ALTURA_DO_COPO / 253;

const LARGURA = Math.round(280 * ESCALA);
const ALTURA = Math.round(460 * ESCALA);

/** Distância do topo da caixa até a base do copo. É por aqui que ele encosta. */
const BASE = Math.round(BASE_REFERENCIA * ESCALA);

/** Quanto scroll a queda inteira consome. Queda curta demais vira pulinho. */
const PERCURSO = 1100;

/**
 * Os experimentos vêm por último, como recompensa de quem desceu a página.
 *
 * A seção PRENDE, como a galeria da equipe. Antes a animação estava amarrada
 * à seção atravessando a tela, e o resultado era que a queda já tinha
 * acontecido quando a seção ficava bem visível — ninguém via o copo cair.
 * Preso, você assiste a queda acontecer.
 *
 * O copo passa ATRÁS do parágrafo e à FRENTE do botão. Atravessando o texto
 * por cima, ele tapava justamente a explicação; atrás de tudo, a quebra
 * sumiria embaixo do botão.
 *
 * A IA fez a quebra em duas metades com o interior oco à mostra — que só ela
 * faz. O código faz a queda, que é o que código faz bem e de graça.
 */
export function Chamada() {
  const secaoRef = useRef<HTMLElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const botaoRef = useRef<HTMLAnchorElement>(null);
  const copoRef = useRef<HTMLDivElement>(null);
  const [quadro, setQuadro] = useState(0);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const secao = secaoRef.current;
    const palco = palcoRef.current;
    const copo = copoRef.current;
    const titulo = tituloRef.current;
    const botao = botaoRef.current;
    if (!secao || !palco || !copo || !titulo || !botao) return;

    let inicioY = 0;
    let fimY = 0;
    let agendado = false;

    const medir = () => {
      const p = palco.getBoundingClientRect();
      // Apoiado no título: a base do copo encosta exatamente no topo do texto,
      // sem cobrir letra nenhuma.
      inicioY = titulo.getBoundingClientRect().top - p.top - BASE;
      // Pousa ENCOSTANDO na borda de cima do botão, sem invadir: as duas
      // metades são largas e cobririam o texto "Ver experimentos".
      fimY = botao.getBoundingClientRect().top - p.top - BASE;
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

      if (reduzido) {
        copo.style.transform = `translate(-50%, ${fimY}px)`;
        setQuadro(QUADROS - 1);
        return;
      }

      const APOIADO = 0.3;
      const POUSA = 0.62;

      if (p < APOIADO) {
        // Balanço curto e nervoso, de copo mal equilibrado numa borda.
        const balanco = Math.sin(p * 55) * 2.5;
        copo.style.transform = `translate(-50%, ${inicioY}px) rotate(${balanco}deg)`;
        setQuadro(0);
        return;
      }

      if (p < POUSA) {
        const q = (p - APOIADO) / (POUSA - APOIADO);
        // Acelera como coisa caindo, em vez de descer em velocidade constante.
        const caida = q * q;
        copo.style.transform = `translate(-50%, ${
          inicioY + (fimY - inicioY) * caida
        }px) rotate(${(1 - caida) * 3.5}deg)`;
        setQuadro(0);
        return;
      }

      const q = (p - POUSA) / (1 - POUSA);
      copo.style.transform = `translate(-50%, ${fimY}px)`;
      setQuadro(Math.min(Math.floor(q * QUADROS), QUADROS - 1));
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
      <div
        ref={palcoRef}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        <div className="relative mx-auto w-full max-w-2xl px-6 text-center">
          <p className="relative z-20 mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
            Para professores
          </p>

          <h2
            ref={tituloRef}
            className="relative z-20 text-4xl font-bold sm:text-5xl"
          >
            Todo experimento, aberto
          </h2>

          {/* z-20: o copo passa por trás, então a explicação continua legível. */}
          <p className="relative z-20 mx-auto mt-6 max-w-md text-lg text-tinta-2">
            Cada vídeo do Ifesciência vira uma ficha com os materiais, o passo a
            passo, o que costuma dar errado e um PDF para imprimir. Sem cadastro
            e sem custo, para qualquer professor do Brasil.
          </p>

          {/* z-10: o copo se parte na FRENTE do botão, senão a quebra sumiria. */}
          <Link
            ref={botaoRef}
            href="/experimentos"
            className="relative z-10 mt-32 inline-block rounded-full bg-verde px-8 py-4 font-medium text-white transition-colors hover:bg-verde-escuro"
          >
            Ver experimentos
          </Link>

          <div
            ref={copoRef}
            className="pointer-events-none absolute left-1/2 top-0 z-[15] will-change-transform"
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
                  // Alinha a base de todos os quadros no mesmo lugar: o objeto
                  // desce dentro da própria imagem ao longo da sequência.
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
