"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Marcador } from "./Marcador";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

type Pessoa = {
  nome: string;
  curso?: string;
  ano?: string;
  foto?: string;
};

/**
 * Fica fixa no código.
 *
 * O nome de cada um veio escrito na claquete da própria foto, então o que
 * falta confirmar com o Augusto é só o resto: sobrenome do Pedro, nome
 * completo e curso do Daniel, e se o Hilton continua na lista — ele aparece
 * na foto do hero mas não mandou retrato individual.
 */
const equipe: Pessoa[] = [
  { nome: "Hilton Moulin", curso: "Coordenação" },
  {
    nome: "Augusto Donateli",
    curso: "Informática",
    ano: "2º ano",
    foto: "/equipe/augusto.webp",
  },
  {
    nome: "Laura Fabris Scarpe",
    curso: "Informática",
    ano: "3º ano",
    foto: "/equipe/laura.webp",
  },
  {
    nome: "Pedro",
    curso: "Eletromecânica",
    ano: "3º ano",
    foto: "/equipe/pedro.webp",
  },
  { nome: "Daniel", foto: "/equipe/daniel.webp" },
  {
    nome: "Lucas Grifo da Costa",
    curso: "Monitoria",
    foto: "/equipe/lucas.webp",
  },
];

/** O texto de abertura conta a equipe sozinho: escrito à mão, o número
    envelhecia calado toda vez que alguém entrasse ou saísse. */
const POR_EXTENSO = ["Nenhuma", "Uma", "Duas", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove"];

/**
 * Quanto scroll vertical vale cada pixel andado de lado.
 * Com 1.6, a pessoa rola bem mais do que a fileira anda — dá tempo de olhar
 * cada foto. Com 1 a galeria inteira atravessa num gesto só.
 */
const LENTIDAO = 1.2;

function Cartao({ nome, curso, ano, foto }: Pessoa) {
  return (
    /* O 0.8 acompanha a proporção 4:5 das fotos: é ele que mantém o cartão
       inteiro dentro de 80vh. Com o 0.75 do enquadramento 3:4 antigo, a foto
       passava da tela. */
    <div className="w-[78vw] max-w-[300px] shrink-0 sm:w-[44vw] md:w-[min(calc((100vw-3rem)/2.4),calc(80vh*0.8))] md:max-w-none">
      {foto ? (
        <Image
          src={foto}
          alt={`${nome}, da equipe do Ifesciência`}
          width={1120}
          height={1400}
          sizes="(max-width: 639px) 78vw, (max-width: 767px) 44vw, 580px"
          className="w-full rounded-xl object-cover"
        />
      ) : (
        <Marcador proporcao="4/5" rotulo="foto" />
      )}
      <p className="mt-4 text-lg font-medium sm:text-xl">{nome}</p>
      {curso ? (
        <p className="mt-1 font-mono text-xs text-tinta-3">
          {ano ? `${curso} · ${ano}` : curso}
        </p>
      ) : null}
    </div>
  );
}

export function Equipe() {
  const secaoRef = useRef<HTMLElement>(null);
  const trilhoRef = useRef<HTMLDivElement>(null);
  const cabecalhoRef = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState<number | undefined>(undefined);
  const [preso, setPreso] = useState(true);
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

      // Sem folga extra: com o mesmo recuo dos dois lados, no fim do percurso
      // o último cartão para exatamente à mesma distância da borda que o
      // primeiro começou.
      distancia = Math.max(trilho.scrollWidth - window.innerWidth, 0);

      // Se a fileira couber inteira na tela não há o que percorrer. Prender a
      // página nesse caso só produziria uma tela cheia e imóvel — então a
      // seção vira uma fileira comum.
      if (distancia === 0) {
        setPreso(false);
        setAltura(undefined);
        trilho.style.transform = "";
        return;
      }

      setPreso(true);
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
    // Medir no quadro seguinte: no instante do evento de resize o navegador
    // ainda não refez o layout, e a conta sai com os tamanhos antigos.
    const aoRedimensionar = () => requestAnimationFrame(medir);
    window.addEventListener("resize", aoRedimensionar);
    document.fonts?.ready.then(medir);

    const observador = new ResizeObserver(aoRedimensionar);
    observador.observe(trilho);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRedimensionar);
      observador.disconnect();
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
          {POR_EXTENSO[equipe.length]} pessoas cuidam de tudo: escolher o
          experimento, montar, gravar, editar e explicar. Desde 2022, duas
          gerações de estudantes já passaram pelo projeto.
        </p>
      </div>

      <section ref={secaoRef} className="relative" style={{ height: altura }}>
        <div
          className={`flex items-center overflow-hidden ${
            preso ? "sticky top-0 h-screen py-6" : "py-12"
          }`}
        >
          <div
            ref={trilhoRef}
            /* Recuo igual dos dois lados. Antes o primeiro cartão começava
               alinhado com o título — só que o título já saiu da tela quando a
               galeria está rodando, então aquilo virava um vão vazio à esquerda
               sem nada pra justificar. */
            className="flex min-w-max gap-5 px-6 will-change-transform md:gap-8"
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
