import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import {
  NOME_AREA,
  NOME_DIFICULDADE,
  NOME_NIVEL,
  formatarCusto,
  type Experimento,
} from "./tipos";

/**
 * A ficha impressa do experimento.
 *
 * Ela existe porque a chamada final do site promete "um PDF para imprimir", e
 * até agora essa promessa não era cumprida por nenhum experimento — dava pra
 * subir um PDF pronto pelo painel, mas ninguém tinha subido. A decisão D15 do
 * briefing sempre foi que o site gera sozinho a partir dos campos, e o arquivo
 * enviado só substitui.
 *
 * É feita para PRETO E BRANCO. A escola imprime no que tem, e cor que vira
 * cinza chapado piora a leitura em vez de ajudar — então a hierarquia toda sai
 * de tamanho, peso e espaço, nunca de cor.
 */

/** A4 em pontos, que é a unidade do PDF. */
const LARGURA = 595.28;
const ALTURA = 841.89;
const MARGEM = 56;
const UTIL = LARGURA - MARGEM * 2;

const PRETO = rgb(0, 0, 0);
const CINZA = rgb(0.42, 0.42, 0.4);
const CINZA_CLARO = rgb(0.85, 0.84, 0.8);

/**
 * As fontes padrão do PDF usam WinAnsi, que cobre acento português inteiro mas
 * não travessão longo, aspas curvas nem reticências de um caractere só. Sem
 * trocar, a geração QUEBRA — não degrada, quebra — no primeiro texto que a
 * equipe escrever com travessão. E ela vai escrever: o site inteiro usa.
 */
function sanear(texto: string): string {
  return texto
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/[–—―]/g, "-")
    .replace(/…/g, "...")
    .replace(/[   ]/g, " ")
    .replace(/•/g, "-")
    .replace(/[​-‍﻿]/g, "");
}

function quebrar(
  texto: string,
  fonte: PDFFont,
  tamanho: number,
  largura: number,
): string[] {
  const linhas: string[] = [];
  for (const paragrafo of sanear(texto).split(/\n+/)) {
    let atual = "";
    for (const palavra of paragrafo.split(/\s+/).filter(Boolean)) {
      const tentativa = atual ? `${atual} ${palavra}` : palavra;
      if (fonte.widthOfTextAtSize(tentativa, tamanho) <= largura) {
        atual = tentativa;
      } else {
        if (atual) linhas.push(atual);
        atual = palavra;
      }
    }
    if (atual) linhas.push(atual);
  }
  return linhas;
}

/**
 * O cursor de escrita, que sabe virar a página sozinho.
 *
 * Sem isso cada bloco teria que checar se ainda cabe, e um texto longo que a
 * equipe escrevesse sairia cortado no rodapé sem ninguém perceber.
 */
class Folha {
  doc: PDFDocument;
  pagina: PDFPage;
  y: number;
  regular: PDFFont;
  negrito: PDFFont;
  paginas: PDFPage[] = [];

  constructor(doc: PDFDocument, regular: PDFFont, negrito: PDFFont) {
    this.doc = doc;
    this.regular = regular;
    this.negrito = negrito;
    this.pagina = this.novaPagina();
    this.y = ALTURA - MARGEM;
  }

  novaPagina() {
    const p = this.doc.addPage([LARGURA, ALTURA]);
    this.paginas.push(p);
    this.pagina = p;
    this.y = ALTURA - MARGEM;
    return p;
  }

  /** Vira a página se o que vem não couber. O rodapé come 46pt. */
  garantir(altura: number) {
    if (this.y - altura < MARGEM + 46) this.novaPagina();
  }

  espaco(v: number) {
    this.y -= v;
  }

  texto(
    conteudo: string,
    opcoes: {
      tamanho?: number;
      fonte?: PDFFont;
      cor?: ReturnType<typeof rgb>;
      entrelinha?: number;
      recuo?: number;
      largura?: number;
    } = {},
  ) {
    const tamanho = opcoes.tamanho ?? 10.5;
    const fonte = opcoes.fonte ?? this.regular;
    const cor = opcoes.cor ?? PRETO;
    const entrelinha = opcoes.entrelinha ?? tamanho * 1.45;
    const recuo = opcoes.recuo ?? 0;
    const largura = opcoes.largura ?? UTIL - recuo;

    for (const linha of quebrar(conteudo, fonte, tamanho, largura)) {
      this.garantir(entrelinha);
      this.pagina.drawText(linha, {
        x: MARGEM + recuo,
        y: this.y - tamanho,
        size: tamanho,
        font: fonte,
        color: cor,
      });
      this.y -= entrelinha;
    }
  }

  linha() {
    this.garantir(1);
    this.pagina.drawRectangle({
      x: MARGEM,
      y: this.y,
      width: UTIL,
      height: 0.8,
      color: CINZA_CLARO,
    });
    this.y -= 1;
  }

  secao(titulo: string) {
    this.espaco(16);
    this.garantir(30);
    this.texto(titulo.toUpperCase(), {
      tamanho: 8.5,
      fonte: this.negrito,
      cor: CINZA,
      entrelinha: 14,
    });
    this.espaco(2);
  }
}

export async function gerarFichaPdf(e: Experimento, enderecoDoSite: string) {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const negrito = await doc.embedFont(StandardFonts.HelveticaBold);
  const f = new Folha(doc, regular, negrito);

  doc.setTitle(sanear(`${e.titulo} — Ifesciência`));
  doc.setAuthor("Ifesciência — Ifes Campus Cachoeiro de Itapemirim");
  doc.setSubject("Ficha para replicar o experimento em sala de aula");

  // Cabeçalho
  f.texto(`IFESCIÊNCIA · ${NOME_AREA[e.area].toUpperCase()}`, {
    tamanho: 8.5,
    fonte: negrito,
    cor: CINZA,
    entrelinha: 16,
  });
  f.espaco(6);
  f.texto(e.titulo, { tamanho: 21, fonte: negrito, entrelinha: 26 });

  if (e.gancho) {
    f.espaco(6);
    f.texto(e.gancho, { tamanho: 11, cor: CINZA, entrelinha: 16 });
  }

  // A linha prática: é o que decide se a professora tenta ou não.
  const fatos = [
    e.tempo_preparo_min ? `${e.tempo_preparo_min} min de preparo` : null,
    e.tempo_execucao_min ? `${e.tempo_execucao_min} min de execução` : null,
    formatarCusto(e.custo_centavos),
    NOME_DIFICULDADE[e.dificuldade],
    NOME_NIVEL[e.nivel],
    e.pode_fazer_em_casa ? "dá para fazer em casa" : null,
  ].filter(Boolean) as string[];

  f.espaco(12);
  f.linha();
  f.espaco(10);
  f.texto(fatos.join("   ·   "), { tamanho: 9.5, cor: CINZA, entrelinha: 14 });
  f.espaco(6);
  f.linha();

  // Materiais
  if (e.materiais.length) {
    f.secao("Materiais");
    for (const m of e.materiais) {
      const cabeca = m.quantidade ? `${m.quantidade} — ${m.item}` : m.item;
      f.texto(cabeca, { recuo: 14, entrelinha: 15 });
      /**
       * O substituto entra recuado e em itálico visual (cinza), nunca escondido:
       * é ele que faz a lista servir para escola sem verba, que é o público que
       * o site promete atender.
       */
      if (m.substituto) {
        f.texto(`Não tem? ${m.substituto}`, {
          recuo: 28,
          tamanho: 9.5,
          cor: CINZA,
          entrelinha: 14,
        });
      }
      f.espaco(3);
    }
  }

  // Passo a passo
  if (e.passos.length) {
    f.secao("Passo a passo");
    e.passos.forEach((p, i) => {
      f.garantir(18);
      const numero = `${i + 1}.`;
      f.pagina.drawText(numero, {
        x: MARGEM,
        y: f.y - 10.5,
        size: 10.5,
        font: negrito,
        color: PRETO,
      });
      f.texto(p.texto, { recuo: 20, entrelinha: 15 });
      f.espaco(6);
    });
  }

  if (e.por_que_funciona) {
    f.secao("Por que funciona");
    f.texto(e.por_que_funciona);
  }

  if (e.o_que_da_errado) {
    f.secao("O que costuma dar errado");
    f.texto(e.o_que_da_errado);
  }

  if (e.seguranca) {
    f.secao("Segurança");
    f.texto(e.seguranca);
  }

  /**
   * O rodapé é escrito no fim, em todas as páginas, porque só aqui se sabe
   * quantas elas são. Leva o endereço da ficha: papel circula fotocopiado, e
   * sem o link ninguém volta para o vídeo.
   */
  const total = f.paginas.length;
  f.paginas.forEach((p, i) => {
    const rodape = sanear(`${enderecoDoSite}/experimentos/${e.slug}`);
    p.drawRectangle({
      x: MARGEM,
      y: MARGEM + 26,
      width: UTIL,
      height: 0.8,
      color: CINZA_CLARO,
    });
    p.drawText(rodape, {
      x: MARGEM,
      y: MARGEM + 12,
      size: 8.5,
      font: regular,
      color: CINZA,
    });
    const pag = `${i + 1}/${total}`;
    p.drawText(pag, {
      x: LARGURA - MARGEM - regular.widthOfTextAtSize(pag, 8.5),
      y: MARGEM + 12,
      size: 8.5,
      font: regular,
      color: CINZA,
    });
  });

  /**
   * Sem fluxos de objeto. Eles encolhem o arquivo, mas são recurso de PDF 1.5
   * e leitor antigo — que é o que tem em secretaria de escola — às vezes
   * engasga. A ficha tem 3 KB de qualquer jeito; compatibilidade vale mais.
   */
  return doc.save({ useObjectStreams: false });
}
