import { Rodape, type Rede } from "./Rodape";
import { buscarAjustes } from "@/lib/supabase";

/**
 * Busca os links das redes e entrega ao rodapé.
 *
 * O rodapé precisa ser componente de navegador — ele mede a própria altura
 * para o efeito de aparecer por trás. Como componente de navegador não busca
 * dados no servidor, esta casca faz a busca e passa pronto.
 *
 * Rede sem endereço cadastrado simplesmente não aparece, em vez de virar um
 * link que não leva a lugar nenhum.
 */
export async function RodapeDoSite() {
  const ajustes = await buscarAjustes();

  const redes: Rede[] = [
    { rotulo: "Instagram", href: ajustes.instagram_url },
    { rotulo: "YouTube", href: ajustes.youtube_url },
    { rotulo: "TikTok", href: ajustes.tiktok_url },
  ].filter((r): r is Rede => Boolean(r.href));

  return <Rodape redes={redes} />;
}
