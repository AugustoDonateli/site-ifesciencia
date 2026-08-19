"use client";

import { useEffect, useRef } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * O título entra palavra por palavra quando a página carrega — uma vez só.
 *
 * Regra importante: o texto nasce VISÍVEL. A animação é que esconde e revela.
 * Se o JavaScript não rodar (falha, aba em segundo plano, navegador estranho),
 * o pior caso é o título aparecer sem graça — nunca sumir.
 *
 * A marcação é montada aqui em vez de vir pronta pra frase continuar sendo
 * uma frase só para leitor de tela e para busca.
 */
export function TituloCascata({
  texto,
  destaque,
  className = "",
}: {
  texto: string;
  destaque?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduzido) return;

    const palavras = el.querySelectorAll<HTMLElement>("[data-palavra]");
    const animacoes: Animation[] = [];

    palavras.forEach((palavra, i) => {
      palavra.getAnimations().forEach((a) => a.cancel());

      animacoes.push(
        palavra.animate(
          [
            { opacity: 0, transform: "translateY(0.45em)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 620,
            delay: 90 + i * 70,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            // "both" faz o estado inicial valer durante o atraso também.
            fill: "both",
          },
        ),
      );
    });

    return () => animacoes.forEach((a) => a.cancel());
  }, [reduzido, texto]);

  const palavras = texto.split(" ");

  return (
    <h1 ref={ref} className={className}>
      {palavras.map((palavra, i) => (
        <span
          key={`${palavra}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <span
            data-palavra
            className={`inline-block ${palavra === destaque ? "destaque" : ""}`}
          >
            {palavra}
          </span>
          {i < palavras.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}
