"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

const QUADROS = 13;
const LARGURA = 150;
const ALTURA = Math.round((LARGURA * 460) / 280);

/**
 * O copo apoiado no título, que cai e se parte ao meio.
 *
 * A divisão de trabalho: a IA fez o que só ela faz — a quebra em duas metades
 * com o interior oco à mostra, em três dimensões. O código faz a queda, que é
 * exatamente o que código faz bem e de graça.
 *
 * As posições de partida e de chegada são MEDIDAS do título e do botão, não
 * escritas à mão: assim o copo encosta neles de verdade em qualquer tela, em
 * vez de parecer colado por cima do site.
 */
export function CopoQueCai({
  tituloRef,
  botaoRef,
}: {
  tituloRef: React.RefObject<HTMLElement | null>;
  botaoRef: React.RefObject<HTMLElement | null>;
}) {
  const secaoRef = useRef<HTMLDivElement>(null);
  const copoRef = useRef<HTMLDivElement>(null);
  const [quadro, setQuadro] = useState(0);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const copo = copoRef.current;
    const secao = secaoRef.current?.parentElement;
    const titulo = tituloRef.current;
    const botao = botaoRef.current;
    if (!copo || !secao || !titulo || !botao) return;

    let inicioY = 0;
    let fimY = 0;
    let agendado = false;

    const medir = () => {
      const s = secao.getBoundingClientRect();
      // Apoiado sobre o título: a base do copo encosta no topo do texto.
      inicioY = titulo.getBoundingClientRect().top - s.top - ALTURA + 12;
      // Cai até pousar em cima do botão.
      fimY = botao.getBoundingClientRect().top - s.top - ALTURA + 16;
      posicionar();
    };

    const posicionar = () => {
      const s = secao.getBoundingClientRect();
      const total = s.height + window.innerHeight;
      const p = Math.min(Math.max((window.innerHeight - s.top) / total, 0), 1);

      if (reduzido) {
        copo.style.transform = `translate(-50%, ${fimY}px)`;
        setQuadro(QUADROS - 1);
        return;
      }

      // Três tempos: balança, cai, parte.
      const APOIADO = 0.42;
      const POUSA = 0.62;

      if (p < APOIADO) {
        // Balanço curto e nervoso, como copo mal equilibrado numa borda.
        const balanco = Math.sin(p * 40) * 2.2;
        copo.style.transform = `translate(-50%, ${inicioY}px) rotate(${balanco}deg)`;
        setQuadro(0);
        return;
      }

      if (p < POUSA) {
        const q = (p - APOIADO) / (POUSA - APOIADO);
        // Acelera como coisa caindo, em vez de descer em velocidade constante.
        const caida = q * q;
        const y = inicioY + (fimY - inicioY) * caida;
        copo.style.transform = `translate(-50%, ${y}px) rotate(${(1 - caida) * 3}deg)`;
        setQuadro(0);
        return;
      }

      const q = (p - POUSA) / (1 - POUSA);
      copo.style.transform = `translate(-50%, ${fimY}px)`;
      setQuadro(Math.min(Math.floor(q * QUADROS), QUADROS - 1));
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        posicionar();
      });
    };

    medir();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", () => requestAnimationFrame(medir));
    document.fonts?.ready.then(medir);

    return () => {
      window.removeEventListener("scroll", aoRolar);
    };
  }, [reduzido, tituloRef, botaoRef]);

  return (
    <div ref={secaoRef} className="pointer-events-none absolute inset-0 z-20">
      <div
        ref={copoRef}
        className="absolute left-1/2 top-0 will-change-transform"
        style={{ width: LARGURA, height: ALTURA }}
      >
        {/* Todos os quadros ficam montados e só um aparece: trocar o endereço
            da imagem faria o navegador buscar o arquivo no meio da rolagem,
            e a animação engasgaria no primeiro giro. */}
        {Array.from({ length: QUADROS }, (_, i) => (
          <Image
            key={i}
            src={`/objetos/copo-${String(i).padStart(2, "0")}.webp`}
            alt=""
            width={280}
            height={460}
            priority={i === 0}
            className="absolute inset-0 h-full w-full object-contain"
            style={{ opacity: i === quadro ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}
