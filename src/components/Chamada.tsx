import Link from "next/link";

/**
 * O único ponto parado do site, de propósito (seção 9).
 * Nenhuma mecânica entra aqui na etapa 4.
 */
export function Chamada() {
  return (
    <section className="border-t border-borda bg-creme-2">
      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center md:py-32">
        <h2 className="text-4xl font-bold sm:text-5xl">
          Leve isso pra sua sala
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-tinta-2">
          Todos os experimentos, com material, passo a passo e PDF pra imprimir.
          De graça, pra qualquer professor do Brasil.
        </p>
        <Link
          href="/experimentos"
          className="mt-9 inline-block rounded-full bg-verde px-8 py-4 font-medium text-white transition-colors hover:bg-verde-escuro"
        >
          Ver experimentos
        </Link>
      </div>
    </section>
  );
}
