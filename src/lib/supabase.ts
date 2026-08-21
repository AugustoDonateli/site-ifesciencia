import { createClient } from "@supabase/supabase-js";
import type { Ajustes, Experimento } from "./tipos";

/**
 * Cliente de leitura pública.
 *
 * A chave é publicável de propósito: ela vai para o navegador. Quem decide o
 * que pode ser lido ou escrito são as regras de acesso do banco (RLS), não o
 * segredo da chave. Com ela, de fora só se enxerga experimento publicado.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

/** Só o que o catálogo precisa — não traz passo a passo nem textos longos. */
export async function listarExperimentos() {
  const { data, error } = await supabase
    .from("experimentos")
    .select(
      "id, slug, titulo, gancho, area, nivel, capa_url, tempo_execucao_min, custo_centavos, dificuldade, pode_fazer_em_casa",
    )
    .eq("publicado", true)
    .order("ordem", { ascending: false })
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data;
}

export async function buscarExperimento(slug: string) {
  const { data, error } = await supabase
    .from("experimentos")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();

  if (error) throw error;
  return data as Experimento | null;
}

/** Outros da mesma área, pra ficha terminar oferecendo um próximo passo. */
export async function listarRelacionados(area: string, slugAtual: string) {
  const { data, error } = await supabase
    .from("experimentos")
    .select(
      "id, slug, titulo, gancho, area, capa_url, tempo_execucao_min, custo_centavos, dificuldade, pode_fazer_em_casa",
    )
    .eq("publicado", true)
    .eq("area", area)
    .neq("slug", slugAtual)
    .order("ordem", { ascending: false })
    .limit(3);

  if (error) throw error;
  return data;
}

/**
 * Números e links do site.
 *
 * Se o banco não responder, a landing ainda abre com os últimos valores
 * conhecidos em vez de quebrar — página sem número é ruim, página fora do
 * ar é pior.
 */
export async function buscarAjustes(): Promise<Ajustes> {
  const reserva: Ajustes = {
    seguidores: 500_000,
    visualizacoes: 13_000_000,
    destaque_valor: "2026",
    destaque_rotulo: "finalista do Prêmio iBest, categoria Ciências",
    nota: null,
    imprensa: [],
    instagram_url: "https://www.instagram.com/ifesciencia/",
    youtube_url: "https://www.youtube.com/@IFESCiência/shorts",
    tiktok_url: "https://www.tiktok.com/@ifesciencia",
  };

  const { data, error } = await supabase
    .from("ajustes")
    .select(
      "seguidores, visualizacoes, destaque_valor, destaque_rotulo, nota, imprensa, instagram_url, youtube_url, tiktok_url",
    )
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return reserva;
  return data as Ajustes;
}
