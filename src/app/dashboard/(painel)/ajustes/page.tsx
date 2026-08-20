import { criarClienteServidor } from "@/lib/supabase-servidor";
import { FormularioAjustes } from "@/components/dashboard/FormularioAjustes";
import type { Ajustes } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function PaginaAjustes() {
  const supabase = await criarClienteServidor();

  const { data } = await supabase
    .from("ajustes")
    .select(
      "seguidores, visualizacoes, destaque_valor, destaque_rotulo, nota, imprensa, instagram_url, youtube_url, tiktok_url",
    )
    .eq("id", 1)
    .single();

  return <FormularioAjustes inicial={data as Ajustes} />;
}
