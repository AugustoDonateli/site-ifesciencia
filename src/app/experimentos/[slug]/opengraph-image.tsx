import { ImageResponse } from "next/og";
import { buscarExperimento } from "@/lib/supabase";
import {
  NOME_AREA,
  NOME_DIFICULDADE,
  formatarCusto,
} from "@/lib/tipos";

/**
 * O cartão que aparece quando alguém manda o link do experimento no WhatsApp.
 *
 * Isso não é enfeite: o site inteiro vive de ser aberto pela bio do Instagram
 * e repassado entre professoras. Link sem cartão chega como uma linha de texto
 * cinza, e link com cartão chega ocupando meia tela.
 *
 * O que ele mostra é escolhido pensando em quem recebe. Título grande porque é
 * o que faz clicar, e embaixo os três números que respondem a pergunta que
 * decide se a professora vai tentar: quanto tempo, quanto custa, e se é
 * difícil. Esses dados já existem no banco e já são preenchidos no painel.
 */
export const alt = "Experimento do Ifesciência";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREME = "#faf7ef";
const CREME_2 = "#f3efe4";
const TINTA = "#17170f";
const TINTA_2 = "#5c594c";
const TINTA_3 = "#8a8674";
const VERDE = "#2f9e44";
const BORDA = "#e3decf";

export default async function Imagem({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = await buscarExperimento(slug).catch(() => null);

  const titulo = e?.titulo ?? "Ciência como você nunca viu";
  const gancho = e?.gancho ?? null;

  /**
   * Só entra o que existe. Ficha sem custo cadastrado mostra duas etiquetas em
   * vez de três — melhor que uma etiqueta vazia dizendo nada.
   */
  const etiquetas = [
    e?.tempo_execucao_min ? `${e.tempo_execucao_min} min` : null,
    e ? formatarCusto(e.custo_centavos) : null,
    e ? NOME_DIFICULDADE[e.dificuldade] : null,
  ].filter((x): x is string => Boolean(x));

  /**
   * O título encolhe conforme cresce, senão um nome longo estoura o cartão.
   * Os cortes saíram de medir os títulos que já existem no banco.
   */
  const tamanhoDoTitulo =
    titulo.length > 62 ? 62 : titulo.length > 40 ? 74 : 88;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: CREME,
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: VERDE,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 4,
              color: TINTA_3,
              display: "flex",
            }}
          >
            IFESCIÊNCIA
            {e ? ` · ${NOME_AREA[e.area].toUpperCase()}` : ""}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: tamanhoDoTitulo,
              lineHeight: 1.08,
              fontWeight: 700,
              color: TINTA,
              display: "flex",
            }}
          >
            {titulo}
          </div>

          {gancho ? (
            <div
              style={{
                marginTop: 26,
                fontSize: 30,
                lineHeight: 1.4,
                color: TINTA_2,
                display: "flex",
                maxWidth: 900,
              }}
            >
              {gancho.length > 116 ? gancho.slice(0, 113) + "…" : gancho}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${BORDA}`,
            paddingTop: 30,
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {etiquetas.map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  background: CREME_2,
                  border: `2px solid ${BORDA}`,
                  borderRadius: 999,
                  padding: "12px 26px",
                  fontSize: 27,
                  color: TINTA_2,
                }}
              >
                {t}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 27, color: VERDE, display: "flex" }}>
            materiais e passo a passo
          </div>
        </div>
      </div>
    ),
    size,
  );
}
