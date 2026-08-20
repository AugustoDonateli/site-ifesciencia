"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

const TAMANHO = 92;

/**
 * A bola do efeito Magnus atravessando a seção do alcance.
 *
 * Sem vídeo: o efeito Magnus É a trajetória curva, e trajetória é o que
 * código faz bem e de graça. A IA só precisou entregar a bola.
 *
 * A curva não é decorativa. Bola com efeito não desce em linha reta — ela
 * segue quase plana no começo e mergulha no fim. É essa queda tardia que
 * denuncia o efeito, e é ela que a conta abaixo desenha.
 *
 * E ela não passa por cima dos números impunemente: cada número que ela
 * raspa leva um tranco. Sem isso a bola seria adesivo deslizando por cima
 * da página, que foi justamente o erro do primeiro objeto.
 */
export function BolaMagnus() {
  const ref = useRef<HTMLDivElement>(null);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const palco = ref.current;
    const bola = palco?.firstElementChild as HTMLElement | null;
    const secao = palco?.closest("section");
    if (!palco || !bola || !secao) return;

    const numeros = [
      ...secao.querySelectorAll<HTMLElement>("[data-numero]"),
    ];
    let agendado = false;

    const posicionar = () => {
      const s = secao.getBoundingClientRect();
      const total = s.height + window.innerHeight;
      const p = Math.min(
        Math.max((window.innerHeight - s.top) / total, 0),
        1,
      );

      if (reduzido) {
        bola.style.opacity = "0";
        numeros.forEach((n) => (n.style.transform = ""));
        return;
      }

      bola.style.opacity = "1";

      // Atravessa de fora a fora: entra por um lado e sai pelo outro.
      const x = (-0.14 + 1.28 * p) * s.width;
      // Quase plana no começo, mergulho no fim. É o efeito.
      const y = (0.26 + 0.52 * Math.pow(p, 2.2)) * s.height;

      bola.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${
        p * 900
      }deg)`;

      // Quem ela raspa, sente.
      numeros.forEach((n) => {
        const r = n.getBoundingClientRect();
        const nx = r.left - s.left + r.width / 2;
        const ny = r.top - s.top + r.height / 2;
        const dist = Math.hypot(x - nx, y - ny);
        const tranco = Math.max(0, 1 - dist / 150);
        n.style.transform = tranco
          ? `translateY(${tranco * 8}px) rotate(${tranco * 1.2}deg)`
          : "";
      });
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        posicionar();
      });
    };

    posicionar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      numeros.forEach((n) => (n.style.transform = ""));
    };
  }, [reduzido]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      <div
        className="absolute left-0 top-0 opacity-0 will-change-transform"
        style={{ width: TAMANHO, height: TAMANHO }}
      >
        {/* Se a imagem não estiver lá, a bola some em vez de virar um ícone
            de imagem quebrada no meio da seção. */}
        <Image
          src="/objetos/bola.webp"
          alt=""
          width={TAMANHO * 2}
          height={TAMANHO * 2}
          onError={(e) => {
            const alvo = e.currentTarget.parentElement;
            if (alvo) alvo.style.display = "none";
          }}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
