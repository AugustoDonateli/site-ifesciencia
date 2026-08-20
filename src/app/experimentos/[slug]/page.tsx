import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Menu } from "@/components/Menu";
import { Rodape } from "@/components/Rodape";
import { PlayerYoutube } from "@/components/PlayerYoutube";
import { BarraProgresso } from "@/components/BarraProgresso";
import { BotaoCompartilhar } from "@/components/BotaoCompartilhar";
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
      <h2 className="mb-7 text-2xl font-bold sm:text-3xl">{titulo}</h2>
      {children}
    </section>
  );
}

/** Uma linha da ficha técnica: rótulo apagado, valor com peso. */
function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-borda py-3 last:border-0">
      <dt className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-widest text-tinta-3">
        {rotulo}
      </dt>
      <dd className="font-medium">{valor}</dd>
    </div>
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

  const tempo = [
    e.tempo_execucao_min ? `${e.tempo_execucao_min} min de aula` : null,
    e.tempo_preparo_min ? `${e.tempo_preparo_min} min de preparo` : null,
  ].filter(Boolean);

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

        <main className="mx-auto w-full max-w-[1240px] px-6 py-10 md:py-16">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/experimentos"
              className="inline-flex items-center gap-2 text-sm text-tinta-2 transition-colors hover:text-tinta"
            >
              <span aria-hidden="true">←</span> Todos os experimentos
            </Link>
            <BotaoCompartilhar titulo={e.titulo} />
          </div>

          {/* Abertura da ficha: texto de um lado, vídeo do outro. O índice saiu
              daqui de baixo do vídeo — enterrado ali, ele só aparecia depois de
              rolar, e índice que você não vê não serve pra nada. */}
          <header className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,330px)] lg:gap-14">
            <div>
              <span className="mb-6 inline-block rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-verde-escuro">
                {NOME_AREA[e.area]}
              </span>

              <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
                {e.titulo}
              </h1>

              {e.gancho ? (
                <p className="mt-6 max-w-xl text-lg text-tinta-2 sm:text-xl">
                  {e.gancho}
                </p>
              ) : null}

              {/* Ficha técnica de verdade, com hierarquia. Antes eram seis
                  pílulas cinzas idênticas, e tempo, custo e nível não têm
                  o mesmo peso pra quem está decidindo se dá pra fazer. */}
              <dl className="mt-8 max-w-md">
                {tempo.length > 0 ? (
                  <Dado rotulo="Tempo" valor={tempo.join(" · ")} />
                ) : null}
                {formatarCusto(e.custo_centavos) ? (
                  <Dado rotulo="Custo" valor={formatarCusto(e.custo_centavos)!} />
                ) : null}
                <Dado
                  rotulo="Nível"
                  valor={`${NOME_DIFICULDADE[e.dificuldade]} · ${NOME_NIVEL[e.nivel]}`}
                />
              </dl>

              {e.pode_fazer_em_casa ? (
                <p className="mt-6 inline-block rounded-full bg-verde-claro px-4 py-2 text-sm font-medium text-verde-escuro">
                  Dá pra fazer em casa
                </p>
              ) : null}
            </div>

            <div className="lg:pt-2">
              <PlayerYoutube
                youtubeId={e.youtube_id}
                capa={capaDoExperimento(e)}
                titulo={e.titulo}
              />
            </div>
          </header>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,200px)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              {itensIndice.length > 0 ? (
                <IndiceLateral itens={itensIndice} />
              ) : null}
            </div>

            <div className="flex flex-col gap-14">
              {e.materiais.length > 0 ? (
                <Secao id="materiais" titulo="Materiais">
                  <ul className="flex flex-col">
                    {e.materiais.map((m, i) => (
                      <li
                        key={i}
                        className="flex gap-5 border-b border-borda py-4 first:pt-0 last:border-0"
                      >
                        {/* Quantidade em coluna própria, legível. Lista de
                            material é feita pra bater o olho e conferir. */}
                        <span className="w-16 shrink-0 font-mono text-sm text-tinta-2">
                          {m.quantidade ?? "—"}
                        </span>
                        <div>
                          <p className="font-medium">{m.item}</p>
                          {m.substituto ? (
                            <p className="mt-1 text-sm text-tinta-3">
                              <span aria-hidden="true">↔</span> {m.substituto}
                            </p>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                  {e.materiais.some((m) => m.substituto) ? (
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-tinta-3">
                      ↔ substituto, caso não tenha o original
                    </p>
                  ) : null}
                </Secao>
              ) : null}

              {/* Antes do passo a passo de propósito: aviso depois das
                  instruções chega tarde, a pessoa já começou. */}
              {e.seguranca ? (
                <Secao id="seguranca" titulo="Segurança">
                  <div className="flex gap-4 rounded-lg border-l-4 border-ambar bg-ambar-claro p-5">
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xl leading-none text-ambar"
                    >
                      !
                    </span>
                    <p className="text-tinta-2">{e.seguranca}</p>
                  </div>
                </Secao>
              ) : null}

              {e.passos.length > 0 ? (
                <Secao id="passos" titulo="Passo a passo">
                  <ol className="flex flex-col gap-10">
                    {e.passos.map((p, i) => (
                      <li key={i} className="flex gap-5 sm:gap-7">
                        {/* Número com presença: ele é a estrutura da seção.
                            Antes estava na cor da borda, quase invisível. */}
                        <span className="shrink-0 font-titulo text-3xl font-bold leading-none text-verde sm:text-4xl">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1">
                          <p className="text-tinta-2">{p.texto}</p>
                          {/* A foto do passo existia no banco e eu não estava
                              mostrando. Era um bug, não uma escolha. */}
                          {p.imagem_url ? (
                            <Image
                              src={p.imagem_url}
                              alt=""
                              width={900}
                              height={600}
                              className="mt-4 w-full rounded-lg border border-borda object-cover"
                            />
                          ) : null}
                        </div>
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
        </main>
      </div>
      <Rodape />
    </>
  );
}
