"use client";

import { useEffect, useRef, useState } from "react";
import { Marcador } from "./Marcador";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Fica fixa no código, só foto + nome (D11).
 * Sobrenomes a confirmar com o Augusto.
 */
const equipe = [
  { nome: "Hilton Moulin", papel: "Coordenação" },
  { nome: "Augusto Donateli", papel: "Equipe" },
  { nome: "Laura Fabris Scarpe", papel: "Equipe" },
  { nome: "Pedro", papel: "Equipe" },
  { nome: "Lucas Grifo da Costa", papel: "Monitoria" },
];

function Cartao({ nome, papel }: { nome: string; papel: string }) {
  return (
    <div className="w-[68vw] max-w-[300px] shrink-0 snap-center md:w-[320px] md:max-w-none">
      <Marcador proporcao="3/4" rotulo="foto" />
      <p className="mt-4 text-lg font-medium">{nome}</p>
      <p className="font-mono text-xs text-tinta-3">{papel}</p>
    </div>
  );
}

function Cabecalho() {
  return (
    <div className="mb-10 max-w-xl">
      <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
        A equipe
      </p>
      <h2 className="text-4xl font-bold sm:text-5xl">Quem faz o Ifesciência</h2>
      <p className="mt-6 text-tinta-2">
        Cinco pessoas cuidam de tudo: escolher o experimento, montar, gravar,
        editar e explicar. Desde 2022, duas gerações de estudantes já passaram
        pelo projeto.
      </p>
    </div>
  );
}

export function Equipe() {
  const secaoRef = useRef<HTMLDivElement>(null);
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState<number | undefined>(undefined);
  const reduzido = usarMovimentoReduzido();

  /**
   * No computador a página prende e a fileira anda de lado.
   *
   * A conta: a seção fica alta o suficiente pra que a distância vertical
   * percorrida enquanto ela está grudada seja exatamente a distância
   * horizontal que a fileira precisa andar. Assim o movimento acompanha
   * o scroll na proporção certa, sem sobrar nem faltar.
   *
   * No celular nada disso roda: lá a fileira é uma rolagem lateral nativa,
   * que já vem com a inércia do próprio sistema e é muito mais confiável
   * dentro do navegador do Instagram do que qualquer arrasto que eu escreva.
   */
  useEffect(() => {
    const secao = secaoRef.current;
    const trilho = trilhoRef.current;
    if (!secao || !trilho) return;

    const grande = window.matchMedia("(min-width: 768px)");
    let distancia = 0;
    let agendado = false;

    const medir = () => {
      if (!grande.matches || reduzido) {
        distancia = 0;
        setAltura(undefined);
        trilho.style.transform = "";
        return;
      }
      distancia = Math.max(trilho.scrollWidth - window.innerWidth + 96, 0);
      setAltura(window.innerHeight + distancia);
      posicionar();
    };

    const posicionar = () => {
      if (distancia <= 0) return;
      const total = secao.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const passado = Math.min(Math.max(-secao.getBoundingClientRect().top, 0), total);
      const progresso = passado / total;
      trilho.style.transform = `translate3d(${-progresso * distancia}px, 0, 0)`;
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
    window.addEventListener("resize", medir);
    grande.addEventListener("change", medir);
    document.fonts?.ready.then(medir);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", medir);
      grande.removeEventListener("change", medir);
    };
  }, [reduzido]);

  return (
    <>
      {/* Celular: rolagem lateral nativa, com a inércia do próprio sistema. */}
      <section className="md:hidden">
        <div className="mx-auto w-full max-w-6xl px-6 pt-20">
          <Cabecalho />
        </div>
        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {equipe.map((p) => (
            <Cartao key={p.nome} {...p} />
          ))}
          <div className="w-1 shrink-0" aria-hidden="true" />
        </div>
      </section>

      {/* Computador: a página prende e a fileira passa de lado. */}
      <section ref={secaoRef} className="relative hidden md:block" style={{ height: altura }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-6">
            <Cabecalho />
          </div>
          <div ref={trilhoRef} className="flex gap-8 px-6 will-change-transform xl:px-[max(1.5rem,calc((100vw-72rem)/2))]">
            {equipe.map((p) => (
              <Cartao key={p.nome} {...p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
