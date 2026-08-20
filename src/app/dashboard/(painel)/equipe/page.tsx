import { criarClienteServidor } from "@/lib/supabase-servidor";
import { ListaEquipe } from "@/components/dashboard/ListaEquipe";

export const dynamic = "force-dynamic";

export default async function Equipe() {
  const supabase = await criarClienteServidor();

  const [{ data: autorizados }, { data: membros }] = await Promise.all([
    supabase
      .from("emails_autorizados")
      .select("email, nome")
      .order("nome"),
    supabase.from("membros").select("id, email").order("email"),
  ]);

  const jaEntraram = new Set((membros ?? []).map((m) => m.email));

  return (
    <>
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Equipe</h1>
        <p className="mt-3 text-tinta-2">
          Quem estiver nesta lista consegue entrar no painel. A conta é criada
          sozinha no primeiro acesso — ninguém precisa me chamar para liberar.
        </p>
      </div>

      <ListaEquipe
        inicial={(autorizados ?? []).map((a) => ({
          ...a,
          jaEntrou: jaEntraram.has(a.email),
        }))}
      />
    </>
  );
}
