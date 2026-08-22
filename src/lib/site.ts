/**
 * O endereço público do site, num lugar só.
 *
 * Três coisas precisam dele e nenhuma pode chutar: o cartão de link que o
 * WhatsApp monta, a imagem de compartilhamento e o rodapé do PDF impresso.
 * Espalhado, bastaria comprar o domínio e esquecer de um deles pra ficha
 * fotocopiada mandar a professora pro endereço antigo.
 *
 * A ordem tenta o que é estável primeiro. `NEXT_PUBLIC_SITE_URL` é o domínio
 * de verdade quando ele existir; `VERCEL_PROJECT_PRODUCTION_URL` é o endereço
 * fixo do projeto na Vercel, que não muda a cada deploy — diferente de
 * `VERCEL_URL`, que é único por deploy e faria um cartão de link apontar pra
 * uma versão velha do site.
 */
export const enderecoDoSite =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://site-ifesciencia.vercel.app");
