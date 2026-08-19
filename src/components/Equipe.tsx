import { Marcador } from "./Marcador";

/**
 * Fica fixa no código, só foto + nome (D11).
 * Etapa 5 transforma esta fileira na galeria horizontal:
 * no computador a página prende e passa de lado; no celular arrasta com o dedo.
 * Por enquanto é uma grade parada, sem nenhum movimento.
 */
const equipe = [
  { nome: "Hilton Moulin" },
  { nome: "Augusto Donateli" },
  { nome: "A definir" },
  { nome: "A definir" },
  { nome: "A definir" },
];

export function Equipe() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 md:pb-28">
      <div className="mb-10">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Quem faz
        </p>
        <h2 className="text-4xl font-bold sm:text-5xl">
          Cinco pessoas e uma câmera
        </h2>
      </div>

      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {equipe.map((pessoa, i) => (
          <li key={i}>
            <Marcador proporcao="3/4" rotulo="foto" />
            <p className="mt-3 text-sm font-medium">{pessoa.nome}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
