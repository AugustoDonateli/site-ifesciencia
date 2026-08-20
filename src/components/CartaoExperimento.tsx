import Image from "next/image";
import Link from "next/link";
import {
  NOME_AREA,
  NOME_DIFICULDADE,
  capaDoExperimento,
  formatarCusto,
} from "@/lib/tipos";
import type { Area, Dificuldade } from "@/lib/tipos";

export type ItemCatalogo = {
  id: string;
  slug: string;
  titulo: string;
  gancho: string | null;
  area: Area;
  capa_url: string | null;
  tempo_execucao_min: number | null;
  custo_centavos: number | null;
  dificuldade: Dificuldade;
  pode_fazer_em_casa?: boolean | null;
};

/**
 * Enquanto a equipe não envia capa, o lugar da imagem não pode ser um buraco
 * cinza. Vira um bloco com o nome da área em tipografia grande e apagada —
 * dá textura e identidade sem depender de foto nenhuma.
 */
export function CapaVazia({ area }: { area: Area }) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-creme-2 p-4">
      <span className="text-center font-titulo text-4xl font-bold leading-none text-borda sm:text-5xl">
        {NOME_AREA[area]}
      </span>
    </div>
  );
}

export function CartaoExperimento({ item }: { item: ItemCatalogo }) {
  const capa = capaDoExperimento(item);

  const ficha = [
    item.tempo_execucao_min ? `${item.tempo_execucao_min} min` : null,
    formatarCusto(item.custo_centavos),
    NOME_DIFICULDADE[item.dificuldade],
  ].filter(Boolean);

  return (
    <Link
      href={`/experimentos/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-borda bg-creme transition-all duration-300 hover:-translate-y-1 hover:border-tinta-3 hover:shadow-[0_12px_28px_-18px_rgba(23,23,15,0.35)]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        {capa ? (
          <Image
            src={capa}
            alt=""
            width={800}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <CapaVazia area={item.area} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* O título vem primeiro: é o que o olho tem que pegar. As etiquetas
            desceram pra não roubar a primeira leitura. */}
        <h3 className="font-titulo text-2xl font-bold transition-colors group-hover:text-verde-escuro sm:text-3xl">
          {item.titulo}
        </h3>

        {item.gancho ? (
          <p className="mt-2 text-sm text-tinta-2">{item.gancho}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-verde-escuro">
            {NOME_AREA[item.area]}
          </span>
          {item.pode_fazer_em_casa ? (
            <span className="rounded-full bg-creme-2 px-3 py-1 text-xs text-tinta-2">
              dá pra fazer em casa
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p className="font-mono text-xs text-tinta-3">{ficha.join(" · ")}</p>
          {/* Afordância de clique: sem isto o cartão parece só texto solto. */}
          <span
            aria-hidden="true"
            className="shrink-0 text-lg text-tinta-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-verde"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
