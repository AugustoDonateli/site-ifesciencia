import { ImageResponse } from "next/og";
import { buscarAjustes } from "@/lib/supabase";
import { formatarAlcance } from "@/lib/tipos";

/**
 * O cartão de quando alguém manda o endereço do site.
 *
 * É o mais importante dos dois: o link da bio do Instagram aponta pra cá, e é
 * daqui que a professora repassa no grupo da escola. A da ficha do experimento
 * existe desde antes; esta faltava, e era o caso mais usado.
 *
 * Os números saem do banco pelo mesmo caminho da seção Alcance. Escritos à mão
 * aqui, envelheceriam calados — e cartão de link é justamente o que fica
 * guardado em conversa antiga.
 */
export const alt = "Ifesciência — ciência como você nunca viu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREME = "#faf7ef";
const TINTA = "#17170f";
const TINTA_2 = "#5c594c";
const TINTA_3 = "#8a8674";
const VERDE = "#2f9e44";
const TOMATE = "#e23d28";
const BORDA = "#e3decf";

export default async function Imagem() {
  const ajustes = await buscarAjustes().catch(() => null);
  const seguidores = ajustes ? formatarAlcance(ajustes.seguidores) : null;
  const visualizacoes = ajustes ? formatarAlcance(ajustes.visualizacoes) : null;

  const numeros = [
    seguidores
      ? [`${seguidores.valor}${seguidores.sufixo}`, "acompanham"]
      : null,
    visualizacoes
      ? [`${visualizacoes.valor}${visualizacoes.sufixo}`, "de visualizações"]
      : null,
    ajustes?.destaque_valor ? [ajustes.destaque_valor, "Prêmio iBest"] : null,
  ].filter(Boolean) as [string, string][];

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
            IFESCIÊNCIA · IFES CACHOEIRO DE ITAPEMIRIM
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
          {/* O bordão, com a palavra em destaque na cor que o site usa
              pra destacar — é assim que ele aparece na abertura. */}
          <div
            style={{
              display: "flex",
              fontSize: 86,
              lineHeight: 1.05,
              fontWeight: 700,
              color: TINTA,
            }}
          >
            Ciência como você
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 86,
              lineHeight: 1.05,
              fontWeight: 700,
              color: TINTA,
            }}
          >
            <span style={{ color: TOMATE }}>nunca</span>
            <span>&nbsp;viu</span>
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.4,
              color: TINTA_2,
              display: "flex",
              maxWidth: 900,
            }}
          >
            Experimentos com materiais simples, com o passo a passo para repetir
            em sala de aula.
          </div>
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
          <div style={{ display: "flex", gap: 46 }}>
            {numeros.map(([valor, rotulo]) => (
              <div
                key={rotulo}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: VERDE,
                    display: "flex",
                  }}
                >
                  {valor}
                </div>
                <div
                  style={{ fontSize: 22, color: TINTA_3, display: "flex" }}
                >
                  {rotulo}
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 26, color: TINTA_3, display: "flex" }}>
            para professores
          </div>
        </div>
      </div>
    ),
    size,
  );
}
