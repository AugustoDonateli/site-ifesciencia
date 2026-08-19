"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Dá peso e inércia à rolagem. É a sensação de "esse site é caro"
 * que a pessoa não sabe de onde vem.
 *
 * No celular fica desligado de propósito: o toque do sistema já tem
 * inércia própria e mexer nisso deixa a rolagem estranha — ainda mais
 * dentro do navegador do Instagram.
 */
export function RolagemSuave() {
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    if (reduzido) return;

    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      // toque continua nativo
      syncTouch: false,
    });

    let id = 0;
    const quadro = (tempo: number) => {
      lenis.raf(tempo);
      id = requestAnimationFrame(quadro);
    };
    id = requestAnimationFrame(quadro);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, [reduzido]);

  return null;
}
