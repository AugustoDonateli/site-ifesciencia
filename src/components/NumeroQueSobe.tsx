"use client";

import { useEffect, useRef, useState } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * O número conta até o valor final quando entra na tela. Uma vez só.
 *
 * O sufixo fica separado ("500" + " mil") pra contagem não tentar
 * animar a palavra. Números sem contagem — tipo o ano — passam
 * `animar={false}` e aparecem direto.
 */
export function NumeroQueSobe({
  valor,
  sufixo = "",
  decimais = 0,
  animar = true,
  className = "",
}: {
  valor: number;
  sufixo?: string;
  decimais?: number;
  animar?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [atual, setAtual] = useState(animar ? 0 : valor);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    if (!animar || reduzido) {
      setAtual(valor);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();

        const duracao = 1400;
        const inicio = performance.now();

        const passo = (agora: number) => {
          const p = Math.min((agora - inicio) / duracao, 1);
          // desacelera no fim, como coisa pesada parando
          const suave = 1 - Math.pow(1 - p, 3);
          const f = Math.pow(10, decimais);
          setAtual(Math.round(valor * suave * f) / f);
          if (p < 1) requestAnimationFrame(passo);
        };

        requestAnimationFrame(passo);
      },
      { threshold: 0.4 },
    );

    observador.observe(el);
    return () => observador.disconnect();
  }, [valor, animar, reduzido, decimais]);

  return (
    <p ref={ref} className={className}>
      {atual.toLocaleString("pt-BR", {
        minimumFractionDigits: decimais,
        maximumFractionDigits: decimais,
      })}
      {sufixo}
    </p>
  );
}
