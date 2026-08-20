"use client";

/** Peças de formulário. Ficam aqui pra a tela de cadastro não virar um muro. */

export function Rotulo({
  htmlFor,
  children,
  dica,
}: {
  htmlFor: string;
  children: React.ReactNode;
  dica?: string;
}) {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {children}
      </label>
      {dica ? <p className="mt-0.5 text-xs text-tinta-3">{dica}</p> : null}
    </div>
  );
}

const base =
  "w-full rounded-lg border border-borda bg-creme px-4 py-3 outline-none transition-colors focus:border-verde";

export function Texto(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={base} />;
}

export function AreaTexto(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return <textarea {...props} className={`${base} min-h-32 resize-y`} />;
}

export function Selecao(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={base} />;
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
