import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente do servidor, com a sessão vinda dos cookies.
 *
 * Isto existe para a dashboard poder decidir no servidor se a pessoa entra ou
 * não, antes de mandar qualquer conteúdo. Esconder a tela no navegador não é
 * proteção — quem manda são as regras de acesso do banco, e este cliente é o
 * que faz elas valerem para quem está logado.
 */
export async function criarClienteServidor() {
  const armazem = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => armazem.getAll(),
        setAll: (cookiesNovos) => {
          try {
            cookiesNovos.forEach(({ name, value, options }) =>
              armazem.set(name, value, options),
            );
          } catch {
            // Componente de servidor não pode escrever cookie. Sem problema:
            // quem renova a sessão é o middleware.
          }
        },
      },
    },
  );
}

/** Devolve o membro logado, ou null. É o portão da dashboard. */
export async function membroAtual() {
  const supabase = await criarClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("membros")
    .select("id, nome, email")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}
