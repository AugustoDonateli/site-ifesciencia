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
 * E o progresso não é a travessia inteira da seção, é o pedaço dela que a
 * página deixa acontecer. Esta é a ÚLTIMA seção do site: pra ela atravessar de
 * verdade teria que subir até sumir por cima, e abaixo dela só existe o rodapé.
 * A rolagem acaba antes. Medido, o progresso parava em 0.63 e a divisão, que
 * ia de 0.52 a 0.72, mostrava só o comecinho — o copo abria uma fresta e
 * congelava.
 *
 * Por isso a conta usa o que sobra embaixo, não a altura da tela. Aí o 1 vira
 * alcançável e a divisão pode fechar nele, com o copo escancarado no ponto em
 * que a pessoa chega ao fim da página.
 */
const JANELA_QUEDA = 160;
const POUSA = 0.75;
const FIM = 1;

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
  const paragrafoRef = useRef<HTMLParagraphElement>(null);
  const botaoRef = useRef<HTMLAnchorElement>(null);
  const copoRef = useRef<HTMLDivElement>(null);
  const [quadro, setQuadro] = useState(0);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const secao = secaoRef.current;
    const bloco = blocoRef.current;
    const copo = copoRef.current;
    const paragrafo = paragrafoRef.current;
    const botao = botaoRef.current;
    if (!secao || !bloco || !copo || !paragrafo || !botao) return;

    let agendado = false;

    const posicionar = () => {
      /**
       * Tudo é medido AQUI, a cada quadro, e não uma vez na montagem.
       *
       * Guardar as medidas era rápido e errado: elas saíam uma única vez, e se
       * o layout ainda não estivesse pronto naquele instante o copo ficava com
       * a posição errada pra sempre — a rolagem só reusava o valor velho. Foi
       * assim que ele foi parar em cima do título.
       *
       * E é `offsetTop`/`offsetLeft`, não `getBoundingClientRect`, porque o
       * botão RECEBE um transform nosso no impacto: ler o retângulo dele
       * realimentaria a conta com o proprio efeito. Os `offset*` são valores de
       * layout e ignoram transform.
       *
       * Eles já vêm relativos ao BLOCO, que é quem posiciona o copo — medir
       * contra qualquer outra coisa foi erro de rodadas anteriores.
       */
      const x = botao.offsetLeft + botao.offsetWidth / 2;
      const fimY = botao.offsetTop - BASE;

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

      /**
       * No celular o copo nasce INTEIRO abaixo do parágrafo.
       *
       * A conta anterior colocava a BASE dele 24px abaixo do texto — só que o
       * corpo tem 150px e sobe a partir da base, então ele nascia atravessando
       * o parágrafo: medido, 24.859px² de texto coberto no começo da queda. É
       * a mesma reclamação que o Augusto fez do computador e que foi corrigida
       * lá movendo o botão pra direita; aqui, empilhado, não existe faixa livre
       * ao lado, então o jeito é começar mais embaixo.
       *
       * `BASE - ALTURA_DO_COPO` é o que sobra de caixa acima do objeto, e é o
       * que precisa ser descontado pro topo dele, e não a base, encostar no
       * limite de baixo do texto.
       */
      const inicioY = empilhado
        ? paragrafo.offsetTop +
          paragrafo.offsetHeight +
          16 -
          (BASE - ALTURA_DO_COPO)
        : -BASE;

      /**
       * Quanto a seção consegue de fato subir antes de a rolagem acabar.
       *
       * O `min` com a altura da tela é o que mantém a conta honesta se um dia
       * entrar mais coisa embaixo: com pouco abaixo, quem manda é o que sobra;
       * com muito, quem manda é a travessia normal, e aí é a fórmula de sempre.
       */
      const s = secao.getBoundingClientRect();
      const abaixo = Math.max(
        document.documentElement.scrollHeight - (s.bottom + window.scrollY),
        0,
      );
      const disponivel = s.height + Math.min(abaixo, window.innerHeight);
      if (disponivel <= 0) return;

      /**
       * Quanto a seção já subiu, sobre o quanto ela CONSEGUE subir: 0 quando
       * encosta por baixo, 1 no fim da página. Sem trava, é a posição dela que
       * marca o tempo.
       */
      const p = Math.min(
        Math.max((window.innerHeight - s.top) / disponivel, 0),
        1,
      );

      // A janela da queda vem de pixels, então vira fração aqui, onde o
      // percurso disponível já é conhecido.
      const solta = POUSA - JANELA_QUEDA / disponivel;

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

    posicionar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);

    /**
     * A rede de proteção do primeiro instante: fonte que chega depois, imagem
     * que carrega, qualquer coisa que mude a altura da página muda também o
     * `disponivel`. Como agora tudo é medido a cada quadro, basta pedir um
     * quadro novo quando o layout mexer.
     */
    document.fonts?.ready.then(aoRolar);
    const observador = new ResizeObserver(aoRolar);
    observador.observe(bloco);
    observador.observe(document.body);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      observador.disconnect();
    };
  }, [reduzido]);

  return (
    /* O recuo de cima é bem maior que o de baixo, e não é folga decorativa: o
       copo começa 150px acima do texto, então esse recuo é o céu de onde ele
       cai. Com os 160px de antes sobravam 11px entre o topo do copo e a borda
       da seção — ele nascia grudado na linha de divisão, parecendo cortado em
       vez de suspenso. Com 240px sobram 90.

       No celular não vale: lá o copo começa embaixo do parágrafo, no vão até o
       botão, então o recuo de cima não tem nada a ver com ele.

       O `overflow-hidden` é a rede de segurança pra tela curta. */
    <section
      ref={secaoRef}
      className="relative overflow-hidden border-t border-borda bg-creme-2 pb-24 pt-32 md:pb-32 md:pt-60"
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

            <h2 className="text-4xl font-bold sm:text-5xl">
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
          <div className="mt-72 flex flex-col justify-end md:mt-0 md:min-h-[420px]">
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
              imagem faria o navegador buscar arquivo no meio da rolagem.

              E todos com `eager`, que é o que faz isso valer. O padrão do
              next/image é `lazy`, e aí os doze quadros da divisão só começavam
              a ser buscados quando já era hora de mostrá-los — o copo pousava e
              não abria. Passava despercebido com a seção travada de 2137px,
              que entrava na tela muito antes da batida e dava tempo de sobra;
              com 709px não dá. Foi o mesmo tropeço da bola.

              Saem já no tamanho e no formato de entrega, então `unoptimized`:
              passar pelo otimizador só somaria uma ida ao servidor. */}
          {Array.from({ length: QUADROS }, (_, i) => (
            <Image
              key={i}
              src={`/objetos/copo-${String(i).padStart(2, "0")}.webp`}
              alt=""
              width={ARQUIVO_LARGURA}
              height={ARQUIVO_ALTURA}
              unoptimized
              loading="eager"
              className="absolute inset-0 h-full w-full object-contain"
              style={{ opacity: i === quadro ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
