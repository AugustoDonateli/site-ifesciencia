export default function EmObras() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-tinta-3">
        Em obras
      </p>

      <h1 className="text-5xl font-bold sm:text-7xl">
        Ifes<span className="destaque">ciência</span>
      </h1>

      <p className="max-w-md text-balance text-tinta-2">
        O site está sendo construído. Enquanto isso, a gente continua no
        Instagram.
      </p>

      <a
        href="https://www.instagram.com/ifesciencia/"
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-verde px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
      >
        @ifesciencia
      </a>

      <p className="mt-10 font-mono text-xs text-tinta-3">
        Ciência como você nunca viu.
      </p>
    </main>
  );
}
