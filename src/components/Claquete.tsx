"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usarMovimentoReduzido } from "@/lib/usarMovimentoReduzido";

/**
 * Quanto tempo cada metade do movimento leva, em milissegundos.
 *
 * Curto de propósito. Transição não é objeto icônico: o copo e a bola são
 * vistos uma vez e podem se dar ao luxo de um showzinho, mas isto aqui aparece
 * dezenas de vezes por visita, e o que encanta na primeira vez irrita na
 * décima. O que salva é o ritmo ser o mesmo de uma claquete de verdade — ela
 * fecha rápido porque é um corte, não um efeito.
 */
const FECHA = 220;
const IMPACTO = 60;
const ABRE = 280;

/**
 * A transição entre as páginas: uma claquete que fecha e abre.
 *
 * O objeto não foi escolhido por ser bonito. Seis pessoas seguram uma claquete
 * na galeria da equipe — ela já está no site —, e claquete é literalmente o
 * objeto que marca o começo de uma tomada. Trocar por outra coisa quebraria o
 * sentido, que é o teste que o Augusto criou pra recusar sete objetos antes.
 *
 * Não usa a API de View Transitions do navegador, e não é por desconhecimento:
 * ela entrega as fotos da página velha e da nova, e as barras da claquete não
 * pertencem a nenhuma das duas. Não há onde desenhá-las ali dentro.
 *
 * O clique é interceptado porque o estalo precisa acontecer ANTES de a página
 * nova existir — é essa a ordem que faz ler como corte em vez de cortina. E
 * quando a página demora, as barras ficam fechadas esperando, o que de quebra
 * vira o indicador de carregamento que o site não tinha.
 */
export function Claquete() {
  const cima = useRef<HTMLDivElement>(null);
  const baixo = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const fechada = useRef(false);
  const fechadaEm = useRef(0);
  const router = useRouter();
  const caminho = usePathname();
  const reduzido = usarMovimentoReduzido();

  // Fecha ao clicar num link interno; a navegação sai depois do estalo.
  useEffect(() => {
    if (reduzido) return;

    const aoClicar = (ev: MouseEvent) => {
      /**
       * Só o clique simples de navegação é interceptado. Ctrl, Shift, Meta e
       * botão do meio abrem em outra aba, e roubar isso do usuário seria
       * quebrar o navegador pra ganhar uma animação.
       */
      if (
        ev.defaultPrevented ||
        ev.button !== 0 ||
        ev.metaKey ||
        ev.ctrlKey ||
        ev.shiftKey ||
        ev.altKey
      )
        return;

      const link = (ev.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Fora do site, download, nova aba e âncora seguem o caminho normal.
      if (
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      const destino = new URL(href, window.location.href);
      if (destino.origin !== window.location.origin) return;

      // Mesma página, ou só um pulo pra uma âncora dela: não é transição.
      if (destino.pathname === window.location.pathname && destino.hash !== "")
        return;
      if (
        destino.pathname === window.location.pathname &&
        destino.search === window.location.search
      )
        return;

      /**
       * `stopPropagation` além do `preventDefault`, e na fase de CAPTURA: o
       * `<Link>` do Next trata o clique no próprio elemento, então um ouvinte
       * comum no documento só chega depois de ele já ter navegado. Medido: a
       * navegação acontecia e a claquete nunca aparecia.
       */
      ev.preventDefault();
      ev.stopPropagation();
      fechar(() =>
        router.push(destino.pathname + destino.search + destino.hash),
      );
    };

    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, [reduzido, router]);

  // A página nova chegou: abre.
  useEffect(() => {
    if (!fechada.current) return;
    const t = setTimeout(abrir, IMPACTO);
    return () => clearTimeout(t);
  }, [caminho]);

  /**
   * A trava de segurança.
   *
   * Enquanto a página nova não chega, as barras ficam fechadas de propósito —
   * vira o indicador de carregamento que o site não tinha. Só que se a
   * navegação falhar, ou a rota nem mudar de caminho, elas ficariam fechadas
   * pra sempre e o site estaria morto atrás de uma tela preta. Depois de dois
   * segundos e meio ela abre de qualquer jeito: melhor uma transição estranha
   * que uma página inacessível.
   */
  useEffect(() => {
    if (reduzido) return;
    const id = window.setInterval(() => {
      if (!fechada.current) return;
      if (Date.now() - fechadaEm.current > 2500) abrir();
    }, 500);
    return () => window.clearInterval(id);
  }, [reduzido]);

  const mover = (
    el: HTMLElement | null,
    de: string,
    para: string,
    ms: number,
    curva: string,
  ) => {
    if (!el) return;
    el.style.transition = "none";
    el.style.transform = de;
    // Força o navegador a assumir o ponto de partida antes de animar.
    void el.offsetHeight;
    el.style.transition = `transform ${ms}ms ${curva}`;
    el.style.transform = para;
  };

  const fechar = (depois: () => void) => {
    fechada.current = true;
    fechadaEm.current = Date.now();
    if (palco.current) {
      palco.current.style.visibility = "visible";
      /**
       * Enquanto a tela está preta ela também engole os cliques. Sem isto o
       * usuário acerta um link que não está vendo — e vai parar numa página
       * que não pediu, sem entender como chegou lá.
       */
      palco.current.style.pointerEvents = "auto";
    }
    /**
     * `will-change` só enquanto anda. Deixado fixo no CSS, ele mantém duas
     * camadas do tamanho da tela promovidas na memória durante a visita
     * inteira — e a claquete fica escondida quase o tempo todo. No celular
     * dentro do navegador do Instagram, que é por onde a maioria entra, esse
     * é um custo que não se paga.
     */
    for (const el of [cima.current, baixo.current])
      if (el) el.style.willChange = "transform";
    /**
     * Fecha acelerando — `ease-in` é o que dá o peso de uma coisa que cai e
     * bate. Sair acelerando e chegar devagar leria como cortina.
     */
    mover(
      cima.current,
      "translateY(-100%)",
      "translateY(0)",
      FECHA,
      "cubic-bezier(0.55, 0, 0.85, 0.35)",
    );
    mover(
      baixo.current,
      "translateY(100%)",
      "translateY(0)",
      FECHA,
      "cubic-bezier(0.55, 0, 0.85, 0.35)",
    );
    setTimeout(depois, FECHA);
  };

  const abrir = () => {
    // Abre desacelerando, e mais devagar que fecha: o corte já aconteceu.
    mover(
      cima.current,
      "translateY(0)",
      "translateY(-100%)",
      ABRE,
      "cubic-bezier(0.16, 1, 0.3, 1)",
    );
    mover(
      baixo.current,
      "translateY(0)",
      "translateY(100%)",
      ABRE,
      "cubic-bezier(0.16, 1, 0.3, 1)",
    );
    setTimeout(() => {
      fechada.current = false;
      if (palco.current) {
        palco.current.style.visibility = "hidden";
        palco.current.style.pointerEvents = "";
      }
      for (const el of [cima.current, baixo.current])
        if (el) el.style.willChange = "";
    }, ABRE);
  };

  if (reduzido) return null;

  return (
    <div
      ref={palco}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ visibility: "hidden" }}
    >
      <div
        ref={cima}
        className="absolute inset-x-0 top-0 h-1/2 bg-tinta"
        style={{ transform: "translateY(-100%)" }}
      >
        {/* As listras da borda são o que faz ler como claquete e não como duas
            barras pretas. São as cores da claquete de vocês, puxadas pra
            paleta do site. */}
        <div className="listras-da-claquete absolute inset-x-0 bottom-0 h-3.5" />
      </div>

      <div
        ref={baixo}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-tinta"
        style={{ transform: "translateY(100%)" }}
      >
        <div className="listras-da-claquete absolute inset-x-0 top-0 h-3.5" />
      </div>
    </div>
  );
}
