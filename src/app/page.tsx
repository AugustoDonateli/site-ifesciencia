import { Menu } from "@/components/Menu";
import { Hero } from "@/components/Hero";
import { Numeros } from "@/components/Numeros";
import { Sobre } from "@/components/Sobre";
import { Equipe } from "@/components/Equipe";
import { Chamada } from "@/components/Chamada";
import { Rodape } from "@/components/Rodape";

/**
 * Etapa 3 — a landing inteira, sem nenhuma animação.
 * As mecânicas entram na etapa 4 (landing) e na etapa 5 (galeria da equipe).
 */
export default function Home() {
  return (
    <>
      <Menu />
      <main className="flex-1">
        <Hero />
        <Numeros />
        <Sobre />
        <Equipe />
        <Chamada />
      </main>
      <Rodape />
    </>
  );
}
