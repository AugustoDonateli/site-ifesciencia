"use client";

import { useRouter } from "next/navigation";
import { criarClienteNavegador } from "@/lib/supabase-navegador";

export function SairDaConta() {
  const router = useRouter();

  const sair = async () => {
    await criarClienteNavegador().auth.signOut();
    router.replace("/dashboard/entrar");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={sair}
      className="rounded-full border border-borda px-4 py-2 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta"
    >
      Sair
    </button>
  );
}
