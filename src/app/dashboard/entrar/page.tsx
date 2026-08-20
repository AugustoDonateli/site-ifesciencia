"use client";

import { useEffect, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase-navegador";

/**
 * Login por link no e-mail. Sem senha de propósito: são cinco pessoas, a
 * equipe troca todo ano letivo, e senha esquecida vira suporte pra mim.
 * Link no e-mail não tem o que esquecer.
 */
export default function Entrar() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"parado" | "enviando" | "enviado">(
    "parado",
  );
  const [erro, setErro] = useState<string | null>(null);

  // O link do e-mail volta com o motivo quando falha, e sem isto a pessoa
  // ficaria olhando um formulário em branco sem saber o que aconteceu.
  useEffect(() => {
    const motivo = new URLSearchParams(window.location.search).get("erro");
    if (motivo) setErro(motivo);
  }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");
    setErro(null);

    const supabase = criarClienteNavegador();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirmar`,
      },
    });

    if (error) {
      setErro(error.message);
      setEstado("parado");
      return;
    }
    setEstado("enviado");
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Área da equipe
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Entrar no <span className="text-verde">Ifesciência</span>
        </h1>

        {estado === "enviado" ? (
          <div className="mt-8 rounded-lg border border-borda bg-creme-2 p-5">
            <p className="font-medium">Link enviado</p>
            <p className="mt-2 text-sm text-tinta-2">
              Abra o e-mail que acabou de chegar em{" "}
              <span className="text-tinta">{email}</span> e clique no link. Ele
              traz você direto para cá, já conectado.
            </p>
          </div>
        ) : (
          <form onSubmit={enviar} className="mt-8">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-tinta-2"
            >
              Seu e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="voce@exemplo.com"
              className="w-full rounded-lg border border-borda bg-creme px-4 py-3 outline-none transition-colors focus:border-verde"
            />

            {erro ? (
              <p className="mt-3 text-sm text-tomate">{erro}</p>
            ) : null}

            <button
              type="submit"
              disabled={estado === "enviando"}
              className="mt-5 w-full rounded-full bg-verde px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-verde-escuro disabled:opacity-60"
            >
              {estado === "enviando" ? "Enviando..." : "Receber link de acesso"}
            </button>

            <p className="mt-5 text-sm text-tinta-3">
              Só funciona para e-mails autorizados da equipe.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
