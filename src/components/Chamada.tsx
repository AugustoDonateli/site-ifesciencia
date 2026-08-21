"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Medidas tiradas dos quadros de verdade, não chutadas.
 *
 * Desta vez os quadros já chegam alinhados. O vídeo pediu só a divisão — o
 * copo parado, sem cair —, e mesmo assim o modelo desceu e ampliou as metades
 * 327px enquanto elas se abriam. Isso foi corrigido quadro a quadro na
 * exportação, normalizando a altura e pregando a base num ponto fixo.
 *
 * Medido depois: base, altura e centro variam 2px na sequência inteira, que é
 * ruído de arredondamento. Por isso não existe mais correção aqui no CSS.
 *
 * Dentro do arquivo de 406x329 o copo tem 309px de altura e a base dele fica a
 * 322px do topo. O tamanho é definido pela altura do COPO, nunca pela da
 * imagem — a caixa sai daí.
 */
const QUADROS = 13;
const ARQUIVO_LARGURA = 406;
const ARQUIVO_ALTURA = 329;

const ALTURA_DO_COPO = 150;
const ESCALA = ALTURA_DO_COPO / 309;
const LARGURA = Math.round(ARQUIVO_LARGURA * ESCALA);
const ALTURA = Math.round(ARQUIVO_ALTURA * ESCALA);
const BASE = Math.round(322 * ESCALA);

/**
 * Os tempos da queda, medidos na travessia da seção pela tela.
 *
 * Sem a seção travada, o copo desce junto com a página. O que se vê como queda
 * não é a distância que ele percorre, é a diferença entre ela e o scroll gasto
 * no caminho — se a página sobe tanto quanto o copo desce, ele fica parado no
 * ar.
 *
 * Por isso a janela é um orçamento em PIXELS, não uma fração da travessia. Com
 * fração, a mesma regra dava quedas de velocidades diferentes: a seção mede
 * 709px no computador e 860 no celular, e os 14% que rendiam uma queda boa num
 * rendiam 14px de deslocamento no outro — copo praticamente imóvel.
 *
 * Com 160px fixos: cai 364 gastando 160 no computador, e 248 gastando 160 no
 * celular. Desce nos dois.
 *
 * A divisão fecha em FIM, e não no fim da travessia: o copo se abrir só quando
 * a seção já está saindo pelo alto entregaria o clímax fora da tela.
 */
const JANELA_QUEDA = 160;
const POUSA = 0.52;
const FIM = 0.72;

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
 *
 * E ela também deixou de ser travada. Prender a página exigia uma seção de
 * `100svh + 1100px`, e era isso que fazia a faixa creme tomar a tela inteira.
 * Agora é uma seção de recuo normal, como as outras, e a queda é guiada pela
 * posição dela na tela — a mesma mecânica da bola do alcance, que não prende
 * nada.
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
      /**
       * Quanto da seção já atravessou a tela: 0 quando ela encosta por baixo,
       * 1 quando some por cima. Sem trava, é a posição dela que marca o tempo.
       */
      const s = secao.getBoundingClientRect();
      const total = s.height + window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(Math.max((window.innerHeight - s.top) / total, 0), 1);

      // A janela da queda vem de pixels, então vira fração aqui, onde a altura
      // da travessia já é conhecida.
      const solta = POUSA - JANELA_QUEDA / total;

      const por = (y: number, giro = 0) =>
        `translate(${x}px, ${y}px) translateX(-50%) rotate(${giro}deg)`;

      if (reduzido) {
        copo.style.transform = por(fimY);
        botao.style.transform = "";
        setQuadro(QUADROS - 1);
        return;
      }

      if (p < solta) {
        const balanco = Math.sin(p * 55) * 2.5;
        copo.style.transform = por(inicioY, balanco);
        botao.style.transform = "";
        setQuadro(0);
        return;
      }

      if (p < POUSA) {
        const q = (p - solta) / (POUSA - solta);
        const caida = q * q;
        copo.style.transform = por(
          inicioY + (fimY - inicioY) * caida,
          (1 - caida) * 3.5,
        );
        botao.style.transform = "";
        setQuadro(0);
        return;
      }

      const q = Math.min((p - POUSA) / (FIM - POUSA), 1);
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
    /* O recuo de cima é maior que o de baixo porque o copo começa acima do
       texto: com menos que isso ele nasceria fora da faixa creme, e o corte
       apareceria. O `overflow-hidden` é a rede de segurança pra tela curta. */
    <section
      ref={secaoRef}
      className="relative overflow-hidden border-t border-borda bg-creme-2 pb-24 pt-32 md:pb-32 md:pt-40"
    >
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
              Cada vídeo do Ifesciência vira uma ficha com os materiais, o passo
              a passo, o que costuma dar errado e um PDF para imprimir. Sem
              cadastro e sem custo, para qualquer professor do Brasil.
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
              width={ARQUIVO_LARGURA}
              height={ARQUIVO_ALTURA}
              priority={i === 0}
              unoptimized
              className="absolute inset-0 h-full w-full object-contain"
              style={{ opacity: i === quadro ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
