import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { RolagemSuave } from "@/components/RolagemSuave";
import { enderecoDoSite } from "@/lib/site";
import "./globals.css";

// Títulos: personalidade.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

// Texto corrido: neutro e legível, porque a ficha do experimento é pra ler.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Cartão de link exige URL absoluta: o WhatsApp busca a imagem a partir do
 * servidor dele, não do navegador de quem clicou, então caminho relativo não
 * chega a lugar nenhum. É por isso que existe uma base.
 */
export const metadata: Metadata = {
  metadataBase: new URL(enderecoDoSite),
  title: "Ifesciência",
  description: "Ciência como você nunca viu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${bricolage.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RolagemSuave />
        {children}
      </body>
    </html>
  );
}
