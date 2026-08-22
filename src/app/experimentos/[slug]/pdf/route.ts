import { buscarExperimento } from "@/lib/supabase";
import { gerarFichaPdf } from "@/lib/pdf";
import { enderecoDoSite } from "@/lib/site";

/**
 * A ficha em PDF de um experimento.
 *
 * Vale a decisão D15: quando a equipe sobe um PDF próprio pelo painel, é ele
 * que vale e esta rota apenas redireciona. Sem arquivo enviado — que é o caso
 * normal — o site gera a partir dos campos, e é isso que faz a promessa da
 * chamada final ("um PDF para imprimir") valer para TODO experimento, e não só
 * para os que alguém lembrou de preparar à mão.
 */
export const revalidate = 300;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const e = await buscarExperimento(slug).catch(() => null);

  if (!e) {
    return new Response("Experimento não encontrado", { status: 404 });
  }

  if (e.pdf_url) {
    return Response.redirect(e.pdf_url, 302);
  }

  const bytes = await gerarFichaPdf(e, enderecoDoSite);

  /**
   * `inline` e não `attachment`: no celular, que é por onde o site é aberto,
   * baixar um arquivo às cegas é pior que abrir — a pessoa confere se é o que
   * queria e aí decide salvar ou compartilhar. O nome do arquivo já vai certo
   * para quando ela salvar.
   */
  return new Response(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="ifesciencia-${slug}.pdf"`,
      "Cache-Control":
        "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
