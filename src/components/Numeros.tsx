import { NumeroQueSobe } from "./NumeroQueSobe";
import { FaixaCorrendo } from "./FaixaCorrendo";

const numeros = [
  { valor: 500, sufixo: " mil", rotulo: "pessoas acompanham o projeto" },
  { valor: 13, sufixo: " milhões", rotulo: "de visualizações acumuladas" },
  {
    valor: 2026,
    sufixo: "",
    animar: false,
    rotulo: "finalista do Prêmio iBest, categoria Ciências",
  },
];

const imprensa = [
  "TV Gazeta",
  "Tribuna Online",
  "ES Hoje",
  "Aqui Notícias",
  "Revista Conexão",
  "Portal do Ifes",
];

export function Numeros() {
  return (
    <section className="border-y border-borda bg-creme-2">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <p className="mb-10 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Alcance
        </p>

        <div className="grid gap-10 sm:grid-cols-3">
          {numeros.map((n) => (
            <div key={n.rotulo}>
              <NumeroQueSobe
                valor={n.valor}
                sufixo={n.sufixo}
                animar={n.animar !== false}
                className="font-titulo text-5xl font-bold text-verde lg:text-6xl"
              />
              <p className="mt-3 max-w-[16rem] text-sm text-tinta-2">
                {n.rotulo}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-lg text-tinta-2">
          Não é um vídeo só. O alcance vem de dezenas de experimentos
          publicados desde 2022 — vários deles passaram de um milhão de
          visualizações cada.
        </p>
      </div>

      <FaixaCorrendo itens={imprensa} />
    </section>
  );
}
