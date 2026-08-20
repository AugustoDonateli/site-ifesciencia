"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CartaoExperimento, type ItemCatalogo } from "./CartaoExperimento";
import { NOME_AREA } from "@/lib/tipos";
import type { Area } from "@/lib/tipos";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

const AREAS: Area[] = ["fisica", "quimica", "biologia"];

/**
 * Com pouca coisa no acervo, filtrar no navegador é melhor que ir ao banco:
 * a troca é instantânea, sem tela de carregando e sem piscar.
 *
 * O filtro escolhido vai para o endereço, então dá pra mandar "só os de
 * química" no WhatsApp. Uso history.replaceState em vez do roteador pra não
 * recarregar nada nem empilhar histórico — trocar de filtro cinco vezes não
 * deveria exigir cinco toques no botão voltar.
 */
export function CatalogoLista({
  experimentos,
  areaInicial,
}: {
  experimentos: ItemCatalogo[];
  areaInicial: Area | null;
}) {
  const [area, setArea] = useState<Area | null>(areaInicial);
  const gradeRef = useRef<HTMLDivElement>(null);
  const reduzido = usarMovimentoReduzido();

  const contagem = useMemo(() => {
    const c: Record<string, number> = {};
    for (const e of experimentos) c[e.area] = (c[e.area] ?? 0) + 1;
    return c;
  }, [experimentos]);

  const lista = useMemo(
    () => (area ? experimentos.filter((e) => e.area === area) : experimentos),
    [area, experimentos],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (area) url.searchParams.set("area", area);
    else url.searchParams.delete("area");
    window.history.replaceState(null, "", url);
  }, [area]);

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
    lista.length <= 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";

  const Botao = ({ valor, rotulo }: { valor: Area | null; rotulo: string }) => {
    const ativo = area === valor;
    const quantos = valor ? (contagem[valor] ?? 0) : experimentos.length;
    // Área sem nada publicado não vira botão clicável que leva a lugar nenhum.
    const vazio = quantos === 0;

    return (
      <button
        type="button"
        onClick={() => !vazio && setArea(valor)}
        disabled={vazio}
        aria-pressed={ativo}
        className={`rounded-full border px-5 py-2 text-sm transition-colors ${
          ativo
            ? "border-verde bg-verde text-white"
            : vazio
              ? "cursor-not-allowed border-borda text-tinta-3 opacity-50"
              : "border-borda text-tinta-2 hover:border-tinta-3 hover:text-tinta"
        }`}
      >
        {rotulo}
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
      <div className="mb-12 flex flex-wrap items-center gap-2">
        <Botao valor={null} rotulo="Todos" />
        {AREAS.map((a) => (
          <Botao key={a} valor={a} rotulo={NOME_AREA[a]} />
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="border-t border-borda pt-8 text-tinta-2">
          Nenhum experimento publicado nessa área ainda. Em breve.
        </p>
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
