import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Menu } from "@/components/Menu";
import { Rodape } from "@/components/Rodape";
import { buscarExperimento } from "@/lib/supabase";
import { NOME_AREA } from "@/lib/tipos";

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
    description: e.gancho ?? undefined,
  };
}

// A ficha completa é a etapa 7. Isto existe pra o link do catálogo não
// levar a lugar nenhum enquanto isso.
export default async function Ficha({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experimento = await buscarExperimento(slug).catch(() => null);
  if (!experimento) notFound();

  return (
    <>
      <div className="conteudo-acima">
        <Menu />
        <main className="mx-auto w-full max-w-[1240px] px-6 py-20 md:py-28">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-2">
            {NOME_AREA[experimento.area]}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl lg:text-6xl">
            {experimento.titulo}
          </h1>
          {experimento.gancho ? (
            <p className="mt-6 max-w-xl text-lg text-tinta-2">
              {experimento.gancho}
            </p>
          ) : null}

          <p className="mt-10 max-w-xl text-tinta-2">
            A ficha completa — materiais, passo a passo, vídeo e PDF — está
            sendo construída.
          </p>

          <Link
            href="/experimentos"
            className="mt-8 inline-block rounded-full border border-tinta px-7 py-3.5 text-sm font-medium transition-colors hover:bg-creme-2"
          >
            Voltar pros experimentos
          </Link>
        </main>
      </div>
      <Rodape />
    </>
  );
}
