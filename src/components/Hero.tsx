import Image from "next/image";
import Link from "next/link";
import { TituloCascata } from "./TituloCascata";
import { BotaoMagnetico } from "./BotaoMagnetico";
import { TextoQueDigita } from "./TextoQueDigita";

// Carrega o objetivo oficial do projeto — "a ciência está presente em diversos
// aspectos da vida diária" — trocando o lugar a cada volta. São lugares do dia
// a dia, não experimentos específicos: o projeto são dezenas de vídeos.
const LUGARES = [
  "na sua cozinha.",
  "no seu banho.",
  "no seu ônibus.",
  "no seu trabalho.",
  "em tudo que você já usou.",
];

/**
 * Abertura do site: ocupa praticamente a tela inteira, então "O projeto"
 * só aparece depois do primeiro scroll.
 *
 * A altura usa svh, não vh nem dvh. No navegador do Instagram as barras do
 * app aparecem e somem: vh ignora isso e corta o conteúdo, dvh muda de valor
 * no meio da rolagem e faz a página pular. svh é o valor estável.
 *
 * --altura-menu é medida pelo próprio menu, então a conta continua certa
 * mesmo que a altura dele mude.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-var(--altura-menu,69px))] items-center">
      {/* As colunas deixaram de ser meio a meio. A foto é 4:5, então largura
          vira altura numa proporção de 1,25 — e era ela, não o `svh`, que
          estava segurando o tamanho do hero: a 2000px de tela ela batia em 555
          de 564 possíveis na coluna. Dando mais largura pra ela, o conteúdo
          preenche a dobra em vez de deixar 144px de creme em cima e embaixo.

          O container segue em 1240px de propósito: é ele que alinha o começo
          do texto com o logo do menu e com as seções de baixo. */}
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-14 px-6 py-16 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-12">
        <div className="min-w-0 max-w-[35rem]">
          <p className="mb-7 font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-tinta-2">
            Divulgação científica · Ifes Campus Cachoeiro de Itapemirim
          </p>

          <TituloCascata
            texto="Ciência como você nunca viu"
            destaque="nunca"
            className="max-w-[8.5em] text-[2.6rem] font-bold sm:text-[3.5rem] lg:text-[4.4rem]"
          />

          <TextoQueDigita
            prefixo="A ciência está"
            variantes={LUGARES}
            className="mt-5 font-titulo text-xl font-medium text-verde sm:text-2xl lg:text-[1.7rem]"
          />

          <p className="mt-8 max-w-md text-tinta-2 sm:text-lg lg:max-w-lg lg:text-[1.15rem]">
            O Ifesciência transforma experimentos curiosos em vídeos curtos que
            já passaram de 13 milhões de visualizações. Um projeto feito por
            estudantes, com apoio do Ifes e financiamento da Fapes.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <BotaoMagnetico
              href="#projeto"
              className="rounded-full bg-verde px-7 py-3.5 text-sm font-medium text-white hover:bg-verde-escuro"
            >
              Conhecer o projeto
            </BotaoMagnetico>

            {/* Secundário de propósito: se os dois fossem botões cheios,
                brigariam entre si e nenhum venceria. */}
            <Link
              href="/experimentos"
              className="group inline-flex items-center gap-2 py-3.5 text-sm font-medium text-tinta transition-colors hover:text-verde-escuro"
            >
              Ver experimentos
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Largura amarrada à altura da tela pra foto nunca estourar a dobra. */}
        <div className="min-w-0 w-[min(100%,calc(75svh*0.8))] md:ml-auto">
          {/* A única imagem acima da dobra: carrega com prioridade, senão a
              abertura fica um buraco enquanto o resto da página já apareceu. */}
          <Image
            src="/hero.webp"
            alt="A equipe do Ifesciência reunida no campus do Ifes em Cachoeiro de Itapemirim"
            width={1440}
            height={1799}
            priority
            sizes="(max-width: 767px) 100vw, 640px"
            className="w-full rounded-xl object-cover"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center sm:flex">
        <span className="flex flex-col items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-tinta-3">
          role
          <span aria-hidden="true" className="text-sm leading-none">
            ↓
          </span>
        </span>
      </div>
    </section>
  );
}
