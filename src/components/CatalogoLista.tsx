"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CartaoExperimento, type ItemCatalogo } from "./CartaoExperimento";
import { NOME_AREA } from "@/lib/tipos";
import type { Area, Nivel } from "@/lib/tipos";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

const AREAS: Area[] = ["fisica", "quimica", "biologia"];

/** No filtro só existem os dois níveis reais de quem dá aula. Ver `serve`. */
const NIVEIS: { valor: Exclude<Nivel, "ambos">; rotulo: string }[] = [
  { valor: "fundamental", rotulo: "Fundamental" },
  { valor: "medio", rotulo: "Médio" },
];

export type Filtros = {
  area: Area | null;
  nivel: Exclude<Nivel, "ambos"> | null;
  soCasa: boolean;
};

/**
 * "Ambos" não é um terceiro nível, é um experimento que serve aos dois.
 *
 * Virar botão próprio seria expor ao professor uma distinção que é do cadastro,
 * não da aula dele: ninguém dá aula para "ambos". Quem filtra por Fundamental
 * tem que ver também o que serve aos dois, senão o acervo encolhe à toa.
 */
function serve(item: ItemCatalogo, nivel: Filtros["nivel"]) {
  if (!nivel) return true;
  return item.nivel === nivel || item.nivel === "ambos";
}

function filtrar(lista: ItemCatalogo[], f: Filtros) {
  return lista.filter(
    (e) =>
      (!f.area || e.area === f.area) &&
      serve(e, f.nivel) &&
      (!f.soCasa || e.pode_fazer_em_casa === true),
  );
}

/**
 * Com pouca coisa no acervo, filtrar no navegador é melhor que ir ao banco:
 * a troca é instantânea, sem tela de carregando e sem piscar.
 *
 * Os filtros escolhidos vão para o endereço, então dá pra mandar "só os de
 * química que dão pra fazer em casa" no WhatsApp. Uso history.replaceState em
 * vez do roteador pra não recarregar nada nem empilhar histórico — trocar de
 * filtro cinco vezes não deveria exigir cinco toques no botão voltar.
 */
export function CatalogoLista({
  experimentos,
  filtrosIniciais,
}: {
  experimentos: ItemCatalogo[];
  filtrosIniciais: Filtros;
}) {
  const [f, setF] = useState<Filtros>(filtrosIniciais);
  const gradeRef = useRef<HTMLDivElement>(null);
  const reduzido = usarMovimentoReduzido();

  const lista = useMemo(() => filtrar(experimentos, f), [experimentos, f]);

  /**
   * Cada número conta o resultado de clicar NAQUELE botão, com o resto dos
   * filtros como está — e não quantos existem no acervo inteiro.
   *
   * A diferença aparece na hora errada: com Química ativa, um "Fundamental 12"
   * contado no acervo todo convida pra um clique que devolve lista vazia. O
   * número tem que ser uma promessa do que vem, não uma estatística.
   */
  const contar = (mudanca: Partial<Filtros>) =>
    filtrar(experimentos, { ...f, ...mudanca }).length;

  useEffect(() => {
    const url = new URL(window.location.href);
    const p = url.searchParams;
    f.area ? p.set("area", f.area) : p.delete("area");
    f.nivel ? p.set("nivel", f.nivel) : p.delete("nivel");
    f.soCasa ? p.set("casa", "1") : p.delete("casa");
    window.history.replaceState(null, "", url);
  }, [f]);

  // Entrada em cascata: os cartões aparecem um atrás do outro, não todos
  // de uma vez. Roda de novo a cada troca de filtro.
  useEffect(() => {
    if (reduzido) return;
    const cartoes = gradeRef.current?.children;
    if (!cartoes) return;

    const animacoes = [...cartoes].map((cartao, i) =>
      cartao.animate(
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 480,
          delay: i * 55,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "both",
        },
      ),
    );

    return () => animacoes.forEach((a) => a.cancel());
  }, [lista, reduzido]);

  /**
   * A grade se adapta à quantidade. Três colunas com dois experimentos deixa
   * um vazio enorme à direita e a página parece quebrada — então com poucos
   * itens os cartões crescem e ocupam a largura.
   */
  const colunas =
    lista.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  const filtrando = Boolean(f.area || f.nivel || f.soCasa);

  const Pilula = ({
    ativo,
    quantos,
    aoTocar,
    children,
    forte = false,
  }: {
    ativo: boolean;
    quantos: number;
    aoTocar: () => void;
    children: React.ReactNode;
    forte?: boolean;
  }) => {
    // Botão que leva a lista vazia não vira botão clicável. Ver `contar`.
    const vazio = quantos === 0 && !ativo;
    return (
      <button
        type="button"
        onClick={() => !vazio && aoTocar()}
        disabled={vazio}
        aria-pressed={ativo}
        className={`rounded-full border transition-colors ${
          forte ? "px-5 py-2 text-sm" : "px-4 py-1.5 text-[13px]"
        } ${
          ativo
            ? "border-verde bg-verde text-white"
            : vazio
              ? "cursor-not-allowed border-borda text-tinta-3 opacity-50"
              : "border-borda text-tinta-2 hover:border-tinta-3 hover:text-tinta"
        }`}
      >
        {children}
        <span
          className={`ml-2 font-mono text-xs ${
            ativo ? "text-white/70" : "text-tinta-3"
          }`}
        >
          {quantos}
        </span>
      </button>
    );
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Pilula
          forte
          ativo={!f.area}
          quantos={contar({ area: null })}
          aoTocar={() => setF({ ...f, area: null })}
        >
          Todas as áreas
        </Pilula>
        {AREAS.map((a) => (
          <Pilula
            key={a}
            forte
            ativo={f.area === a}
            quantos={contar({ area: a })}
            aoTocar={() => setF({ ...f, area: f.area === a ? null : a })}
          >
            {NOME_AREA[a]}
          </Pilula>
        ))}
      </div>

      {/* Segunda faixa, mais leve de propósito: área é a divisão principal do
          acervo, nível e "em casa" são recortes de quem vai dar a aula. */}
      <div className="mb-10 flex flex-wrap items-center gap-2">
        {NIVEIS.map((n) => (
          <Pilula
            key={n.valor}
            ativo={f.nivel === n.valor}
            quantos={contar({ nivel: n.valor })}
            aoTocar={() =>
              setF({ ...f, nivel: f.nivel === n.valor ? null : n.valor })
            }
          >
            {n.rotulo}
          </Pilula>
        ))}

        {/* O recorte que responde "não tenho laboratório", que é a objeção que
            mais impede uma professora de tentar. */}
        <Pilula
          ativo={f.soCasa}
          quantos={contar({ soCasa: true })}
          aoTocar={() => setF({ ...f, soCasa: !f.soCasa })}
        >
          Dá para fazer em casa
        </Pilula>

        {filtrando ? (
          <button
            type="button"
            onClick={() => setF({ area: null, nivel: null, soCasa: false })}
            className="ml-1 py-1.5 text-[13px] text-tinta-3 underline underline-offset-4 transition-colors hover:text-tinta"
          >
            limpar
          </button>
        ) : null}
      </div>

      {lista.length === 0 ? (
        <div className="border-t border-borda pt-8">
          <p className="text-tinta-2">
            Nenhum experimento com esses filtros ainda.
          </p>
          <button
            type="button"
            onClick={() => setF({ area: null, nivel: null, soCasa: false })}
            className="mt-3 text-sm text-verde underline underline-offset-4"
          >
            Ver todos os experimentos
          </button>
        </div>
      ) : (
        <div ref={gradeRef} className={`grid gap-6 ${colunas} lg:gap-8`}>
          {lista.map((item) => (
            <CartaoExperimento key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
