import { Marcador } from "./Marcador";
import { ChocolateNaTese } from "./ChocolateNaTese";

/**
 * O que é o Ifesciência. Vem antes de tudo: o site é do projeto,
 * os experimentos são o que ele oferece.
 * Na etapa 4 o texto fica preso enquanto as imagens trocam ao lado.
 */
export function Projeto() {
  return (
    <section
      id="projeto"
      className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28"
    >
      <div className="grid gap-14 md:grid-cols-2">
        {/* `relative` dá âncora à barra de chocolate: ela se posiciona a partir
            daqui, então acompanha a coluna quando ela gruda no topo sem ter que
            perseguir nada.

            E o `bg-creme` não é decoração — é o que faz o brilho funcionar. O
            reflexo da barra é pintado em `mix-blend-mode: lighten`, que mistura
            com o contexto de empilhamento onde está, e `sticky` cria um desses.
            Sem fundo aqui dentro, o reflexo não teria com o que misturar e
            apareceria como retângulos coloridos por cima do creme em vez de
            acender as letras. É a mesma cor do fundo da página, então não muda
            nada do que se vê. */}
        <div className="relative bg-creme md:sticky md:top-28 md:self-start">
          <ChocolateNaTese />
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
            O projeto
          </p>

          <h2 className="text-4xl font-bold sm:text-5xl">
            Explicar o mundo com o que existe dentro de casa
          </h2>

          <div className="mt-7 flex flex-col gap-5 text-tinta-2">
            <p>
              O Ifesciência é um projeto de divulgação científica do Instituto
              Federal do Espírito Santo, campus Cachoeiro de Itapemirim.
              Estudantes dos cursos de Mecânica e Engenharia Mecânica produzem
              vídeos curtos com experiências científicas curiosas, usando humor,
              analogias e situações do cotidiano para explicar o que normalmente
              só aparece em fórmula.
            </p>
            <p>
              A ideia que sustenta o projeto é direta:{" "}
              <strong data-tese className="font-semibold text-tinta">
                a ciência está presente em diversos aspectos da vida diária
              </strong>{" "}
              — e quase nunca é apresentada desse jeito. O objetivo é
              alfabetização científica: ajudar as pessoas a entenderem melhor o
              mundo em que já vivem.
            </p>
            <p>
              O projeto começou em 2022, com apoio de um edital interno do
              campus. Em 2023 foi selecionado em edital de extensão da Fapes,
              que passou a financiar as bolsas da equipe e a produção. Os
              experimentos são desenvolvidos nos laboratórios de Química,
              Física, Termofluidos e Fabricação Mecânica do Ifes.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Marcador proporcao="3/2" rotulo="bastidor da gravação" />
          <Marcador proporcao="3/2" rotulo="experimento no laboratório" />
          <Marcador proporcao="3/2" rotulo="equipe trabalhando" />
        </div>
      </div>
    </section>
  );
}
