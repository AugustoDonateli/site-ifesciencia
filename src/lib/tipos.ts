export type Area = "fisica" | "quimica" | "biologia";
export type Nivel = "fundamental" | "medio" | "ambos";
export type Dificuldade = "facil" | "media" | "dificil";

export type Material = {
  item: string;
  quantidade: string | null;
  /** "Não tem X? Usa Y" — o campo que faz a lista servir pra escola sem verba. */
  substituto: string | null;
};

export type Passo = {
  texto: string;
  imagem_url?: string | null;
};

export type Experimento = {
  id: string;
  slug: string;
  titulo: string;
  area: Area;
  nivel: Nivel;
  youtube_id: string;
  tempo_preparo_min: number | null;
  tempo_execucao_min: number | null;
  custo_centavos: number | null;
  dificuldade: Dificuldade;
  materiais: Material[];
  passos: Passo[];

  // Opcionais: quando vêm nulos, o bloco não aparece na ficha.
  gancho: string | null;
  por_que_funciona: string | null;
  o_que_da_errado: string | null;
  seguranca: string | null;
  pode_fazer_em_casa: boolean | null;
  pdf_url: string | null;
  capa_url: string | null;

  publicado: boolean;
  ordem: number;
  criado_em: string;
  atualizado_em: string;
};

export const NOME_AREA: Record<Area, string> = {
  fisica: "Física",
  quimica: "Química",
  biologia: "Biologia",
};

export const NOME_DIFICULDADE: Record<Dificuldade, string> = {
  facil: "fácil",
  media: "média",
  dificil: "difícil",
};

export const NOME_NIVEL: Record<Nivel, string> = {
  fundamental: "Ensino fundamental",
  medio: "Ensino médio",
  ambos: "Fundamental e médio",
};

/** Guarda-se centavos no banco; aqui vira "R$ 12,00". */
export function formatarCusto(centavos: number | null) {
  if (centavos === null) return null;
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * A capa é a que a equipe enviar — e só ela.
 *
 * A miniatura automática do YouTube foi descartada de propósito: o acervo é
 * todo de Shorts, e pra vídeo vertical o YouTube devolve a imagem deitada com
 * tarja preta dos lados. Capa ruim estraga a grade inteira. Sem capa própria,
 * o cartão vira tipográfico, que é bonito por conta própria.
 */
export function capaDoExperimento(e: { capa_url: string | null }) {
  return e.capa_url;
}
