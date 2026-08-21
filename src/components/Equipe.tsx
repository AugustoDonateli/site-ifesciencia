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
 * falta confirmar com o Augusto é só o resto: sobrenome do Pedro, e nome
 * completo, curso e ano do Daniel.
 */
const equipe: Pessoa[] = [
  {
    nome: "Hilton Moulin",
    curso: "Coordenação",
    foto: "/equipe/hilton.webp",
  },
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
const POR_EXTENSO = [
  "Nenhuma",
  "Uma",
  "Duas",
  "Três",
  "Quatro",
  "Cinco",
  "Seis",
  "Sete",
  "Oito",
  "Nove",
];

/**
 * Quanto scroll vertical vale cada pixel andado de lado.
 *
 * Acima de 1 a pessoa rola mais do que a fileira anda, e sobra tempo de olhar
 * cada foto; abaixo de 1 a galeria atravessa depressa. Estava em 1.2 e ficou
 * arrastado, ainda mais depois que o cartão cresceu — cartão maior é fileira
 * mais longa, e a distância a percorrer cresceu junto sem ninguém pedir.
 */
const LENTIDAO = 0.9;

function Cartao({ nome, curso, ano, foto }: Pessoa) {
  return (
    /* A largura vem de --larg, definida uma vez na seção: o recuo do palco
       precisa da altura do cartão, e duas contas separadas sairiam do ar na
       primeira vez que alguém mexesse numa delas. */
    <div className="w-[78vw] max-w-[300px] shrink-0 sm:w-[44vw] md:w-[var(--larg)] md:max-w-none">
      {foto ? (
        <Image
          src={foto}
          alt={`${nome}, da equipe do Ifesciência`}
          width={1440}
          height={1800}
          sizes="(max-width: 639px) 78vw, (max-width: 767px) 44vw, 900px"
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

      {/* Todo o dimensionamento da galeria sai daqui.

          --teto existe por causa da resolução das fotos, e por isso segue o
          DPR do monitor: num monitor comum um cartão de 900px pede 900px de
          imagem e todas têm 1122 ou mais; numa tela 2x o mesmo cartão pediria
          1800px, que nenhuma tem, e o retrato amacia. 640 é o limite lá.

          --larg é o menor entre três limites: três cartões por tela, caber
          inteiro na altura, e o teto. A conta da altura desconta o que está em
          volta em vez de chutar uma fração — cada pixel de largura vira 1,25
          de foto (proporção 4:5) mais 64px de nome e curso, e os 160px são os
          recuos de cima e de baixo. A regra anterior era `70vh*0.8`, herdada
          de quando a foto era 3:4, e numa tela de 1037px parava o cartão em
          581 deixando 250px de branco que nada preenchia. */}
      <section
        ref={secaoRef}
        className="relative [--teto:900px] [@media(min-resolution:2dppx)]:[--teto:640px]"
        style={
          {
            height: altura,
            "--larg":
              "min(calc((100vw - 3rem) / 3), calc(80svh - 160px), var(--teto))",
            "--alt": "calc(var(--larg) * 1.25 + 64px)",
          } as React.CSSProperties
        }
      >
        {/* O recuo de cima centraliza o cartão, mas com piso.

            Centralizar de verdade (`items-center`) dava 2px de folga do menu
            numa tela de 720px — o cartão passava por baixo dele. Encostar no
            alto com recuo fixo resolvia isso e criava o problema oposto: a
            sobra ia inteira pro rodapé da tela.

            Com `max`, ele centraliza enquanto der e trava nos 5rem quando a
            tela é baixa. O menu tem 69px e fica grudado no topo junto com o
            palco, então esse piso é o que garante que um não cubra o outro. */}
        <div
          className={`flex overflow-hidden ${
            preso
              ? "sticky top-0 h-screen items-start pb-6"
              : "items-center py-12"
          }`}
          style={
            preso
              ? {
                  paddingTop: "max(5rem, calc((100svh - var(--alt)) / 2))",
                }
              : undefined
          }
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
