import Link from "next/link";
import { criarClienteServidor } from "@/lib/supabase-servidor";
import {
  ListaExperimentos,
  type LinhaPainel,
} from "@/components/dashboard/ListaExperimentos";

export const dynamic = "force-dynamic";

export default async function Painel() {
  const supabase = await criarClienteServidor();

  // Membro enxerga rascunho também — quem filtra por "publicado" é o site
  // público, não o painel.
  const { data } = await supabase
    .from("experimentos")
    .select("id, slug, titulo, area, publicado, ordem, capa_url, atualizado_em")
    .order("ordem", { ascending: false })
    .order("criado_em", { ascending: false });

  const linhas = (data ?? []) as LinhaPainel[];
  const noAr = linhas.filter((l) => l.publicado).length;

  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Experimentos</h1>
          <p className="mt-2 font-mono text-xs text-tinta-3">
            {noAr} no ar · {linhas.length - noAr} em rascunho
          </p>
        </div>
        <Link
          href="/dashboard/experimento/novo"
          className="rounded-full bg-verde px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
        >
          Novo experimento
        </Link>
      </div>

      <ListaExperimentos inicial={linhas} />
    </>
  );
}
