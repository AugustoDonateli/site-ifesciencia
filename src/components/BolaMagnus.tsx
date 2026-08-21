"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/** Tamanho da bola quando está mais perto. Ela encolhe daí pra frente. */
const TAMANHO = 130;

/** Em que ponto da rolagem a bola encosta no número. */
const IMPACTO = 0.55;

/**
 * Quanto scroll o número leva balançando depois da pancada, em PIXELS.
 *
 * Em pixels e não em fração da travessia porque a seção muda de altura com a
 * tela, e fração viraria trancos de durações diferentes — o mesmo erro que a
 * queda do copo cometeu.
 */
const JANELA_TRANCO = 340;

const bezier = (t: number, a: number, b: number, c: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

/**
 * A bola do efeito Magnus, na seção do alcance.
 *
 * O lugar não é aleatório: a seção se chama Alcance e fala de meio milhão de
 * pessoas e 13 milhões de visualizações. Uma bola chutada que viaja longe,
 * curvando, é literalmente alcance.
 *
 * Mas o que faz ela valer não é atravessar a tela — é BATER em alguma coisa.
 * A versão anterior passava na frente dos três números dando um empurrãozinho
 * em cada, e empurrãozinho difuso em três alvos não lê como nada. Aqui é um
 * alvo só: ela desce, acerta o número do meio em cheio, ele leva o tranco, e
 * ela ricocheteia embora encolhendo.
 *
 * A trajetória inteira antes do impacto acontece ACIMA dos números, no espaço
 * que a seção ganhou de propósito para isso. A bola não cobre uma letra.
 *
 * Sem vídeo: o modelo foi testado e faz a bola ir reta para o fundo — medido
 * quadro a quadro, o x dela fica cravado durante 80% do clipe. Curva e
 * ricochete são o que código faz bem.
 */
export function BolaMagnus() {
  const ref = useRef<HTMLDivElement>(null);
  const reduzido = usarMovimentoReduzido();

  useEffect(() => {
    const palco = ref.current;
    const bola = palco?.firstElementChild as HTMLElement | null;
    const secao = palco?.closest("section");
    if (!palco || !bola || !secao) return;

    const numeros = [...secao.querySelectorAll<HTMLElement>("[data-numero]")];
    if (numeros.length === 0) return;

    /**
     * Qual número leva a pancada.
     *
     * Lado a lado, é o do meio — o número mais forte da seção. Empilhados,
     * tem que ser o primeiro: mirar no segundo faria a bola atravessar o de
     * cima na descida, que é justamente o que a gente está evitando.
     *
     * A checagem é pela posição real, não por largura de tela: é o layout que
     * decide, não o aparelho.
     */
    const escolherAlvo = () => {
      const empilhados =
        numeros.length > 1 &&
        numeros[1].getBoundingClientRect().top -
          numeros[0].getBoundingClientRect().top >
          10;
      return empilhados
        ? numeros[0]
        : (numeros[Math.floor(numeros.length / 2)] ?? numeros[0]);
    };

    let alvo = escolherAlvo();

    let agendado = false;

    const posicionar = () => {
      const s = secao.getBoundingClientRect();
      const anterior = alvo;
      alvo = escolherAlvo();
      // Trocou de alvo (a tela mudou de formato): limpa o antigo.
      if (anterior !== alvo) anterior.style.transform = "";
      const r = alvo.getBoundingClientRect();

      // Onde a bola encosta: em cima do número, no meio dele.
      const alvoX = r.left - s.left + r.width * 0.42;
      const alvoY = r.top - s.top;

      const total = s.height + window.innerHeight;
      const t = Math.min(Math.max((window.innerHeight - s.top) / total, 0), 1);

      if (reduzido) {
        bola.style.opacity = "0";
        alvo.style.transform = "";
        return;
      }

      let x: number;
      let y: number;
      let escala: number;

      if (t < IMPACTO) {
        // Descida: entra pela direita, lá em cima, e curva até o número.
        const q = t / IMPACTO;
        x = bezier(q, s.width * 1.05, s.width * 0.92, alvoX);
        y = bezier(q, -TAMANHO * 0.4, s.height * 0.06, alvoY);
        escala = 1 - 0.45 * Math.pow(q, 0.7);
      } else {
        // Ricochete: sai pela esquerda e some encolhendo.
        const q = (t - IMPACTO) / (1 - IMPACTO);
        x = bezier(q, alvoX, alvoX - s.width * 0.28, -s.width * 0.1);
        y = bezier(q, alvoY, alvoY - s.height * 0.42, s.height * 0.1);
        escala = 0.55 - 0.4 * Math.pow(q, 0.6);
      }

      /**
       * O giro.
       *
       * Sete voltas e meia na travessia, e não duas e meia como antes: bola
       * de falta com efeito gira MUITO, e giro tímido lê como bola rolando.
       *
       * O expoente amarra o giro à velocidade aparente — ela roda rápido
       * enquanto está perto e vai desacelerando conforme some na distância,
       * que é o que a perspectiva faz de verdade.
       *
       * Anti-horário de propósito: é o mesmo sentido da curva e do ricochete
       * para a esquerda, então o giro parece a CAUSA do desvio, não um
       * enfeite girando por conta própria.
       */
      const giro = -2700 * Math.pow(t, 0.75);

      bola.style.opacity = "1";
      // A base da bola encosta no alvo, então o centro fica meio raio acima.
      bola.style.transform = `translate(${x}px, ${
        y - (TAMANHO * escala) / 2
      }px) translate(-50%, -50%) rotate(${giro}deg) scale(${escala})`;

      /**
       * O tranco no número: pancada seca e depois balanço até assentar.
       *
       * A versão anterior era um triângulo — subia até o pico exatamente em
       * IMPACTO e voltava. Só que o pico existia por um quadro de rolagem, e
       * todo o resto era rampa: 14px num número de 60px de altura, distribuídos
       * ao longo de 357px de scroll. Lido devagar parecia deriva, e rolando
       * rápido não se via nada.
       *
       * Aqui o deslocamento é máximo NO impacto e cai oscilando, como coisa
       * pesada que levou pancada. É o balanço que salva: mesmo passando rápido,
       * a pessoa pega o número fora do lugar em algum quadro.
       *
       * Empurra pra esquerda porque é pra lá que a bola vai — tranco na direção
       * contrária ao golpe denunciaria que é enfeite.
       */
      const depois = (t - IMPACTO) / (JANELA_TRANCO / total);
      if (depois >= 0 && depois <= 1) {
        /**
         * Amortecimento lento e frequência baixa: duas voltas em 340px de
         * scroll. Com o amortecimento rápido que tentei antes, o balanço já
         * tinha morrido nos primeiros 90px — voltava a ser um lampejo que a
         * rolagem engolia.
         */
        const forca = Math.exp(-depois * 2.2) * Math.cos(depois * 12.6);
        /**
         * A escala é o que mais se enxerga. Deslocamento e giro dependem de a
         * pessoa lembrar onde o número estava; um número que incha e murcha se
         * denuncia sozinho, mesmo passando rápido.
         */
        alvo.style.transform = `translate(${forca * -30}px, ${
          forca * 20
        }px) rotate(${forca * 3.5}deg) scale(${1 + forca * 0.06})`;
      } else {
        alvo.style.transform = "";
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

    posicionar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      alvo.style.transform = "";
    };
  }, [reduzido]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      <div
        className="absolute left-0 top-0 opacity-0 will-change-transform"
        style={{ width: TAMANHO, height: TAMANHO }}
      >
        {/* Sai já no tamanho e formato de entrega, então não passa pelo
            otimizador. E carrega junto com a página: objeto de scroll não
            pode aparecer atrasado. */}
        <Image
          src="/objetos/bola.webp"
          alt=""
          width={280}
          height={280}
          unoptimized
          loading="eager"
          onError={(e) => {
            const el = e.currentTarget.parentElement;
            if (el) el.style.display = "none";
          }}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
