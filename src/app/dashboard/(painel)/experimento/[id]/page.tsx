import { notFound } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase-servidor";
import { FormularioExperimento } from "@/components/dashboard/FormularioExperimento";
import type { Experimento } from "@/lib/tipos";

export const dynamic = "force-dynamic";

/** "novo" cria; qualquer outro valor é o id de um experimento existente. */
export default async function EditarExperimento({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "novo") return <FormularioExperimento experimento={null} />;

  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("experimentos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return <FormularioExperimento experimento={data as Experimento} />;
}
