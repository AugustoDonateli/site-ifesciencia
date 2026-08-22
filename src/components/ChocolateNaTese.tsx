"use client";

import { useEffect, useRef, useState } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * A imagem sai do gerador com os cantos já arredondados e fundo branco fora
 * deles. Recortada justo na barra, sobra branco só nos quatro cantos — e este
 * raio, medido em 6,3% da altura, é o que apara exatamente essa sobra.
 *
 * Em porcentagem e não em pixels porque a barra muda de altura com a tela: a
 * altura dela vem da frase, que quebra em duas linhas no computador e em três
 * no celular.
 */
const RAIO_DO_CANTO = 0.063;

/** Quanto scroll a passagem inteira consome, em pixels. */
const PASSAGEM = 460;
const PASSAGEM_SOLTA = 280;

/** Onde a passagem acontece, na travessia da seção (ou da frase, no celular). */
const MEIO = 0.5;
const MEIO_SOLTA = 0.55;

/**
 * O reflexo prismático. Discreto de propósito — arco-íris cheio ao lado de
 * texto sério vira enfeite de festa. São os verdes e azuis da paleta puxados
 * para roxo e âmbar, que é o caminho que um filme de difração faz de verdade.
 */
const IRIDESCENCIA =
  "#35c05a 0%, #2fb6d8 28%, #8a6fd8 54%, #e262a4 78%, #e0a338 100%";

/**
 * A barra de chocolate holográfico que passa por cima da tese e a deixa acesa.
 *
 * A frase é *a ciência está presente em diversos aspectos da vida diária*.
 *
 * O objeto não bate em nada e não quebra: ele PASSA, como a luz passa.
 * Chocolate holográfico não brilha sozinho — tem um filme prensado que difrata
 * a luz, e sem luz atravessando é uma barra marrom comum. Então a barra
 * deslizando sobre a frase é o próprio fenômeno acontecendo, e o que ela deixa
 * para trás é a frase iridescente. A ideia é do Augusto.
 *
 * Isso resolveu o que travou oito tentativas antes. A tese fica espremida no
 * meio de um parágrafo denso e não tem folga nenhuma em volta — mas objeto que
 * só passa não precisa de folga. E nada fica coberto parado: a versão anterior
 * pousava em cima da frase e tapava o parágrafo inteiro.
 *
 * O texto acende e não apaga. Uma vez que a luz passou, passou.
 */
export function ChocolateNaTese() {
  const ref = useRef<HTMLDivElement>(null);
  const [pronto, setPronto] = useState(false);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const palco = ref.current;
    const secao = palco?.closest("section");
    if (!palco || !secao) return;

    const tese = secao.querySelector<HTMLElement>("[data-tese]");
    const base = palco.offsetParent as HTMLElement | null;
    if (!tese || !base) return;

    /**
     * O brilho é pintado por cima, em `lighten`, e não trocando a cor do texto.
     *
     * `lighten` fica com o mais claro entre o que está embaixo e o que está em
     * cima, canal a canal. O creme do fundo é mais claro que qualquer cor do
     * reflexo, então ele não muda; a tinta do texto é mais escura que todas,
     * então ela vira o reflexo. Resultado: acende as letras e não pinta o fundo.
     *
     * A alternativa seria `background-clip: text`, que era mais curta e estava
     * errada: texto que quebra em duas linhas tem o fundo pintado numa caixa
     * só, emendada, e a divisa do brilho andaria fora de sincronia com a barra.
     *
     * Uma camada por LINHA, porque `getClientRects` devolve um retângulo por
     * pedaço quebrado — e é isso que dá a divisa reta atravessando as duas.
     */
    const camadas: HTMLElement[] = [];
    const camada = (i: number) => {
      if (camadas[i]) return camadas[i];
      const el = document.createElement("span");
      el.setAttribute("aria-hidden", "true");
      el.style.position = "absolute";
      el.style.pointerEvents = "none";
      el.style.mixBlendMode = "lighten";
      el.style.backgroundImage = `linear-gradient(90deg, ${IRIDESCENCIA})`;
      el.style.backgroundRepeat = "no-repeat";
      el.style.zIndex = "10";
      base.appendChild(el);
      camadas[i] = el;
      return el;
    };

    /** Uma vez aceso, não apaga. Guarda o ponto mais longe que a luz chegou. */
    let maisLonge = 0;
    let agendado = false;

    const posicionar = () => {
      const r = tese.getBoundingClientRect();
      const p = base.getBoundingClientRect();

      /**
       * A barra é pequena e a altura sai da frase, não da largura. Tirando da
       * largura, a proporção de barra dava 158px em cima de uma frase de 44 e o
       * parágrafo inteiro ficava ilegível na passagem.
       */
      const largura = Math.max(96, Math.min(140, r.width * 0.22));
      const altura = Math.round(r.height + 16);
      const centroY = r.top - p.top + r.height / 2;

      palco.style.width = `${largura}px`;
      palco.style.height = `${altura}px`;
      palco.style.borderRadius = `${altura * RAIO_DO_CANTO}px`;
      palco.style.left = `${r.left - p.left}px`;
      palco.style.top = `${centroY - altura / 2}px`;

      /**
       * A frente de luz é a borda DIREITA da barra, e essa escolha decide onde
       * ela termina.
       *
       * Com a frente na borda esquerda, pra acender a frase até a última letra
       * a barra tinha que levar o corpo inteiro pra depois dela — e como a
       * frase acaba a 15px da beirada da coluna, ela ia parar em cima das
       * fotos e sumia lá, do nada. Com a frente na direita, ela ilumina à
       * frente de si e acaba o trabalho ainda dentro da coluna.
       */
      const bordaEm = (q: number) => r.left - 20 + q * (r.width + 40);

      const empilhado = window.matchMedia("(max-width: 767px)").matches;
      const s = secao.getBoundingClientRect();
      const total = empilhado
        ? window.innerHeight + r.height
        : s.height + window.innerHeight;
      if (total <= 0) return;

      let q: number;
      if (reduzido) {
        // Sem movimento: a frase já nasce acesa e a barra não aparece.
        q = 1;
        palco.style.opacity = "0";
      } else {
        /**
         * Grudada, a frase fica imóvel na tela e não serve de relógio — quem
         * marca é a seção. Solta, é a frase que atravessa, e é ela que marca.
         */
        const percorrido = empilhado
          ? window.innerHeight - r.top
          : window.innerHeight - s.top;
        const t = Math.min(Math.max(percorrido / total, 0), 1);
        const janela = (empilhado ? PASSAGEM_SOLTA : PASSAGEM) / total;
        const meio = empilhado ? MEIO_SOLTA : MEIO;
        q = (t - (meio - janela / 2)) / janela;

        /**
         * Ela acende chegando e se dissipa indo embora, em vez de piscar pra
         * fora da existência. Sem isso a barra simplesmente deixava de ser
         * desenhada no fim da janela — que foi o que o Augusto viu.
         */
        const aparecer = Math.min(Math.max(q / 0.14, 0), 1);
        const apagar = 1 - Math.min(Math.max((q - 0.78) / 0.22, 0), 1);
        palco.style.opacity =
          q >= 0 && q <= 1 ? String(aparecer * apagar) : "0";

        if (q >= 0 && q <= 1) {
          // A caixa é ancorada pela ponta esquerda, e a frente é a direita.
          palco.style.transform = `translateX(${
            bordaEm(q) - largura - r.left
          }px)`;
        }
        q = Math.min(Math.max(q, 0), 1);
      }

      if (q > maisLonge) maisLonge = q;
      const borda = bordaEm(maisLonge);

      /**
       * Cada linha acende da própria borda esquerda até a divisa. O degradê
       * corre pela frase INTEIRA e não se repete por linha: por isso a largura
       * dele é a soma das linhas, e cada uma recebe o pedaço que lhe cabe.
       */
      const pedacos = [...tese.getClientRects()];
      const larguraTotal = pedacos.reduce((soma, x) => soma + x.width, 0);
      let acumulado = 0;

      pedacos.forEach((rect, i) => {
        const el = camada(i);
        const visivel = Math.min(Math.max(borda - rect.left, 0), rect.width);
        el.style.left = `${rect.left - p.left}px`;
        el.style.top = `${rect.top - p.top}px`;
        el.style.height = `${rect.height}px`;
        el.style.width = `${visivel}px`;
        el.style.backgroundSize = `${larguraTotal}px 100%`;
        el.style.backgroundPosition = `${-acumulado}px center`;
        el.style.display = visivel > 0.5 ? "block" : "none";
        acumulado += rect.width;
      });

      // Sobrou camada de um layout anterior com mais linhas: some com ela.
      for (let i = pedacos.length; i < camadas.length; i++) {
        camadas[i].style.display = "none";
      }
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        posicionar();
      });
    };

    setPronto(true);
    posicionar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    document.fonts?.ready.then(aoRolar);
    const observador = new ResizeObserver(aoRolar);
    observador.observe(tese);
    observador.observe(secao);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      observador.disconnect();
      camadas.forEach((el) => el.remove());
    };
  }, [reduzido]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-20 overflow-hidden will-change-transform"
      style={{ opacity: 0, visibility: pronto ? "visible" : "hidden" }}
    >
      {/* Sai já no tamanho e formato de entrega, então não passa pelo
          otimizador; e carrega junto com a página, porque objeto de rolagem
          não pode aparecer atrasado — foi o tropeço dos quadros do copo. */}
      <img
        src="/objetos/chocolate.webp"
        alt=""
        width={420}
        height={234}
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
