import type { Metadata } from "next";
import { Menu } from "@/components/Menu";
import { RodapeDoSite } from "@/components/RodapeDoSite";
import { CatalogoLista, type Filtros } from "@/components/CatalogoLista";
import type { ItemCatalogo } from "@/components/CartaoExperimento";
import { listarExperimentos } from "@/lib/supabase";
import type { Area } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Experimentos — Ifesciência",
  description:
    "Todo experimento do Ifesciência com materiais, passo a passo, vídeo e PDF. De graça, para qualquer professor do Brasil.",
};

// O catálogo se atualiza sozinho quando a equipe publica algo novo,
// sem precisar de um novo deploy.
export const revalidate = 60;

/**
 * Os filtros vêm do endereço, e não só de um estado no navegador.
 *
 * É o que faz um link filtrado servir: a professora manda "os de química que
 * dão pra fazer em casa" no grupo da escola e quem abre já cai na lista certa,
 * sem precisar refazer os cliques.
 */
export default async function Experimentos({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; nivel?: string; casa?: string }>;
}) {
  const { area, nivel, casa } = await searchParams;
  const filtrosIniciais: Filtros = {
    area: ["fisica", "quimica", "biologia"].includes(area ?? "")
      ? (area as Area)
      : null,
    nivel: ["fundamental", "medio"].includes(nivel ?? "")
      ? (nivel as Filtros["nivel"])
      : null,
    soCasa: casa === "1",
  };

  // Se o banco não responder, a página ainda abre — só sem lista.
  // Um catálogo vazio é ruim; a página inteira fora do ar é pior.
  let experimentos: ItemCatalogo[] = [];
  try {
    experimentos = (await listarExperimentos()) as ItemCatalogo[];
  } catch {
    experimentos = [];
  }

  return (
    <>
      <div className="conteudo-acima">
        <Menu />
        <main className="mx-auto w-full max-w-[1240px] px-6 py-20 md:py-28">
          <header className="mb-14 max-w-2xl">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-2">
              Para professores
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Experimentos
            </h1>
            <p className="mt-6 text-lg text-tinta-2">
              Cada vídeo do Ifesciência vira uma ficha com os materiais, o passo
              a passo e o que costuma dar errado. Sem cadastro e sem custo.
            </p>
          </header>

          <CatalogoLista
            experimentos={experimentos}
            filtrosIniciais={filtrosIniciais}
          />
        </main>
      </div>
      <RodapeDoSite />
    </>
  );
}
