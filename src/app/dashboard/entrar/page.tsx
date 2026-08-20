"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { criarClienteNavegador } from "@/lib/supabase-navegador";

/**
 * Entrada da equipe.
 *
 * Senha em vez de link no e-mail. O serviço de e-mail embutido do Supabase
 * manda pouquíssimas mensagens por hora — é feito para desenvolvimento, não
 * para uso real. Depender dele significaria que publicar um experimento pode
 * falhar porque outra pessoa da equipe entrou primeiro naquela hora.
 *
 * A segurança não vem daqui: qualquer um consegue criar uma conta. Quem não
 * estiver na lista de e-mails autorizados não vira membro, e as regras de
 * acesso do banco não deixam ler nem escrever nada.
 */
export default function Entrar() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const motivo = new URLSearchParams(window.location.search).get("erro");
    if (motivo) setErro(motivo);
  }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setOcupado(true);
    setErro(null);

    const supabase = criarClienteNavegador();
    const credenciais = { email: email.trim().toLowerCase(), password: senha };

    const { error } =
      modo === "entrar"
        ? await supabase.auth.signInWithPassword(credenciais)
        : await supabase.auth.signUp(credenciais);

    if (error) {
      setErro(traduzir(error.message));
      setOcupado(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Área da equipe
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {modo === "entrar" ? "Entrar no " : "Criar acesso ao "}
          <span className="text-verde">Ifesciência</span>
        </h1>

        <form onSubmit={enviar} className="mt-8">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Seu e-mail
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-borda bg-creme px-4 py-3 outline-none transition-colors focus:border-verde"
          />

          <label htmlFor="senha" className="mb-2 mt-5 block text-sm font-medium">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            required
            minLength={6}
            autoComplete={modo === "entrar" ? "current-password" : "new-password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-lg border border-borda bg-creme px-4 py-3 outline-none transition-colors focus:border-verde"
          />
          {modo === "criar" ? (
            <p className="mt-2 text-xs text-tinta-3">Mínimo de 6 caracteres.</p>
          ) : null}

          {erro ? <p className="mt-4 text-sm text-tomate">{erro}</p> : null}

          <button
            type="submit"
            disabled={ocupado}
            className="mt-6 w-full rounded-full bg-verde px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-verde-escuro disabled:opacity-60"
          >
            {ocupado
              ? "Um instante..."
              : modo === "entrar"
                ? "Entrar"
                : "Criar acesso"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setModo(modo === "entrar" ? "criar" : "entrar");
            setErro(null);
          }}
          className="mt-6 text-sm text-tinta-2 underline underline-offset-4 transition-colors hover:text-tinta"
        >
          {modo === "entrar"
            ? "Primeira vez aqui? Criar meu acesso"
            : "Já tenho acesso, quero entrar"}
        </button>

        <p className="mt-8 text-sm text-tinta-3">
          Só quem está na lista de autorizados consegue usar o painel.
        </p>
      </div>
    </main>
  );
}

/** As mensagens do Supabase vêm em inglês e técnicas demais. */
function traduzir(mensagem: string) {
  const m = mensagem.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "E-mail ou senha não conferem.";
  if (m.includes("already registered"))
    return "Esse e-mail já tem acesso. Use a opção de entrar.";
  if (m.includes("rate limit"))
    return "Muitas tentativas seguidas. Espere alguns minutos.";
  if (m.includes("password"))
    return "A senha precisa de pelo menos 6 caracteres.";
  if (m.includes("confirm"))
    return "A confirmação por e-mail ainda está ligada no Supabase — precisa ser desligada.";
  return mensagem;
}
