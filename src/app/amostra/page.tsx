import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amostra — Ifesciência",
  description: "Peças básicas do site: cores, tipografia e componentes.",
};

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-borda pt-8">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
        {titulo}
      </p>
      {children}
    </section>
  );
}

function Cor({
  nome,
  hex,
  escuro = false,
}: {
  nome: string;
  hex: string;
  escuro?: boolean;
}) {
  return (
    <div>
      <div
        className="h-20 rounded-lg border border-borda"
        style={{ background: hex }}
      />
      <p className="mt-2 text-sm">{nome}</p>
      <p className="font-mono text-xs text-tinta-3">{hex}</p>
      {escuro ? null : null}
    </div>
  );
}

export default function Amostra() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <header className="mb-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Etapa 1 · identidade
        </p>
        <h1 className="text-5xl font-bold sm:text-6xl">
          Ciência como você <span className="destaque">nunca</span> viu
        </h1>
        <p className="mt-5 max-w-lg text-lg text-tinta-2">
          Esta página não faz parte do site. É só a bancada de peças, pra você
          aprovar antes da gente construir as seções em cima delas.
        </p>
      </header>

      <div className="flex flex-col gap-14">
        <Secao titulo="Cores">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Cor nome="Creme" hex="#FAF7EF" />
            <Cor nome="Creme fundo" hex="#F3EFE4" />
            <Cor nome="Verde" hex="#2F9E44" />
            <Cor nome="Tomate" hex="#E23D28" />
            <Cor nome="Tinta" hex="#17170F" />
            <Cor nome="Tinta suave" hex="#5C594C" />
            <Cor nome="Âmbar (aviso)" hex="#B45309" />
            <Cor nome="Borda" hex="#E3DECF" />
          </div>
          <p className="mt-5 max-w-xl text-sm text-tinta-2">
            O âmbar existe separado do tomate de propósito. Se aviso de segurança
            e palavra importante tivessem a mesma cor, ninguém enxergaria o aviso.
          </p>
        </Secao>

        <Secao titulo="Tipografia">
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-1 font-mono text-xs text-tinta-3">
                Título · Bricolage Grotesque
              </p>
              <p className="font-titulo text-5xl font-bold leading-none">
                O copo que não esquenta
              </p>
            </div>
            <div>
              <p className="mb-1 font-mono text-xs text-tinta-3">
                Subtítulo · Bricolage Grotesque
              </p>
              <p className="font-titulo text-2xl font-semibold">
                Por que funciona
              </p>
            </div>
            <div>
              <p className="mb-1 font-mono text-xs text-tinta-3">
                Texto · Inter
              </p>
              <p className="max-w-xl text-tinta-2">
                Encha o copo térmico com água quente e encoste a mão do lado de
                fora. Ele continua frio. O segredo está no vácuo entre as duas
                paredes do copo — sem ar, o calor não tem por onde passar.
              </p>
            </div>
          </div>
        </Secao>

        <Secao titulo="Botões">
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full bg-verde px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-verde-escuro">
              Ver experimentos
            </button>
            <button className="rounded-full border border-tinta px-6 py-3 text-sm font-medium transition-colors hover:bg-creme-2">
              Sobre o projeto
            </button>
            <button className="text-sm font-medium text-tomate underline underline-offset-4 transition-colors hover:text-tomate-escuro">
              Baixar o PDF
            </button>
          </div>
        </Secao>

        <Secao titulo="Etiquetas">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-verde-escuro">
              Física
            </span>
            <span className="rounded-full bg-creme-2 px-3 py-1 text-xs font-medium text-tinta-2">
              Ensino médio
            </span>
            <span className="rounded-full bg-creme-2 px-3 py-1 font-mono text-xs text-tinta-2">
              20 min
            </span>
            <span className="rounded-full bg-creme-2 px-3 py-1 font-mono text-xs text-tinta-2">
              até R$ 15
            </span>
            <span className="rounded-full bg-creme-2 px-3 py-1 font-mono text-xs text-tinta-2">
              fácil
            </span>
          </div>
        </Secao>

        <Secao titulo="Card do catálogo">
          <div className="max-w-sm overflow-hidden rounded-xl border border-borda bg-creme-2">
            <div className="flex aspect-video items-center justify-center bg-borda">
              <span className="font-mono text-xs text-tinta-3">
                capa do vídeo
              </span>
            </div>
            <div className="p-5">
              <div className="mb-3 flex gap-2">
                <span className="rounded-full bg-verde-claro px-3 py-1 text-xs font-medium text-verde-escuro">
                  Física
                </span>
                <span className="rounded-full bg-creme px-3 py-1 font-mono text-xs text-tinta-2">
                  20 min
                </span>
              </div>
              <h3 className="text-2xl font-bold">O copo que não esquenta</h3>
              <p className="mt-2 text-sm text-tinta-2">
                Água fervendo dentro, e você segura com a mão. Como?
              </p>
            </div>
          </div>
        </Secao>

        <Secao titulo="Aviso de segurança">
          <div className="max-w-xl rounded-lg border-l-4 border-ambar bg-ambar-claro p-5">
            <p className="mb-1 text-sm font-semibold text-ambar">
              Cuidado com a água quente
            </p>
            <p className="text-sm text-tinta-2">
              Esse experimento usa água fervendo. Faça você mesmo a parte de
              encher o copo e mantenha os alunos a um braço de distância.
            </p>
          </div>
        </Secao>

        <Secao titulo="O que costuma dar errado">
          <div className="max-w-xl rounded-lg border border-borda bg-creme-2 p-5">
            <p className="mb-1 text-sm font-semibold">
              O copo <span className="destaque">precisa estar seco</span> por
              dentro
            </p>
            <p className="text-sm text-tinta-2">
              Se sobrar água entre as paredes, o vácuo se perde e o experimento
              não funciona. Seque bem antes de começar.
            </p>
          </div>
        </Secao>
      </div>

      <p className="mt-16 border-t border-borda pt-8 font-mono text-xs text-tinta-3">
        Ciência como você nunca viu.
      </p>
    </main>
  );
}
