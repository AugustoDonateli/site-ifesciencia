"use client";

import { useEffect, useRef } from "react";

/**
 * Responde "falta muito?" sem ocupar espaço nenhum.
 * Funciona igual no celular e no computador — é a parte do índice que
 * cabe nos dois.
 */
export function BarraProgresso() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let agendado = false;

    const atualizar = () => {
      const el = ref.current;
      if (!el) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      el.style.transform = `scaleX(${p})`;
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        atualizar();
      });
    };

    atualizar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
    >
      <div
        ref={ref}
        className="h-full origin-left bg-verde"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
