import Link from "next/link";

/**
 * Os experimentos vêm por último, como recompensa de quem desceu a página.
 * É o único ponto parado do site, de propósito — nenhuma mecânica entra aqui.
 */
export function Chamada() {
  return (
    <section className="border-t border-borda bg-creme-2">
      <div className="mx-auto w-full max-w-2xl px-6 py-24 text-center md:py-32">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Para professores
        </p>

        <h2 className="text-4xl font-bold sm:text-5xl">
          Todo experimento, aberto
        </h2>

        <p className="mx-auto mt-6 max-w-md text-lg text-tinta-2">
          Cada vídeo do Ifesciência vira uma ficha com os materiais, o passo a
          passo, o que costuma dar errado e um PDF para imprimir. Sem cadastro e
          sem custo, para qualquer professor do Brasil.
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
