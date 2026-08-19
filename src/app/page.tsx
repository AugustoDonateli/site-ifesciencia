import { Menu } from "@/components/Menu";
import { Hero } from "@/components/Hero";
import { Projeto } from "@/components/Projeto";
import { Numeros } from "@/components/Numeros";
import { Equipe } from "@/components/Equipe";
import { Chamada } from "@/components/Chamada";
import { Rodape } from "@/components/Rodape";

/**
 * Etapa 3 — a landing inteira, sem nenhuma animação.
 *
 * A ordem segue a prioridade do Augusto: o site é do projeto.
 * Primeiro quem é o Ifesciência, depois a prova, depois a equipe.
 * Os experimentos vêm por último, como recompensa.
 */
export default function Home() {
  return (
    <>
      <Menu />
      <main className="flex-1">
        <Hero />
        <Projeto />
        <Numeros />
        <Equipe />
        <Chamada />
      </main>
      <Rodape />
    </>
  );
}
