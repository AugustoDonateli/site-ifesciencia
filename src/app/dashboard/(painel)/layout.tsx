import Link from "next/link";
import { redirect } from "next/navigation";
import { membroAtual } from "@/lib/supabase-servidor";
import { SairDaConta } from "@/components/dashboard/SairDaConta";

/**
 * O portão da dashboard, no servidor.
 *
 * Esconder a tela no navegador não é proteção — quem realmente barra são as
 * regras de acesso do banco. Isto aqui existe para a pessoa errada nem
 * receber a página, em vez de receber uma tela que não funciona.
 *
 * A tela de entrar fica fora deste grupo de rotas de propósito: se estivesse
 * dentro, o redirecionamento cairia em si mesmo, em círculo.
 */
export default async function LayoutPainel({
  children,
}: {
  children: React.ReactNode;
}) {
  const membro = await membroAtual();
  if (!membro) redirect("/dashboard/entrar");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-borda bg-creme">
        <nav className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="font-titulo text-xl font-bold tracking-tight"
            >
              <span className="text-verde">Ifesciência</span>
              <span className="ml-2 font-mono text-xs uppercase tracking-widest text-tinta-3">
                painel
              </span>
            </Link>
            <Link
              href="/dashboard/ajustes"
              className="text-sm text-tinta-2 transition-colors hover:text-tinta"
            >
              Números
            </Link>
            <Link
              href="/dashboard/equipe"
              className="text-sm text-tinta-2 transition-colors hover:text-tinta"
            >
              Equipe
            </Link>
            <Link
              href="/"
              className="text-sm text-tinta-2 transition-colors hover:text-tinta"
            >
              Ver o site
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-tinta-3 sm:inline">
              {membro.nome}
            </span>
            <SairDaConta />
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1240px] flex-1 px-6 py-12">
        {children}
      </main>
    </>
  );
}
