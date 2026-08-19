import { Marcador } from "./Marcador";

/**
 * Bloco único: sobre o projeto + as fotos (D17).
 * Na etapa 4 o texto fica preso enquanto as imagens trocam ao lado.
 */
export function Sobre() {
  return (
    <section id="sobre" className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-14 md:grid-cols-2">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
            Sobre nós
          </p>

          <h2 className="text-4xl font-bold sm:text-5xl">
            A gente faz o <span className="destaque">contrário</span> da aula
            chata
          </h2>

          <div className="mt-7 flex flex-col gap-5 text-tinta-2">
            <p>
              O Ifesciência nasceu em 2022, dentro do Ifes de Cachoeiro de
              Itapemirim, feito por alunos que queriam mostrar que ciência não
              precisa ser aquilo que a escola ensinou pra gente.
            </p>
            <p>
              A receita é simples: pega uma coisa banal que todo mundo tem em
              casa, mostra o absurdo que acontece com ela, e explica com piada e
              analogia em vez de fórmula.
            </p>
            <p>
              Deu certo — hoje são 500 mil pessoas acompanhando. E aí veio o
              pedido que gerou este site:{" "}
              <span className="destaque">
                professores querendo repetir os experimentos em sala.
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Marcador proporcao="3/2" rotulo="foto do projeto" />
          <Marcador proporcao="3/2" rotulo="foto do projeto" />
          <Marcador proporcao="3/2" rotulo="foto do projeto" />
        </div>
      </div>
    </section>
  );
}
