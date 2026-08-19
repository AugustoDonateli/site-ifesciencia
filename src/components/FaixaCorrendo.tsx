"use client";

/**
 * A faixa da imprensa correndo em loop.
 *
 * A lista é duplicada porque o loop precisa de uma cópia entrando enquanto
 * a outra sai. A cópia fica escondida de leitores de tela pra ninguém
 * ouvir os veículos duas vezes.
 *
 * A animação é CSS puro: roda fora da thread principal e não engasga
 * em celular fraco. Pausa no hover e some pra quem desligou movimento.
 */
export function FaixaCorrendo({ itens }: { itens: string[] }) {
  return (
    <div className="faixa group relative flex overflow-hidden border-t border-borda py-4">
      {[0, 1].map((copia) => (
        <ul
          key={copia}
          aria-hidden={copia === 1}
          className="faixa-trilho flex shrink-0 items-center gap-10 pr-10"
        >
          {itens.map((item) => (
            <li
              key={item}
              className="whitespace-nowrap font-mono text-xs uppercase tracking-widest text-tinta-3"
            >
              {item}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
