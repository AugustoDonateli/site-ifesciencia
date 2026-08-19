"use client";

import { Fragment, useEffect, useRef } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * O título entra palavra por palavra quando a página carrega — uma vez só.
 *
 * Duas regras que essa peça tem que respeitar:
 *
 * 1. O texto nasce VISÍVEL. A animação é que esconde e revela. Se o JavaScript
 *    não rodar, o pior caso é o título aparecer sem graça — nunca sumir.
 *
 * 2. O espaço entre as palavras é um nó de texto de verdade, FORA dos blocos.
 *    Espaço no fim de um inline-block é descartado pelo navegador, e o título
 *    saiacoladoassim. Também importa pra quem copia o texto ou usa leitor de tela.
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
        <Fragment key={`${palavra}-${i}`}>
          <span
            data-palavra
            className={`inline-block ${palavra === destaque ? "destaque" : ""}`}
          >
            {palavra}
          </span>
          {i < palavras.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}
