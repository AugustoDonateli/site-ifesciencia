import Link from "next/link";
import { Menu } from "@/components/Menu";
import { RodapeDoSite } from "@/components/RodapeDoSite";

export default function NaoEncontrado() {
  return (
    <>
      <div className="conteudo-acima">
        <Menu />
        <main className="mx-auto flex w-full max-w-[1240px] flex-col items-start px-6 py-24 md:py-32">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-2">
            Erro 404
          </p>
          <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl">
            Essa página <span className="destaque">não</span> existe
          </h1>
          <p className="mt-6 max-w-md text-lg text-tinta-2">
            Ou o endereço está errado, ou o experimento ainda não foi publicado.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/experimentos"
              className="rounded-full bg-verde px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
            >
              Ver experimentos
            </Link>
            <Link
              href="/"
              className="rounded-full border border-tinta px-7 py-3.5 text-sm font-medium transition-colors hover:bg-creme-2"
            >
              Voltar pro início
            </Link>
          </div>
        </main>
      </div>
      <RodapeDoSite />
    </>
  );
}
