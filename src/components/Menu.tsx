import Link from "next/link";

const itens = [
  { rotulo: "Início", href: "/" },
  { rotulo: "Experimentos", href: "/experimentos" },
  { rotulo: "Sobre nós", href: "#sobre" },
];

export function Menu() {
  return (
    <header className="sticky top-0 z-50 border-b border-borda bg-creme/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="font-titulo text-xl font-bold tracking-tight">
          Ifes<span className="destaque">ciência</span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm text-tinta-2 sm:flex">
          {itens.map((item) => (
            <li key={item.rotulo}>
              <Link
                href={item.href}
                className="transition-colors hover:text-tinta"
              >
                {item.rotulo}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href="https://www.instagram.com/ifesciencia/"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-verde px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
        >
          Contato
        </a>
      </nav>
    </header>
  );
}
