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

const APOIADO = 0.3;
const POUSA = 0.62;

export function Chamada() {
  const secaoRef = useRef<HTMLElement>(null);
  const blocoRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const botaoRef = useRef<HTMLAnchorElement>(null);
  const copoRef = useRef<HTMLDivElement>(null);
  const [quadro, setQuadro] = useState(0);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const secao = secaoRef.current;
    const bloco = blocoRef.current;
    const copo = copoRef.current;
    const titulo = tituloRef.current;
    const botao = botaoRef.current;
    if (!secao || !bloco || !copo || !titulo || !botao) return;

    let inicioY = 0;
    let fimY = 0;
    let agendado = false;

    /**
     * As distâncias são medidas a partir do BLOCO DE TEXTO, que é quem
     * posiciona o copo — não do palco travado. Medir contra o palco foi o
     * erro que fazia as metades pousarem 200px abaixo do botão: o bloco é
     * centralizado dentro do palco, e essa sobra virava desalinhamento.
     */
    const medir = () => {
      const b = bloco.getBoundingClientRect();
      // Encosta no título, invadindo 8px: assim ele fica apoiado NO texto,
      // não pairando acima dele.
      inicioY = titulo.getBoundingClientRect().top - b.top - BASE + 8;
      fimY = botao.getBoundingClientRect().top - b.top - BASE;
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
        botao.style.transform = "";
        setQuadro(QUADROS - 1);
        return;
      }

      if (p < APOIADO) {
        const balanco = Math.sin(p * 55) * 2.5;
        copo.style.transform = `translate(-50%, ${inicioY}px) rotate(${balanco}deg)`;
        botao.style.transform = "";
        setQuadro(0);
        return;
      }

      if (p < POUSA) {
        const q = (p - APOIADO) / (POUSA - APOIADO);
        const caida = q * q;
        copo.style.transform = `translate(-50%, ${
          inicioY + (fimY - inicioY) * caida
        }px) rotate(${(1 - caida) * 3.5}deg)`;
        botao.style.transform = "";
        setQuadro(0);
        return;
      }

      const q = (p - POUSA) / (1 - POUSA);
      copo.style.transform = `translate(-50%, ${fimY}px)`;
      setQuadro(Math.min(Math.floor(q * QUADROS), QUADROS - 1));

      /**
       * O botão leva o tranco.
       *
       * É isto que separa objeto que interage de adesivo colado por cima:
       * o site responde ao impacto. O botão achata no instante da batida e
       * volta rápido, do jeito que coisa sólida faz quando algo cai nela.
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
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          ref={blocoRef}
          className="relative mx-auto w-full max-w-2xl px-6 text-center"
        >
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

          {/* z-10: as metades se abrem NA FRENTE do botão, senão a quebra
              sumiria atrás dele. */}
          <Link
            ref={botaoRef}
            href="/experimentos"
            className="relative z-10 mt-32 inline-block rounded-full bg-verde px-8 py-4 font-medium text-white transition-colors duration-200 hover:bg-verde-escuro"
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
