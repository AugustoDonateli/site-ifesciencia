"use client";

import { useEffect, useState } from "react";

/**
 * Quem desligou animações no sistema não recebe animação nenhuma.
 * A análise dos sites premiados de 2026 cita a falta disso como "marca de amador"
 * — e é acessibilidade básica.
 */
export function usarMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduzido(consulta.matches);

    const aoMudar = (e: MediaQueryListEvent) => setReduzido(e.matches);
    consulta.addEventListener("change", aoMudar);
    return () => consulta.removeEventListener("change", aoMudar);
  }, []);

  return reduzido;
}
