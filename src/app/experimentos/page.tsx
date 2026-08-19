import Link from "next/link";
import type { Metadata } from "next";
import { Menu } from "@/components/Menu";
import { Rodape } from "@/components/Rodape";

export const metadata: Metadata = {
  title: "Experimentos — Ifesciência",
  description: "Todos os experimentos, com material, passo a passo e PDF.",
};

// O catálogo de verdade é a etapa 6. Isto existe só para o menu não dar erro.
export default function Experimentos() {
  return (
    <>
      <Menu />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start px-6 py-24">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Em breve
        </p>
        <h1 className="text-5xl font-bold sm:text-6xl">Experimentos</h1>
        <p className="mt-5 max-w-md text-lg text-tinta-2">
          O catálogo está sendo montado. Vai ter todos os experimentos com
          material, passo a passo, vídeo e PDF.
        </p>
        <Link
          href="/"
          className="mt-9 rounded-full border border-tinta px-7 py-3.5 text-sm font-medium transition-colors hover:bg-creme-2"
        >
          Voltar pro início
        </Link>
      </main>
      <Rodape />
    </>
  );
}
