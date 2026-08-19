"use client";

/**
 * A faixa da imprensa correndo em loop.
 *
 * O truque do loop é ter duas cópias idênticas lado a lado: enquanto uma sai,
 * a outra entra. Só que cada cópia precisa ser MAIS LARGA que a tela — se não
 * for, sobra um vão vazio e o loop fica engasgado. Por isso a lista é repetida
 * algumas vezes dentro de cada cópia.
 *
 * A cópia de trás fica escondida de leitores de tela pra ninguém ouvir os
 * veículos duas vezes.
 *
 * A animação é CSS puro: roda fora da thread principal e não engasga em
 * celular fraco. Pausa no hover e some pra quem desligou movimento.
 */
export function FaixaCorrendo({ itens }: { itens: string[] }) {
  // Larga o bastante pra cobrir qualquer tela.
  const repetido = [...itens, ...itens, ...itens, ...itens];

  return (
    <div className="faixa group flex overflow-hidden border-t border-borda py-4">
      {[0, 1].map((copia) => (
        <ul
          key={copia}
          aria-hidden={copia === 1}
          className="faixa-trilho flex w-max shrink-0 items-center gap-10 pr-10"
        >
          {repetido.map((item, i) => (
            <li
              key={`${item}-${i}`}
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
