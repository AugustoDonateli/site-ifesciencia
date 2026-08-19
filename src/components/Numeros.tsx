const numeros = [
  { valor: "500 mil", rotulo: "pessoas seguindo" },
  { valor: "13 milhões", rotulo: "de visualizações" },
  { valor: "2022", rotulo: "desde o começo" },
];

// Etapa 4 transforma isso na faixa correndo.
const imprensa = [
  "TV Gazeta",
  "Tribuna Online",
  "ES Hoje",
  "Aqui Notícias",
  "Revista Conexão",
  "Prêmio iBest 2026",
];

export function Numeros() {
  return (
    <section className="border-y border-borda bg-creme-2">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          {numeros.map((n) => (
            <div key={n.rotulo}>
              <p className="font-titulo text-5xl font-bold lg:text-6xl">
                {n.valor}
              </p>
              <p className="mt-2 text-sm text-tinta-2">{n.rotulo}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-md text-tinta-2">
          Nenhuma dessas pessoas precisou decorar fórmula pra entender.
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
