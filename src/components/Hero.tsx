import Link from "next/link";
import { Marcador } from "./Marcador";

/**
 * Etapa 3: estrutura pura.
 * A palavra "sua aula" é onde a máquina de escrever entra na etapa 4 —
 * ela vai revezar entre "sua aula", "sua casa", "sua cozinha", "seu intervalo".
 */
export function Hero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
      <div>
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Ifes · Campus Cachoeiro de Itapemirim
        </p>

        <h1 className="text-5xl font-bold sm:text-6xl lg:text-7xl">
          Ciência que sai do vídeo e entra na{" "}
          <span className="destaque">sua aula</span>
        </h1>

        <p className="mt-6 max-w-md text-lg text-tinta-2">
          Todo experimento que a gente grava está aqui, com os materiais, o passo
          a passo e o vídeo. Feito pra você repetir com a turma — sem laboratório
          e sem gastar quase nada.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/experimentos"
            className="rounded-full bg-verde px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
          >
            Ver experimentos
          </Link>
          <Link
            href="#sobre"
            className="rounded-full border border-tinta px-7 py-3.5 text-sm font-medium transition-colors hover:bg-creme-2"
          >
            Conhecer o projeto
          </Link>
        </div>
      </div>

      <Marcador proporcao="4/5" rotulo="foto principal" />
    </section>
  );
}
