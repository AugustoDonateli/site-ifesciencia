"use client";

import { useEffect, useRef, useState } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Máquina de escrever: digita uma variante, pausa, apaga e passa pra próxima.
 *
 * Os detalhes que separam "efeito de máquina de escrever" de máquina de
 * escrever de verdade:
 *
 * - Cada tecla tem um atraso levemente diferente. Ritmo perfeitamente
 *   regular é o que entrega que é robô.
 * - Apagar é mais rápido que digitar, como na vida real.
 * - O cursor só pisca quando está parado. Enquanto digita, ele fica aceso.
 * - O prefixo nunca some, então a linha nunca muda de altura e a página
 *   não pula.
 * - Para de trabalhar quando a aba está em segundo plano.
 */
export function TextoQueDigita({
  prefixo,
  variantes,
  className = "",
}: {
  prefixo: string;
  variantes: string[];
  className?: string;
}) {
  const [visivel, setVisivel] = useState(variantes[0]);
  const [ocupado, setOcupado] = useState(false);
  const reduzido = usarMovimentoReduzido();
  const tempo = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduzido) {
      setVisivel(variantes[0]);
      setOcupado(false);
      return;
    }

    let cancelado = false;
    let indice = 0;
    let letras = variantes[0].length;
    let apagando = true;

    const agendar = (ms: number) => {
      tempo.current = setTimeout(() => {
        if (cancelado) return;
        if (document.hidden) {
          agendar(400); // aba escondida: espera sem gastar nada
          return;
        }
        passo();
      }, ms);
    };

    const passo = () => {
      const alvo = variantes[indice];

      if (apagando) {
        letras -= 1;
        setVisivel(alvo.slice(0, letras));
        setOcupado(true);

        if (letras <= 0) {
          apagando = false;
          indice = (indice + 1) % variantes.length;
          setOcupado(false);
          agendar(320);
          return;
        }
        agendar(26 + Math.random() * 16);
        return;
      }

      letras += 1;
      setVisivel(alvo.slice(0, letras));
      setOcupado(true);

      if (letras >= alvo.length) {
        apagando = true;
        setOcupado(false);
        agendar(1900); // deixa a frase respirar antes de apagar
        return;
      }
      agendar(48 + Math.random() * 46);
    };

    agendar(1400); // deixa a cascata do título terminar primeiro

    return () => {
      cancelado = true;
      if (tempo.current) clearTimeout(tempo.current);
    };
  }, [reduzido, variantes]);

  return (
    <p className={className}>
      {/* Leitor de tela ouve uma frase inteira e parada. */}
      <span className="sr-only">
        {prefixo} {variantes[0]}
      </span>

      <span aria-hidden="true">
        {prefixo}{" "}
        <span className="whitespace-pre">{visivel}</span>
        <span
          className={`cursor-digitando ${ocupado ? "aceso" : ""}`}
          aria-hidden="true"
        />
      </span>
    </p>
  );
}
