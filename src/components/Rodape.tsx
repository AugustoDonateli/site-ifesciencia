import Link from "next/link";

const redes = [
  { rotulo: "Instagram", href: "https://www.instagram.com/ifesciencia/" },
  { rotulo: "YouTube", href: "#" },
  { rotulo: "TikTok", href: "#" },
];

export function Rodape() {
  return (
    <footer className="border-t border-borda">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-titulo text-2xl font-bold tracking-tight">
              <span className="text-verde">Ifesciência</span>
            </p>
            <p className="mt-3 text-sm text-tinta-2">
              Projeto de divulgação científica do Instituto Federal do Espírito
              Santo, campus Cachoeiro de Itapemirim.
            </p>
            <p className="mt-4 text-sm text-tinta-2">
              Financiado pela Fapes — Fundação de Amparo à Pesquisa e Inovação
              do Espírito Santo.
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-tinta-3">
                Site
              </p>
              <ul className="flex flex-col gap-2 text-sm text-tinta-2">
                <li>
                  <Link href="#projeto" className="hover:text-tinta">
                    O projeto
                  </Link>
                </li>
                <li>
                  <Link href="/experimentos" className="hover:text-tinta">
                    Experimentos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-tinta-3">
                Redes
              </p>
              <ul className="flex flex-col gap-2 text-sm text-tinta-2">
                {redes.map((rede) => (
                  <li key={rede.rotulo}>
                    <a
                      href={rede.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-tinta"
                    >
                      {rede.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-14 border-t border-borda pt-8 font-mono text-xs text-tinta-3">
          © {new Date().getFullYear()} Ifesciência · Ifes Campus Cachoeiro de
          Itapemirim
        </p>
      </div>
    </footer>
  );
}
