"use client";

import { useEffect, useRef } from "react";

const base =
  "w-full rounded-lg border border-borda bg-creme px-4 py-3 outline-none transition-colors focus:border-verde";

export function Rotulo({
  htmlFor,
  children,
  dica,
  obrigatorio,
}: {
  htmlFor: string;
  children: React.ReactNode;
  dica?: string;
  obrigatorio?: boolean;
}) {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {children}
        {/* Marcar o obrigatório campo a campo: dentro do bloco "Obrigatórios"
            nem tudo é, e sem marca ninguém sabe o que pode deixar em branco. */}
        {obrigatorio ? (
          <span className="ml-1 text-tomate" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-tinta-3">
            opcional
          </span>
        )}
      </label>
      {dica ? <p className="mt-0.5 text-xs text-tinta-3">{dica}</p> : null}
    </div>
  );
}

export function Texto(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={base} />;
}

export function Selecao(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={base} />;
}

/** Campo com "R$" fixo à esquerda: número solto se digita errado com facilidade. */
export function Dinheiro(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border border-borda bg-creme focus-within:border-verde">
      <span className="flex items-center bg-creme-2 px-3 font-mono text-sm text-tinta-2">
        R$
      </span>
      <input
        {...props}
        className="w-full bg-transparent px-4 py-3 outline-none"
      />
    </div>
  );
}

/**
 * Cresce conforme se digita.
 * Caixa alta e fixa para uma frase de uma linha faz o formulário parecer o
 * dobro do tamanho e assusta quem vai preencher vinte experimentos.
 */
export function AreaTexto({
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      {...props}
      ref={ref}
      value={value}
      rows={2}
      className={`${base} resize-none overflow-hidden`}
    />
  );
}

export function Bloco({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-borda pt-8">
      <h2 className="text-xl font-bold">{titulo}</h2>
      {descricao ? (
        <p className="mt-1 text-sm text-tinta-2">{descricao}</p>
      ) : null}
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}

/** Sobe e desce um item de lista. Sem isto, esquecer um passo no meio obriga a reescrever tudo. */
export function Reordenar({
  aoSubir,
  aoDescer,
  primeiro,
  ultimo,
  rotulo,
}: {
  aoSubir: () => void;
  aoDescer: () => void;
  primeiro: boolean;
  ultimo: boolean;
  rotulo: string;
}) {
  return (
    <div className="flex shrink-0 flex-col text-[10px]">
      <button
        type="button"
        onClick={aoSubir}
        disabled={primeiro}
        aria-label={`Subir ${rotulo}`}
        className="px-1.5 py-0.5 text-tinta-2 transition-colors hover:text-verde disabled:opacity-20"
      >
        ▲
      </button>
      <button
        type="button"
        onClick={aoDescer}
        disabled={ultimo}
        aria-label={`Descer ${rotulo}`}
        className="px-1.5 py-0.5 text-tinta-2 transition-colors hover:text-verde disabled:opacity-20"
      >
        ▼
      </button>
    </div>
  );
}
