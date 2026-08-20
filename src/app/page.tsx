import { Menu } from "@/components/Menu";
import { Hero } from "@/components/Hero";
import { Projeto } from "@/components/Projeto";
import { Numeros } from "@/components/Numeros";
import { Equipe } from "@/components/Equipe";
import { Chamada } from "@/components/Chamada";
import { RodapeDoSite } from "@/components/RodapeDoSite";
import { buscarAjustes } from "@/lib/supabase";

// Os números do alcance vêm do banco, então a landing revalida sozinha
// quando a equipe atualiza pelo painel.
export const revalidate = 60;

/**
 * A ordem segue a prioridade do Augusto: o site é do projeto.
 * Primeiro quem é o Ifesciência, depois a prova, depois a equipe.
 * Os experimentos vêm por último, como recompensa.
 */
export default async function Home() {
  const ajustes = await buscarAjustes();

  return (
    <>
      <div className="conteudo-acima">
        <Menu />
        <main>
          <Hero />
          <Projeto />
          <Numeros ajustes={ajustes} />
          <Equipe />
          <Chamada />
        </main>
      </div>
      <RodapeDoSite />
    </>
  );
}
