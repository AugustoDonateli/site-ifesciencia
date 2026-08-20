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

  const Botao = ({
    valor,
    rotulo,
  }: {
    valor: Area | null;
    rotulo: string;
  }) => {
    const ativo = area === valor;
    return (
      <button
        type="button"
        onClick={() => setArea(valor)}
        aria-pressed={ativo}
        className={`rounded-full border px-5 py-2 text-sm transition-colors ${
          ativo
            ? "border-verde bg-verde text-white"
            : "border-borda text-tinta-2 hover:border-tinta-3 hover:text-tinta"
        }`}
      >
        {rotulo}
      </button>
    );
  };

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-2">
        <Botao valor={null} rotulo="Todos" />
        {AREAS.map((a) => (
          <Botao key={a} valor={a} rotulo={NOME_AREA[a]} />
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="border-t border-borda pt-8 text-tinta-2">
          Nenhum experimento de {area ? NOME_AREA[area].toLowerCase() : "essa área"}{" "}
          publicado ainda. Em breve.
        </p>
      ) : (
        <div
          ref={gradeRef}
          className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {lista.map((item) => (
            <CartaoExperimento key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
