"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { criarClienteNavegador } from "@/lib/supabase-navegador";
import { AreaTexto, Bloco, Rotulo, Selecao, Texto } from "./Campo";
import { EnviarArquivo } from "./EnviarArquivo";
import type { Area, Dificuldade, Experimento, Material, Nivel, Passo } from "@/lib/tipos";

/** Título vira endereço: sem acento, sem espaço, sem símbolo. */
function gerarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Aceita o link inteiro do YouTube ou só o código — ninguém deveria ter que saber a diferença. */
function extrairYoutubeId(entrada: string) {
  const texto = entrada.trim();
  const padroes = [
    /(?:youtube\.com\/shorts\/)([\w-]{6,})/,
    /(?:youtu\.be\/)([\w-]{6,})/,
    /(?:[?&]v=)([\w-]{6,})/,
    /(?:youtube\.com\/embed\/)([\w-]{6,})/,
  ];
  for (const p of padroes) {
    const achou = texto.match(p);
    if (achou) return achou[1];
  }
  return texto;
}

type Rascunho = Partial<Experimento>;

export function FormularioExperimento({
  experimento,
}: {
  experimento: Experimento | null;
}) {
  const router = useRouter();
  const novo = !experimento;

  const [f, setF] = useState<Rascunho>(
    experimento ?? {
      titulo: "",
      slug: "",
      area: "fisica",
      nivel: "fundamental",
      youtube_id: "",
      dificuldade: "facil",
      materiais: [],
      passos: [],
      publicado: false,
      ordem: 0,
    },
  );
  const [slugTocado, setSlugTocado] = useState(!novo);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const set = (campo: keyof Experimento, valor: unknown) =>
    setF((atual) => ({ ...atual, [campo]: valor }));

  const materiais = (f.materiais ?? []) as Material[];
  const passos = (f.passos ?? []) as Passo[];

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);

    const supabase = criarClienteNavegador();

    const dados = {
      ...f,
      slug: f.slug || gerarSlug(f.titulo ?? ""),
      youtube_id: extrairYoutubeId(f.youtube_id ?? ""),
      // Vazio vira nulo: é o nulo que faz o bloco sumir da ficha.
      gancho: f.gancho || null,
      por_que_funciona: f.por_que_funciona || null,
      o_que_da_errado: f.o_que_da_errado || null,
      seguranca: f.seguranca || null,
      materiais: materiais.filter((m) => m.item.trim()),
      passos: passos.filter((p) => p.texto.trim()),
    };
    delete (dados as Rascunho).id;
    delete (dados as Rascunho).criado_em;
    delete (dados as Rascunho).atualizado_em;

    const resposta = novo
      ? await supabase.from("experimentos").insert(dados).select("id").single()
      : await supabase
          .from("experimentos")
          .update(dados)
          .eq("id", experimento!.id)
          .select("id")
          .single();

    setSalvando(false);
    if (resposta.error) return setErro(resposta.error.message);

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={salvar} className="max-w-3xl">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold sm:text-4xl">
          {novo ? "Novo experimento" : "Editar experimento"}
        </h1>
        <Link
          href="/dashboard"
          className="text-sm text-tinta-2 transition-colors hover:text-tinta"
        >
          ← Voltar
        </Link>
      </div>

      <div className="flex flex-col gap-10">
        <Bloco
          titulo="Obrigatórios"
          descricao="Só com isto a ficha já publica bonita. Uns 10 minutos."
        >
          <div>
            <Rotulo htmlFor="titulo">Título</Rotulo>
            <Texto
              id="titulo"
              required
              value={f.titulo ?? ""}
              onChange={(e) => {
                set("titulo", e.target.value);
                if (!slugTocado) set("slug", gerarSlug(e.target.value));
              }}
              placeholder="A lata que amassa sozinha"
            />
          </div>

          <div>
            <Rotulo htmlFor="slug" dica="É o endereço da ficha no site.">
              Endereço
            </Rotulo>
            <Texto
              id="slug"
              required
              value={f.slug ?? ""}
              onChange={(e) => {
                setSlugTocado(true);
                set("slug", gerarSlug(e.target.value));
              }}
            />
          </div>

          <div>
            <Rotulo
              htmlFor="youtube"
              dica="Pode colar o link inteiro do YouTube — a gente extrai o código."
            >
              Vídeo
            </Rotulo>
            <Texto
              id="youtube"
              required
              value={f.youtube_id ?? ""}
              onChange={(e) => set("youtube_id", e.target.value)}
              placeholder="https://youtube.com/shorts/..."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <Rotulo htmlFor="area">Área</Rotulo>
              <Selecao
                id="area"
                value={f.area}
                onChange={(e) => set("area", e.target.value as Area)}
              >
                <option value="fisica">Física</option>
                <option value="quimica">Química</option>
                <option value="biologia">Biologia</option>
              </Selecao>
            </div>
            <div>
              <Rotulo htmlFor="nivel">Nível</Rotulo>
              <Selecao
                id="nivel"
                value={f.nivel}
                onChange={(e) => set("nivel", e.target.value as Nivel)}
              >
                <option value="fundamental">Ensino fundamental</option>
                <option value="medio">Ensino médio</option>
                <option value="ambos">Os dois</option>
              </Selecao>
            </div>
            <div>
              <Rotulo htmlFor="dificuldade">Dificuldade</Rotulo>
              <Selecao
                id="dificuldade"
                value={f.dificuldade}
                onChange={(e) =>
                  set("dificuldade", e.target.value as Dificuldade)
                }
              >
                <option value="facil">Fácil</option>
                <option value="media">Média</option>
                <option value="dificil">Difícil</option>
              </Selecao>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <Rotulo htmlFor="preparo">Preparo (min)</Rotulo>
              <Texto
                id="preparo"
                type="number"
                min={0}
                value={f.tempo_preparo_min ?? ""}
                onChange={(e) =>
                  set(
                    "tempo_preparo_min",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              />
            </div>
            <div>
              <Rotulo htmlFor="execucao">Execução (min)</Rotulo>
              <Texto
                id="execucao"
                type="number"
                min={0}
                value={f.tempo_execucao_min ?? ""}
                onChange={(e) =>
                  set(
                    "tempo_execucao_min",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              />
            </div>
            <div>
              <Rotulo htmlFor="custo" dica="Em reais.">
                Custo
              </Rotulo>
              <Texto
                id="custo"
                type="number"
                min={0}
                step="0.01"
                value={
                  f.custo_centavos != null ? f.custo_centavos / 100 : ""
                }
                onChange={(e) =>
                  set(
                    "custo_centavos",
                    e.target.value
                      ? Math.round(Number(e.target.value) * 100)
                      : null,
                  )
                }
              />
            </div>
          </div>

          <ListaMateriais
            materiais={materiais}
            aoMudar={(novos) => set("materiais", novos)}
          />

          <ListaPassos
            passos={passos}
            aoMudar={(novos) => set("passos", novos)}
          />
        </Bloco>

        <Bloco
          titulo="Opcionais"
          descricao="Campo vazio não aparece no site — nada de espaço em branco."
        >
          <div>
            <Rotulo htmlFor="gancho" dica="A pergunta que o vídeo faz.">
              Gancho
            </Rotulo>
            <Texto
              id="gancho"
              value={f.gancho ?? ""}
              onChange={(e) => set("gancho", e.target.value)}
              placeholder="Ninguém encosta na lata e ela amassa. Quem faz isso?"
            />
          </div>

          <div>
            <Rotulo htmlFor="porque">Por que funciona</Rotulo>
            <AreaTexto
              id="porque"
              value={f.por_que_funciona ?? ""}
              onChange={(e) => set("por_que_funciona", e.target.value)}
            />
          </div>

          <div>
            <Rotulo htmlFor="errado">O que costuma dar errado</Rotulo>
            <AreaTexto
              id="errado"
              value={f.o_que_da_errado ?? ""}
              onChange={(e) => set("o_que_da_errado", e.target.value)}
            />
          </div>

          <div>
            <Rotulo
              htmlFor="seguranca"
              dica="Aparece em destaque, antes do passo a passo."
            >
              Segurança
            </Rotulo>
            <AreaTexto
              id="seguranca"
              value={f.seguranca ?? ""}
              onChange={(e) => set("seguranca", e.target.value)}
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={f.pode_fazer_em_casa ?? false}
              onChange={(e) => set("pode_fazer_em_casa", e.target.checked)}
              className="h-4 w-4 accent-[#2F9E44]"
            />
            <span className="text-sm font-medium">Dá pra fazer em casa</span>
          </label>

          <EnviarArquivo
            balde="imagens"
            rotulo="Capa"
            valor={f.capa_url ?? null}
            aoMudar={(url) => set("capa_url", url)}
          />

          <EnviarArquivo
            balde="pdfs"
            rotulo="PDF próprio"
            imagem={false}
            valor={f.pdf_url ?? null}
            aoMudar={(url) => set("pdf_url", url)}
          />
        </Bloco>
      </div>

      {erro ? (
        <p className="mt-8 rounded-lg border-l-4 border-tomate bg-tomate-claro p-4 text-sm text-tinta-2">
          {erro}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-borda pt-8">
        <button
          type="submit"
          disabled={salvando}
          className="rounded-full bg-verde px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-verde-escuro disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={f.publicado ?? false}
            onChange={(e) => set("publicado", e.target.checked)}
            className="h-4 w-4 accent-[#2F9E44]"
          />
          <span className="text-sm">Publicar no site</span>
        </label>
      </div>
    </form>
  );
}

function ListaMateriais({
  materiais,
  aoMudar,
}: {
  materiais: Material[];
  aoMudar: (m: Material[]) => void;
}) {
  const trocar = (i: number, campo: keyof Material, valor: string) => {
    const novos = [...materiais];
    novos[i] = { ...novos[i], [campo]: valor };
    aoMudar(novos);
  };

  return (
    <div>
      <Rotulo htmlFor="materiais" dica="O substituto é o que salva escola sem verba.">
        Materiais
      </Rotulo>
      <div id="materiais" className="flex flex-col gap-3">
        {materiais.map((m, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[6rem_1fr_1fr_auto]">
            <Texto
              value={m.quantidade ?? ""}
              onChange={(e) => trocar(i, "quantidade", e.target.value)}
              placeholder="1"
              aria-label="Quantidade"
            />
            <Texto
              value={m.item}
              onChange={(e) => trocar(i, "item", e.target.value)}
              placeholder="Lata de refrigerante vazia"
              aria-label="Item"
            />
            <Texto
              value={m.substituto ?? ""}
              onChange={(e) => trocar(i, "substituto", e.target.value)}
              placeholder="Substituto (opcional)"
              aria-label="Substituto"
            />
            <button
              type="button"
              onClick={() => aoMudar(materiais.filter((_, j) => j !== i))}
              aria-label="Remover material"
              className="rounded-lg border border-borda px-3 text-tinta-3 transition-colors hover:border-tomate hover:text-tomate"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          aoMudar([...materiais, { item: "", quantidade: "", substituto: "" }])
        }
        className="mt-3 rounded-full border border-borda px-5 py-2 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta"
      >
        + material
      </button>
    </div>
  );
}

function ListaPassos({
  passos,
  aoMudar,
}: {
  passos: Passo[];
  aoMudar: (p: Passo[]) => void;
}) {
  const trocar = (i: number, campo: keyof Passo, valor: string | null) => {
    const novos = [...passos];
    novos[i] = { ...novos[i], [campo]: valor };
    aoMudar(novos);
  };

  return (
    <div>
      <Rotulo htmlFor="passos">Passo a passo</Rotulo>
      <div id="passos" className="flex flex-col gap-5">
        {passos.map((p, i) => (
          <div key={i} className="flex gap-4 border-l-2 border-borda pl-4">
            <span className="mt-3 shrink-0 font-titulo text-2xl font-bold text-verde">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <AreaTexto
                value={p.texto}
                onChange={(e) => trocar(i, "texto", e.target.value)}
                placeholder="Coloque um dedo de água dentro da lata."
                aria-label={`Passo ${i + 1}`}
              />
              <div className="mt-3">
                <EnviarArquivo
                  balde="imagens"
                  rotulo="Foto deste passo (opcional)"
                  valor={p.imagem_url ?? null}
                  aoMudar={(url) => trocar(i, "imagem_url", url)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => aoMudar(passos.filter((_, j) => j !== i))}
              aria-label="Remover passo"
              className="mt-3 h-9 shrink-0 rounded-lg border border-borda px-3 text-tinta-3 transition-colors hover:border-tomate hover:text-tomate"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => aoMudar([...passos, { texto: "", imagem_url: null }])}
        className="mt-3 rounded-full border border-borda px-5 py-2 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta"
      >
        + passo
      </button>
    </div>
  );
}
