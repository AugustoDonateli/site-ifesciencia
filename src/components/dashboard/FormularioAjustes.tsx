"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase-navegador";
import { traduzirErro } from "@/lib/erros";
import { formatarAlcance } from "@/lib/tipos";
import type { Ajustes } from "@/lib/tipos";
import { AreaTexto, Bloco, Reordenar, Rotulo, Texto } from "./Campo";

/** Mostra na hora como o número vai aparecer no site. */
function Previa({ n }: { n: number }) {
  const { valor, decimais, sufixo } = formatarAlcance(n);
  return (
    <p className="mt-1 font-mono text-xs text-tinta-3">
      no site:{" "}
      <span className="text-verde-escuro">
        {valor.toLocaleString("pt-BR", {
          minimumFractionDigits: decimais,
          maximumFractionDigits: decimais,
        })}
        {sufixo}
      </span>
    </p>
  );
}

export function FormularioAjustes({ inicial }: { inicial: Ajustes }) {
  const router = useRouter();
  const [a, setA] = useState<Ajustes>(inicial);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const set = (campo: keyof Ajustes, valor: unknown) => {
    setSalvo(false);
    setA((atual) => ({ ...atual, [campo]: valor }));
  };

  const moverVeiculo = (i: number, d: -1 | 1) => {
    const alvo = i + d;
    if (alvo < 0 || alvo >= a.imprensa.length) return;
    const novos = [...a.imprensa];
    [novos[i], novos[alvo]] = [novos[alvo], novos[i]];
    set("imprensa", novos);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);

    const { error } = await criarClienteNavegador()
      .from("ajustes")
      .update({
        ...a,
        imprensa: a.imprensa.filter((v) => v.trim()),
        nota: a.nota || null,
        instagram_url: a.instagram_url || null,
        youtube_url: a.youtube_url || null,
        tiktok_url: a.tiktok_url || null,
      })
      .eq("id", 1);

    setSalvando(false);
    if (error) return setErro(traduzirErro(error.message));

    setSalvo(true);
    router.refresh();
  };

  return (
    <form onSubmit={salvar} className="max-w-3xl pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Números do site</h1>
        <p className="mt-2 text-tinta-2">
          Estes valores aparecem na página inicial. Mudou o alcance de vocês?
          Atualize aqui — não precisa de programador.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        <Bloco
          titulo="Alcance"
          descricao="Digite o número inteiro. O site escreve por extenso sozinho."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Rotulo htmlFor="seguidores" obrigatorio>
                Seguidores
              </Rotulo>
              <Texto
                id="seguidores"
                type="number"
                min={0}
                required
                value={a.seguidores}
                onChange={(e) => set("seguidores", Number(e.target.value))}
              />
              <Previa n={a.seguidores} />
            </div>

            <div>
              <Rotulo htmlFor="visualizacoes" obrigatorio>
                Visualizações
              </Rotulo>
              <Texto
                id="visualizacoes"
                type="number"
                min={0}
                required
                value={a.visualizacoes}
                onChange={(e) => set("visualizacoes", Number(e.target.value))}
              />
              <Previa n={a.visualizacoes} />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-[10rem_1fr]">
            <div>
              <Rotulo htmlFor="destaque">Terceiro número</Rotulo>
              <Texto
                id="destaque"
                value={a.destaque_valor}
                onChange={(e) => set("destaque_valor", e.target.value)}
                placeholder="2026"
              />
            </div>
            <div>
              <Rotulo htmlFor="destaque-rotulo">Do que se trata</Rotulo>
              <Texto
                id="destaque-rotulo"
                value={a.destaque_rotulo}
                onChange={(e) => set("destaque_rotulo", e.target.value)}
                placeholder="finalista do Prêmio iBest"
              />
            </div>
          </div>

          <div>
            <Rotulo htmlFor="nota" dica="A frase que aparece embaixo dos números.">
              Observação
            </Rotulo>
            <AreaTexto
              id="nota"
              value={a.nota ?? ""}
              onChange={(e) => set("nota", e.target.value)}
            />
          </div>
        </Bloco>

        <Bloco
          titulo="Imprensa"
          descricao="Os veículos que passam correndo na faixa. Lista vazia esconde a faixa."
        >
          <div className="flex flex-col gap-2">
            {a.imprensa.map((veiculo, i) => (
              <div key={i} className="flex items-center gap-2">
                <Reordenar
                  aoSubir={() => moverVeiculo(i, -1)}
                  aoDescer={() => moverVeiculo(i, 1)}
                  primeiro={i === 0}
                  ultimo={i === a.imprensa.length - 1}
                  rotulo={veiculo || `veículo ${i + 1}`}
                />
                <Texto
                  value={veiculo}
                  onChange={(e) => {
                    const novos = [...a.imprensa];
                    novos[i] = e.target.value;
                    set("imprensa", novos);
                  }}
                  aria-label={`Veículo ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "imprensa",
                      a.imprensa.filter((_, j) => j !== i),
                    )
                  }
                  aria-label={`Remover ${veiculo}`}
                  className="rounded-lg border border-borda px-3 py-2.5 text-tinta-3 transition-colors hover:border-tomate hover:text-tomate"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set("imprensa", [...a.imprensa, ""])}
            className="mt-1 w-fit rounded-full border border-borda px-5 py-2 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta"
          >
            + veículo
          </button>
        </Bloco>

        <Bloco
          titulo="Redes"
          descricao="Rede sem endereço não aparece no rodapé, em vez de virar link quebrado."
        >
          {(
            [
              ["instagram_url", "Instagram"],
              ["youtube_url", "YouTube"],
              ["tiktok_url", "TikTok"],
            ] as const
          ).map(([campo, rotulo]) => (
            <div key={campo}>
              <Rotulo htmlFor={campo}>{rotulo}</Rotulo>
              <Texto
                id={campo}
                type="url"
                value={a[campo] ?? ""}
                onChange={(e) => set(campo, e.target.value)}
                placeholder="https://..."
              />
            </div>
          ))}
        </Bloco>
      </div>

      {erro ? (
        <p className="mt-8 rounded-lg border-l-4 border-tomate bg-tomate-claro p-4 text-sm text-tinta-2">
          {erro}
        </p>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-borda bg-creme/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-end gap-4 px-6 py-4">
          <span className="font-mono text-xs text-tinta-3">
            {salvando ? "salvando..." : salvo ? "salvo" : ""}
          </span>
          <button
            type="submit"
            disabled={salvando}
            className="rounded-full bg-verde px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-verde-escuro disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </form>
  );
}
