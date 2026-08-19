import Link from "next/link";
import { Marcador } from "./Marcador";

/**
 * A máquina de escrever entra na etapa 4, na linha do objeto.
 * Ela carrega o objetivo oficial do projeto — "a ciência está presente em
 * diversos aspectos da vida diária" — trocando o objeto a cada volta:
 * um copo térmico → uma garrafa de refrigerante → um chuveiro elétrico → tudo que você já tem em casa.
 */
export function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
      <div>
        <p className="mb-5 font-mono text-xs uppercase leading-relaxed tracking-[0.18em] text-tinta-3">
          Divulgação científica · Ifes Campus Cachoeiro de Itapemirim
        </p>

        <h1 className="text-5xl font-bold sm:text-6xl lg:text-7xl">
          Ciência como você <span className="destaque">nunca</span> viu
        </h1>

        <p className="mt-7 font-titulo text-2xl font-semibold text-verde sm:text-3xl">
          A ciência está em um copo térmico.
        </p>

        <p className="mt-5 max-w-md text-lg text-tinta-2">
          O Ifesciência transforma experimentos curiosos em vídeos curtos que já
          passaram de 13 milhões de visualizações. Um projeto feito por
          estudantes, com apoio do Ifes e financiamento da Fapes.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="#projeto"
            className="rounded-full bg-verde px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
          >
            Conhecer o projeto
          </Link>
          <Link
            href="/experimentos"
            className="rounded-full border border-tinta px-7 py-3.5 text-sm font-medium transition-colors hover:bg-creme-2"
          >
            Ver experimentos
          </Link>
        </div>
      </div>

      <Marcador proporcao="4/5" rotulo="foto principal" />
    </section>
  );
}
