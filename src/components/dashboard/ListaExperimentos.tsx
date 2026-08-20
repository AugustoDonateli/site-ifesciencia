"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase-navegador";
import { traduzirErro } from "@/lib/erros";
import { NOME_AREA } from "@/lib/tipos";
import type { Area } from "@/lib/tipos";

export type LinhaPainel = {
  id: string;
  slug: string;
  titulo: string;
  area: Area;
  publicado: boolean;
  ordem: number;
  capa_url: string | null;
  atualizado_em: string;
};

/** "há 3 dias" diz mais que uma data crua quando o que importa é o que está velho. */
function quandoFoi(iso: string) {
  const minutos = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.round(horas / 24);
  if (dias < 30) return `há ${dias} ${dias === 1 ? "dia" : "dias"}`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function ListaExperimentos({ inicial }: { inicial: LinhaPainel[] }) {
  const [linhas, setLinhas] = useState(inicial);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "no ar" | "rascunho">("todos");
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const router = useRouter();
  const supabase = criarClienteNavegador();

  // Clicar fora fecha o menu. Sem isto ele fica aberto atrapalhando a lista.
  useEffect(() => {
    const fechar = () => setMenuAberto(null);
    window.addEventListener("click", fechar);
    return () => window.removeEventListener("click", fechar);
  }, []);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return linhas.filter((l) => {
      const casaBusca =
        !termo ||
        l.titulo.toLowerCase().includes(termo) ||
        l.slug.includes(termo);
      const casaFiltro =
        filtro === "todos" ||
        (filtro === "no ar" ? l.publicado : !l.publicado);
      return casaBusca && casaFiltro;
    });
  }, [linhas, busca, filtro]);

  const publicar = async (linha: LinhaPainel) => {
    setOcupado(linha.id);
    setErro(null);
    const { error } = await supabase
      .from("experimentos")
      .update({ publicado: !linha.publicado })
      .eq("id", linha.id);
    setOcupado(null);
    if (error) return setErro(traduzirErro(error.message));

    setLinhas((atual) =>
      atual.map((l) =>
        l.id === linha.id ? { ...l, publicado: !l.publicado } : l,
      ),
    );
    router.refresh();
  };

  const apagar = async (linha: LinhaPainel) => {
    // Confirmação com o nome dentro. "Tem certeza?" genérico treina a pessoa
    // a aceitar no automático, e aí a vez que importava passa batido.
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
    if (error) return setErro(traduzirErro(error.message));

    setLinhas((atual) => atual.filter((l) => l.id !== linha.id));
    router.refresh();
  };

  /**
   * Troca a ordem com o vizinho. Só faz sentido com a lista inteira à vista —
   * reordenar dentro de um resultado de busca moveria o item para um lugar
   * que a pessoa não está vendo.
   */
  const podeReordenar = !busca.trim() && filtro === "todos";

  const mover = async (indice: number, direcao: -1 | 1) => {
    const alvo = indice + direcao;
    if (alvo < 0 || alvo >= linhas.length) return;

    const a = linhas[indice];
    const b = linhas[alvo];
    setOcupado(a.id);
    setErro(null);

    const [resA, resB] = await Promise.all([
      supabase.from("experimentos").update({ ordem: b.ordem }).eq("id", a.id),
      supabase.from("experimentos").update({ ordem: a.ordem }).eq("id", b.id),
    ]);
    setOcupado(null);

    const falha = resA.error ?? resB.error;
    if (falha) return setErro(traduzirErro(falha.message));

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
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome"
          aria-label="Buscar experimento"
          className="min-w-0 flex-1 rounded-full border border-borda bg-creme px-5 py-2.5 text-sm outline-none transition-colors focus:border-verde sm:max-w-xs"
        />
        <div className="flex gap-2">
          {(["todos", "no ar", "rascunho"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              aria-pressed={filtro === f}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                filtro === f
                  ? "border-verde bg-verde text-white"
                  : "border-borda text-tinta-2 hover:border-tinta-3 hover:text-tinta"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {erro ? (
        <p className="mb-6 rounded-lg border-l-4 border-tomate bg-tomate-claro p-4 text-sm text-tinta-2">
          {erro}
        </p>
      ) : null}

      {podeReordenar ? (
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-tinta-3">
          ↑↓ define a ordem no catálogo do site
        </p>
      ) : null}

      <ul className="flex flex-col">
        {visiveis.map((linha) => {
          const indiceReal = linhas.findIndex((l) => l.id === linha.id);
          return (
            <li
              key={linha.id}
              // Altura fixa: linha que varia de tamanho quebra o ritmo de leitura.
              className={`flex h-[4.5rem] items-center gap-4 border-b border-borda first:border-t ${
                ocupado === linha.id ? "opacity-50" : ""
              }`}
            >
              {podeReordenar ? (
                <div className="flex shrink-0 flex-col text-xs">
                  <button
                    type="button"
                    onClick={() => mover(indiceReal, -1)}
                    disabled={indiceReal === 0}
                    aria-label={`Subir ${linha.titulo}`}
                    className="px-1.5 text-tinta-2 transition-colors hover:text-verde disabled:opacity-20"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => mover(indiceReal, 1)}
                    disabled={indiceReal === linhas.length - 1}
                    aria-label={`Descer ${linha.titulo}`}
                    className="px-1.5 text-tinta-2 transition-colors hover:text-verde disabled:opacity-20"
                  >
                    ▼
                  </button>
                </div>
              ) : null}

              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-creme-2">
                {linha.capa_url ? (
                  <Image
                    src={linha.capa_url}
                    alt=""
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase text-tinta-3">
                    {NOME_AREA[linha.area].slice(0, 3)}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/experimento/${linha.id}`}
                  className="block truncate font-medium transition-colors hover:text-verde-escuro"
                >
                  {linha.titulo}
                </Link>
                <p className="truncate font-mono text-xs text-tinta-3">
                  {NOME_AREA[linha.area]} · editado {quandoFoi(linha.atualizado_em)}
                </p>
              </div>

              <span
                className={`hidden shrink-0 rounded-full px-3 py-1 text-xs font-medium sm:inline ${
                  linha.publicado
                    ? "bg-verde-claro text-verde-escuro"
                    : "bg-creme-2 text-tinta-3"
                }`}
              >
                {linha.publicado ? "no ar" : "rascunho"}
              </span>

              <Link
                href={`/dashboard/experimento/${linha.id}`}
                className="hidden shrink-0 rounded-full border border-borda px-4 py-1.5 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta sm:inline-block"
              >
                Editar
              </Link>

              {/* Ações secundárias saem da linha: nove botões de texto na tela
                  viram ruído, e o Apagar não pode ter o mesmo peso do Editar. */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setMenuAberto(menuAberto === linha.id ? null : linha.id);
                  }}
                  aria-label={`Mais ações para ${linha.titulo}`}
                  aria-expanded={menuAberto === linha.id}
                  className="rounded-full border border-borda px-3 py-1.5 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta"
                >
                  ⋯
                </button>

                {menuAberto === linha.id ? (
                  <div
                    onClick={(ev) => ev.stopPropagation()}
                    className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-borda bg-creme shadow-[0_16px_40px_-24px_rgba(23,23,15,0.5)]"
                  >
                    <Link
                      href={`/dashboard/experimento/${linha.id}`}
                      className="block px-4 py-3 text-sm transition-colors hover:bg-creme-2 sm:hidden"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuAberto(null);
                        publicar(linha);
                      }}
                      className="block w-full px-4 py-3 text-left text-sm transition-colors hover:bg-creme-2"
                    >
                      {linha.publicado ? "Despublicar" : "Publicar"}
                    </button>
                    <a
                      href={`/experimentos/${linha.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block px-4 py-3 text-sm transition-colors hover:bg-creme-2"
                    >
                      Ver no site ↗
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuAberto(null);
                        apagar(linha);
                      }}
                      className="block w-full border-t border-borda px-4 py-3 text-left text-sm text-tomate transition-colors hover:bg-tomate-claro"
                    >
                      Apagar para sempre
                    </button>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {visiveis.length === 0 ? (
        <p className="border-b border-borda py-10 text-center text-tinta-2">
          Nada encontrado com esses filtros.
        </p>
      ) : null}

      <p className="mt-6 font-mono text-xs text-tinta-3">
        {visiveis.length} de {linhas.length}
      </p>
    </>
  );
}
