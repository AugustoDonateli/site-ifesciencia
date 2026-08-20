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
 * O título manda, a imagem apoia.
 *
 * Assim o cartão continua bonito mesmo sem capa — e o acervo é de Shorts,
 * onde capa boa é exceção, não regra. Quando a equipe envia um print, ele
 * entra em cima; quando não envia, o cartão é tipográfico e ninguém sente falta.
 */
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
      className="group flex flex-col border-t border-borda pt-5 transition-colors hover:border-tinta-3"
    >
      {capa ? (
        <div className="mb-5 overflow-hidden rounded-lg bg-creme-2">
          <Image
            src={capa}
            alt=""
            width={800}
            height={1000}
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-verde-escuro">
          {NOME_AREA[item.area]}
        </span>
        {item.pode_fazer_em_casa ? (
          <span className="rounded-full bg-creme-2 px-3 py-1 text-xs text-tinta-2">
            dá pra fazer em casa
          </span>
        ) : null}
      </div>

      <h3 className="font-titulo text-2xl font-bold transition-colors group-hover:text-verde-escuro sm:text-3xl">
        {item.titulo}
      </h3>

      {item.gancho ? (
        <p className="mt-2 text-sm text-tinta-2">{item.gancho}</p>
      ) : null}

      <p className="mt-4 font-mono text-xs text-tinta-3">
        {ficha.join(" · ")}
      </p>
    </Link>
  );
}
