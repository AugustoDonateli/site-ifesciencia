"use client";

import { useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase-navegador";
import { Texto } from "./Campo";

type Autorizado = { email: string; nome: string; jaEntrou: boolean };

export function ListaEquipe({ inicial }: { inicial: Autorizado[] }) {
  const [lista, setLista] = useState(inicial);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const supabase = criarClienteNavegador();

  const autorizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setOcupado(true);
    setErro(null);

    const novo = { email: email.trim().toLowerCase(), nome: nome.trim() };
    const { error } = await supabase.from("emails_autorizados").insert(novo);
    setOcupado(false);

    if (error) return setErro(error.message);
    setLista((atual) => [...atual, { ...novo, jaEntrou: false }]);
    setNome("");
    setEmail("");
  };

  const remover = async (alvo: Autorizado) => {
    // Tirar da lista não desfaz quem já entrou — o membro continua no banco.
    // Deixo isso explícito pra ninguém achar que removeu o acesso e não removeu.
    const aviso = alvo.jaEntrou
      ? `${alvo.nome} já entrou uma vez. Tirar da lista impede novos acessos, mas a conta dele continua existindo — me avise para revogar de vez.\n\nTirar da lista?`
      : `Tirar ${alvo.nome} da lista de autorizados?`;
    if (!window.confirm(aviso)) return;

    setOcupado(true);
    const { error } = await supabase
      .from("emails_autorizados")
      .delete()
      .eq("email", alvo.email);
    setOcupado(false);

    if (error) return setErro(error.message);
    setLista((atual) => atual.filter((a) => a.email !== alvo.email));
  };

  return (
    <div className="max-w-2xl">
      <ul className="flex flex-col">
        {lista.map((a) => (
          <li
            key={a.email}
            className="flex flex-wrap items-center gap-4 border-b border-borda py-4 first:border-t"
          >
            <div className="min-w-[12rem] flex-1">
              <p className="font-medium">{a.nome}</p>
              <p className="font-mono text-xs text-tinta-3">{a.email}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                a.jaEntrou
                  ? "bg-verde-claro text-verde-escuro"
                  : "bg-creme-2 text-tinta-3"
              }`}
            >
              {a.jaEntrou ? "já entrou" : "nunca entrou"}
            </span>
            <button
              type="button"
              onClick={() => remover(a)}
              disabled={ocupado}
              className="rounded-full border border-borda px-4 py-1.5 text-sm text-tinta-3 transition-colors hover:border-tomate hover:text-tomate disabled:opacity-50"
            >
              Tirar
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={autorizar} className="mt-10 border-t border-borda pt-8">
        <h2 className="text-xl font-bold">Autorizar alguém</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
          <Texto
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            aria-label="Nome"
          />
          <Texto
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            aria-label="E-mail"
          />
          <button
            type="submit"
            disabled={ocupado}
            className="rounded-full bg-verde px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-verde-escuro disabled:opacity-60"
          >
            Autorizar
          </button>
        </div>
        {erro ? <p className="mt-3 text-sm text-tomate">{erro}</p> : null}
      </form>
    </div>
  );
}
