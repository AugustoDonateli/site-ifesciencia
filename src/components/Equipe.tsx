"use client";

import { useEffect, useRef, useState } from "react";
import { Marcador } from "./Marcador";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Fica fixa no código. Sobrenome do Pedro a confirmar com o Augusto.
 */
const equipe = [
  { nome: "Hilton Moulin", curso: "Coordenação", ano: "" },
  { nome: "Augusto Donateli", curso: "Informática", ano: "2º ano" },
  { nome: "Laura Fabris Scarpe", curso: "Informática", ano: "3º ano" },
  { nome: "Pedro", curso: "Eletromecânica", ano: "3º ano" },
  { nome: "Lucas Grifo da Costa", curso: "Monitoria", ano: "" },
];

/**
 * Quanto scroll vertical vale cada pixel andado de lado.
 * Com 1.6, a pessoa rola bem mais do que a fileira anda — dá tempo de olhar
 * cada foto. Com 1 a galeria inteira atravessa num gesto só.
 */
const LENTIDAO = 1.6;

function Cartao({
  nome,
  curso,
  ano,
}: {
  nome: string;
  curso: string;
  ano: string;
}) {
  return (
    <div className="w-[78vw] max-w-[300px] shrink-0 sm:w-[44vw] md:w-[min(34vw,460px,calc(78vh*0.75))] md:max-w-none">
      <Marcador proporcao="3/4" rotulo="foto" />
      <p className="mt-4 text-lg font-medium sm:text-xl">{nome}</p>
      <p className="mt-1 font-mono text-xs text-tinta-3">
        {ano ? `${curso} · ${ano}` : curso}
      </p>
    </div>
  );
}

export function Equipe() {
  const secaoRef = useRef<HTMLElement>(null);
  const trilhoRef = useRef<HTMLDivElement>(null);
  const cabecalhoRef = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState<number | undefined>(undefined);
  const reduzido = usarMovimentoReduzido();

  /**
   * A página prende e a fileira anda de lado — mesma mecânica no celular e
   * no computador.
   *
   * O título fica FORA da área presa de propósito: assim a tela inteira
   * sobra pras fotos, que era o problema de elas ficarem pequenas.
   *
   * A conta: a seção fica alta o bastante pra que a distância vertical
   * percorrida enquanto ela está grudada seja a distância horizontal da
   * fileira multiplicada pela LENTIDAO.
   *
   * O recuo da esquerda é medido a partir do cabeçalho, não calculado com
   * 100vw — 100vw inclui a barra de rolagem e desalinha por uns pixels.
   */
  useEffect(() => {
    const secao = secaoRef.current;
    const trilho = trilhoRef.current;
    const cabecalho = cabecalhoRef.current;
    if (!secao || !trilho || !cabecalho) return;

    let distancia = 0;
    let agendado = false;

    const medir = () => {
      if (reduzido) {
        distancia = 0;
        setAltura(undefined);
        trilho.style.transform = "";
        return;
      }

      distancia = Math.max(trilho.scrollWidth - window.innerWidth + 24, 0);
      setAltura(window.innerHeight + distancia * LENTIDAO);
      posicionar();
    };

    const posicionar = () => {
      if (distancia <= 0) return;
      const total = secao.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const passado = Math.min(
        Math.max(-secao.getBoundingClientRect().top, 0),
        total,
      );
      const progresso = passado / total;
      trilho.style.transform = `translate3d(${-progresso * distancia}px, 0, 0)`;
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
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", medir);
    document.fonts?.ready.then(medir);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", medir);
    };
  }, [reduzido]);

  return (
    <>
      <div
        ref={cabecalhoRef}
        className="mx-auto w-full max-w-6xl px-6 pt-20 md:pt-28"
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          A equipe
        </p>
        <h2 className="text-4xl font-bold sm:text-5xl">
          Quem faz o Ifesciência
        </h2>
        <p className="mt-5 max-w-xl text-tinta-2">
          Cinco pessoas cuidam de tudo: escolher o experimento, montar, gravar,
          editar e explicar. Desde 2022, duas gerações de estudantes já passaram
          pelo projeto.
        </p>
      </div>

      <section ref={secaoRef} className="relative" style={{ height: altura }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden py-8">
          <div
            ref={trilhoRef}
            className="flex min-w-max gap-5 pr-6 will-change-transform md:gap-8"
            /* Alinha o primeiro cartão com o começo do TEXTO do cabeçalho.
               Em CSS puro: 100% é a largura útil (sem a barra de rolagem, que
               é o que estraga a conta quando se usa 100vw), 72rem é o max-w-6xl
               e 1.5rem é o recuo interno do container. Sempre exato, em
               qualquer largura, sem depender de medir na hora certa. */
            style={{
              paddingLeft: "max(1.5rem, calc((100% - 72rem) / 2 + 1.5rem))",
            }}
          >
            {equipe.map((p) => (
              <Cartao key={p.nome} {...p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
