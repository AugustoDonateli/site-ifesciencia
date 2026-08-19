"use client";

import Link from "next/link";
import { useRef } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * O botão puxa o cursor de leve quando ele chega perto.
 * Só no computador — no celular não existe cursor, então nada acontece
 * e o botão é um botão normal.
 */
export function BotaoMagnetico({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduzido = usarMovimentoReduzido();

  const aoMover = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || reduzido) return;

    // Toque não tem cursor pra perseguir.
    if (!window.matchMedia("(hover: hover)").matches) return;

    const caixa = el.getBoundingClientRect();
    const x = e.clientX - (caixa.left + caixa.width / 2);
    const y = e.clientY - (caixa.top + caixa.height / 2);

    el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
  };

  const aoSair = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={aoMover}
      onMouseLeave={aoSair}
      className={`inline-block will-change-transform transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </Link>
  );
}
