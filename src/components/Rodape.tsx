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
          <div>
            <p className="font-titulo text-2xl font-bold tracking-tight">
              Ifes<span className="destaque">ciência</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-tinta-2">
              Projeto de divulgação científica do Instituto Federal do Espírito
              Santo, campus Cachoeiro de Itapemirim.
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-tinta-3">
                Site
              </p>
              <ul className="flex flex-col gap-2 text-sm text-tinta-2">
                <li>
                  <Link href="/experimentos" className="hover:text-tinta">
                    Experimentos
                  </Link>
                </li>
                <li>
                  <Link href="#sobre" className="hover:text-tinta">
                    Sobre nós
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

        {/* O bordão fecha a landing do mesmo jeito que fecha os vídeos. */}
        <p className="mt-16 border-t border-borda pt-8 font-titulo text-3xl font-bold sm:text-4xl">
          Ciência como você <span className="destaque">nunca</span> viu.
        </p>
      </div>
    </footer>
  );
}
