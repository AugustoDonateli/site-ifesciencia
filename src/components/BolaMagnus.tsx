"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/** Tamanho da bola quando está mais perto. Ela encolhe daí pra frente. */
const TAMANHO = 130;
const MENOR = 0.18;

/**
 * A curva, em frações da seção.
 *
 * São três pontos de uma bezier: onde entra, para onde a trajetória é puxada,
 * e onde sai. O ponto do meio fica bem acima da reta entre os outros dois, e
 * é ele que produz o arco.
 *
 * A primeira versão desta bola falhou porque a curva era rasa: 200px de desvio
 * ao longo de 1600px de travessia lê como linha reta. Aqui o desvio no meio do
 * caminho passa de um quarto da altura da seção.
 */
const P0 = { x: -0.06, y: 0.8 };
const P1 = { x: 0.42, y: 0.06 };
const P2 = { x: 1.06, y: 0.46 };

const bezier = (t: number, a: number, b: number, c: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

/**
 * A bola do efeito Magnus atravessando a seção do alcance.
 *
 * O lugar não é aleatório: a seção se chama Alcance e fala de 500 mil pessoas
 * e 13 milhões de visualizações. Uma bola chutada que viaja longe, curvando e
 * sumindo na distância, é literalmente alcance — a mesma lógica que colocou o
 * copo na seção "Todo experimento, aberto".
 *
 * Sem vídeo, e não por economia: o modelo foi testado e faz a bola ir RETA
 * para o fundo. Medido quadro a quadro, o x dela fica cravado durante 80% do
 * clipe e só desvia quando ela já é um ponto. Curva é o que código faz bem, e
 * aqui ela é controlada ponto a ponto.
 *
 * E ela não passa impune: cada número que ela raspa leva um tranco, com força
 * proporcional a quão perto e quão GRANDE ela está naquele instante. Bola
 * distante quase não empurra, que é como seria de verdade.
 */
export function BolaMagnus() {
  const ref = useRef<HTMLDivElement>(null);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const palco = ref.current;
    const bola = palco?.firstElementChild as HTMLElement | null;
    const secao = palco?.closest("section");
    if (!palco || !bola || !secao) return;

    const numeros = [...secao.querySelectorAll<HTMLElement>("[data-numero]")];
    let agendado = false;

    const posicionar = () => {
      const s = secao.getBoundingClientRect();
      const total = s.height + window.innerHeight;
      const t = Math.min(Math.max((window.innerHeight - s.top) / total, 0), 1);

      if (reduzido) {
        bola.style.opacity = "0";
        numeros.forEach((n) => (n.style.transform = ""));
        return;
      }

      const x = bezier(t, P0.x, P1.x, P2.x) * s.width;
      const y = bezier(t, P0.y, P1.y, P2.y) * s.height;
      // Encolhe rápido no começo e devagar no fim, como perspectiva de verdade.
      const escala = 1 - (1 - MENOR) * Math.pow(t, 0.6);

      bola.style.opacity = "1";
      bola.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${
        t * 1080
      }deg) scale(${escala})`;

      const alcance = 150 * escala + 40;
      numeros.forEach((n) => {
        const r = n.getBoundingClientRect();
        const dist = Math.hypot(
          x - (r.left - s.left + r.width / 2),
          y - (r.top - s.top + r.height / 2),
        );
        const tranco = Math.max(0, 1 - dist / alcance) * escala;
        n.style.transform = tranco
          ? `translateY(${tranco * 10}px) rotate(${tranco * 1.4}deg)`
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
        {/* Sai já no tamanho e formato de entrega, então não passa pelo
            otimizador. E carrega junto com a página: objeto de scroll não
            pode aparecer atrasado. */}
        <Image
          src="/objetos/bola.webp"
          alt=""
          width={280}
          height={280}
          unoptimized
          loading="eager"
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
