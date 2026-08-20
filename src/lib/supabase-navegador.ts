"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente do navegador com sessão. Diferente do cliente público de leitura
 * (supabase.ts): este carrega quem está logado, então as regras de acesso do
 * banco reconhecem o membro e liberam escrita.
 */
export function criarClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
