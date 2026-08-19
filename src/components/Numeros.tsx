const numeros = [
  { valor: "500 mil", rotulo: "pessoas acompanham o projeto" },
  { valor: "13 milhões", rotulo: "de visualizações acumuladas" },
  { valor: "2026", rotulo: "finalista do Prêmio iBest, categoria Ciências" },
];

// Etapa 4 transforma isso na faixa correndo.
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
              <p className="font-titulo text-5xl font-bold text-verde lg:text-6xl">
                {n.valor}
              </p>
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

      <div className="overflow-hidden border-t border-borda py-4">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6">
          {imprensa.map((veiculo) => (
            <span
              key={veiculo}
              className="font-mono text-xs uppercase tracking-widest text-tinta-3"
            >
              {veiculo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
