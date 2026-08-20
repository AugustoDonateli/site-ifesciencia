"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase-navegador";
import { NOME_AREA } from "@/lib/tipos";
import type { Area } from "@/lib/tipos";

export type LinhaPainel = {
  id: string;
  slug: string;
  titulo: string;
  area: Area;
  publicado: boolean;
  ordem: number;
};

export function ListaExperimentos({ inicial }: { inicial: LinhaPainel[] }) {
  const [linhas, setLinhas] = useState(inicial);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();
  const supabase = criarClienteNavegador();

  const publicar = async (linha: LinhaPainel) => {
    setOcupado(linha.id);
    setErro(null);

    const { error } = await supabase
      .from("experimentos")
      .update({ publicado: !linha.publicado })
      .eq("id", linha.id);

    setOcupado(null);
    if (error) return setErro(error.message);

    setLinhas((atual) =>
      atual.map((l) =>
        l.id === linha.id ? { ...l, publicado: !l.publicado } : l,
      ),
    );
    router.refresh();
  };

  const apagar = async (linha: LinhaPainel) => {
    // Apagar é irreversível e a lista é pequena — um clique errado apaga
    // trabalho de horas. Confirmação com o nome do experimento, não um
    // "tem certeza?" genérico que todo mundo aceita no automático.
    const ok = window.confirm(
      `Apagar "${linha.titulo}" para sempre?\n\nIsto não tem como desfazer.`,
    );
    if (!ok) return;

    setOcupado(linha.id);
    setErro(null);
    const { error } = await supabase
      .from("experimentos")
      .delete()
      .eq("id", linha.id);
    setOcupado(null);

    if (error) return setErro(error.message);
    setLinhas((atual) => atual.filter((l) => l.id !== linha.id));
    router.refresh();
  };

  /**
   * O catálogo mostra da maior ordem para a menor. Subir na lista = ganhar
   * ordem. Troco os valores entre os dois vizinhos, o que mantém a numeração
   * compacta e não exige renumerar a lista inteira a cada movimento.
   */
  const mover = async (indice: number, direcao: -1 | 1) => {
    const alvo = indice + direcao;
    if (alvo < 0 || alvo >= linhas.length) return;

    const a = linhas[indice];
    const b = linhas[alvo];
    setOcupado(a.id);
    setErro(null);

    const [erroA, erroB] = await Promise.all([
      supabase.from("experimentos").update({ ordem: b.ordem }).eq("id", a.id),
      supabase.from("experimentos").update({ ordem: a.ordem }).eq("id", b.id),
    ]);
    setOcupado(null);

    const falha = erroA.error ?? erroB.error;
    if (falha) return setErro(falha.message);

    const novas = [...linhas];
    novas[indice] = { ...b, ordem: a.ordem };
    novas[alvo] = { ...a, ordem: b.ordem };
    setLinhas(novas);
    router.refresh();
  };

  if (linhas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-borda p-12 text-center">
        <p className="text-tinta-2">Nenhum experimento cadastrado ainda.</p>
        <Link
          href="/dashboard/experimento/novo"
          className="mt-6 inline-block rounded-full bg-verde px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
        >
          Cadastrar o primeiro
        </Link>
      </div>
    );
  }

  return (
    <>
      {erro ? (
        <p className="mb-6 rounded-lg border-l-4 border-tomate bg-tomate-claro p-4 text-sm text-tinta-2">
          {erro}
        </p>
      ) : null}

      <ul className="flex flex-col">
        {linhas.map((linha, i) => (
          <li
            key={linha.id}
            className={`flex flex-wrap items-center gap-4 border-b border-borda py-4 first:border-t ${
              ocupado === linha.id ? "opacity-50" : ""
            }`}
          >
            <div className="flex shrink-0 flex-col">
              <button
                type="button"
                onClick={() => mover(i, -1)}
                disabled={i === 0}
                aria-label="Subir"
                className="px-2 text-tinta-3 transition-colors hover:text-tinta disabled:opacity-25"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => mover(i, 1)}
                disabled={i === linhas.length - 1}
                aria-label="Descer"
                className="px-2 text-tinta-3 transition-colors hover:text-tinta disabled:opacity-25"
              >
                ↓
              </button>
            </div>

            <div className="min-w-[12rem] flex-1">
              <Link
                href={`/dashboard/experimento/${linha.id}`}
                className="font-medium transition-colors hover:text-verde-escuro"
              >
                {linha.titulo}
              </Link>
              <p className="mt-0.5 font-mono text-xs text-tinta-3">
                {NOME_AREA[linha.area]} · /{linha.slug}
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                linha.publicado
                  ? "bg-verde-claro text-verde-escuro"
                  : "bg-creme-2 text-tinta-3"
              }`}
            >
              {linha.publicado ? "no ar" : "rascunho"}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => publicar(linha)}
                className="rounded-full border border-borda px-4 py-1.5 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta"
              >
                {linha.publicado ? "Despublicar" : "Publicar"}
              </button>
              <Link
                href={`/dashboard/experimento/${linha.id}`}
                className="rounded-full border border-borda px-4 py-1.5 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => apagar(linha)}
                aria-label={`Apagar ${linha.titulo}`}
                className="rounded-full border border-borda px-3 py-1.5 text-sm text-tinta-3 transition-colors hover:border-tomate hover:text-tomate"
              >
                Apagar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
