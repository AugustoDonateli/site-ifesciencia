import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Menu } from "@/components/Menu";
import { Rodape } from "@/components/Rodape";
import { PlayerYoutube } from "@/components/PlayerYoutube";
import { BarraProgresso } from "@/components/BarraProgresso";
import { IndiceLateral, type ItemIndice } from "@/components/IndiceLateral";
import {
  CartaoExperimento,
  type ItemCatalogo,
} from "@/components/CartaoExperimento";
import { buscarExperimento, listarRelacionados } from "@/lib/supabase";
import {
  NOME_AREA,
  NOME_DIFICULDADE,
  NOME_NIVEL,
  capaDoExperimento,
  formatarCusto,
} from "@/lib/tipos";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = await buscarExperimento(slug).catch(() => null);
  if (!e) return { title: "Experimento — Ifesciência" };
  return {
    title: `${e.titulo} — Ifesciência`,
    description:
      e.gancho ?? `Materiais, passo a passo e vídeo para repetir ${e.titulo}.`,
  };
}

function Secao({
  id,
  titulo,
  children,
}: {
  id: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-borda pt-8">
      <h2 className="mb-6 text-2xl font-bold sm:text-3xl">{titulo}</h2>
      {children}
    </section>
  );
}

export default async function Ficha({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = await buscarExperimento(slug).catch(() => null);
  if (!e) notFound();

  const relacionados = (await listarRelacionados(e.area, e.slug).catch(
    () => [],
  )) as ItemCatalogo[];

  // A ficha rápida responde em 8 segundos a única pergunta que importa antes
  // de qualquer outra: "dá pra fazer amanhã?".
  const fichaRapida = [
    e.tempo_preparo_min ? `${e.tempo_preparo_min} min de preparo` : null,
    e.tempo_execucao_min ? `${e.tempo_execucao_min} min de execução` : null,
    formatarCusto(e.custo_centavos),
    NOME_DIFICULDADE[e.dificuldade],
    NOME_NIVEL[e.nivel],
    e.pode_fazer_em_casa ? "dá pra fazer em casa" : null,
  ].filter(Boolean) as string[];

  // O índice lista só o que a ficha realmente tem: bloco vazio não vira item.
  const itensIndice: ItemIndice[] = [
    e.materiais.length > 0 ? { id: "materiais", rotulo: "Materiais" } : null,
    e.seguranca ? { id: "seguranca", rotulo: "Segurança" } : null,
    e.passos.length > 0 ? { id: "passos", rotulo: "Passo a passo" } : null,
    e.por_que_funciona ? { id: "funciona", rotulo: "Por que funciona" } : null,
    e.o_que_da_errado
      ? { id: "erros", rotulo: "O que costuma dar errado" }
      : null,
  ].filter(Boolean) as ItemIndice[];

  return (
    <>
      <BarraProgresso />
      <div className="conteudo-acima">
        <Menu />

        <main className="mx-auto w-full max-w-[1240px] px-6 py-16 md:py-24">
          <header className="mb-12 max-w-3xl">
            <span className="mb-6 inline-block rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-verde-escuro">
              {NOME_AREA[e.area]}
            </span>

            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              {e.titulo}
            </h1>

            {e.gancho ? (
              <p className="mt-6 text-lg text-tinta-2 sm:text-xl">{e.gancho}</p>
            ) : null}

            <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-2">
              {fichaRapida.map((f) => (
                <li
                  key={f}
                  className="rounded-full bg-creme-2 px-3 py-1.5 font-mono text-xs text-tinta-2"
                >
                  {f}
                </li>
              ))}
            </ul>
          </header>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
            {/* Vídeo em pé, no formato do que vocês gravam. Fica grudado
                enquanto o passo a passo rola do lado. */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <PlayerYoutube
                youtubeId={e.youtube_id}
                capa={capaDoExperimento(e)}
                titulo={e.titulo}
              />

              {itensIndice.length > 0 ? (
                <div className="mt-10">
                  <IndiceLateral itens={itensIndice} />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-12">
              {e.materiais.length > 0 ? (
                <Secao id="materiais" titulo="Materiais">
                  <ul className="flex flex-col gap-4">
                    {e.materiais.map((m, i) => (
                      <li
                        key={i}
                        className="border-b border-borda pb-4 last:border-0"
                      >
                        <p className="font-medium">
                          {m.quantidade ? (
                            <span className="font-mono text-sm text-tinta-2">
                              {m.quantidade}{" "}
                            </span>
                          ) : null}
                          {m.item}
                        </p>
                        {m.substituto ? (
                          <p className="mt-1 text-sm text-tinta-2">
                            Não tem? Usa{" "}
                            <span className="text-tinta">{m.substituto}</span>.
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </Secao>
              ) : null}

              {/* Antes do passo a passo de propósito: aviso depois das
                  instruções chega tarde, a pessoa já começou. */}
              {e.seguranca ? (
                <Secao id="seguranca" titulo="Segurança">
                  <div className="rounded-lg border-l-4 border-ambar bg-ambar-claro p-5">
                    <p className="text-tinta-2">{e.seguranca}</p>
                  </div>
                </Secao>
              ) : null}

              {e.passos.length > 0 ? (
                <Secao id="passos" titulo="Passo a passo">
                  <ol className="flex flex-col gap-7">
                    {e.passos.map((p, i) => (
                      <li key={i} className="flex gap-5">
                        <span className="shrink-0 font-titulo text-3xl font-bold text-borda">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="pt-1.5 text-tinta-2">{p.texto}</p>
                      </li>
                    ))}
                  </ol>
                </Secao>
              ) : null}

              {e.por_que_funciona ? (
                <Secao id="funciona" titulo="Por que funciona">
                  <p className="max-w-prose whitespace-pre-line text-tinta-2">
                    {e.por_que_funciona}
                  </p>
                </Secao>
              ) : null}

              {e.o_que_da_errado ? (
                <Secao id="erros" titulo="O que costuma dar errado">
                  <p className="max-w-prose whitespace-pre-line text-tinta-2">
                    {e.o_que_da_errado}
                  </p>
                </Secao>
              ) : null}

              {e.pdf_url ? (
                <div className="border-t border-borda pt-8">
                  <a
                    href={e.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-full bg-verde px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
                  >
                    Baixar o PDF para imprimir
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          {relacionados.length > 0 ? (
            <section className="mt-24 border-t border-borda pt-12">
              <h2 className="mb-10 text-2xl font-bold sm:text-3xl">
                Outros de {NOME_AREA[e.area].toLowerCase()}
              </h2>
              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {relacionados.map((r) => (
                  <CartaoExperimento key={r.id} item={r} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Fecha a ficha do mesmo jeito que fecha cada vídeo de vocês.
              Regra: nunca duas vezes na mesma página. */}
          <p className="mt-24 border-t border-borda pt-10 font-titulo text-3xl font-bold sm:text-4xl">
            Ciência como você <span className="destaque">nunca</span> viu.
          </p>

          <Link
            href="/experimentos"
            className="mt-10 inline-block text-sm font-medium text-tinta-2 transition-colors hover:text-tinta"
          >
            ← Todos os experimentos
          </Link>
        </main>
      </div>
      <Rodape />
    </>
  );
}
