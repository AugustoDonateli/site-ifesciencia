import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Onde o link do e-mail cai.
 *
 * O link não traz a sessão pronta: traz um código de uso único que precisa ser
 * trocado pela sessão — e essa troca tem que acontecer no servidor, senão os
 * cookies não são gravados e a dashboard, que confere o login no servidor,
 * continua achando que ninguém entrou.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("code");
  const erroDoLink = searchParams.get("error_description");

  // Atrás do proxy da Vercel, request.url aponta para o endereço interno.
  // Quem sabe o endereço público de verdade é este cabeçalho.
  const hospedeiro = request.headers.get("x-forwarded-host") ?? request.nextUrl.host;
  const protocolo = request.headers.get("x-forwarded-proto") ?? "https";
  const base = `${protocolo}://${hospedeiro}`;

  if (erroDoLink || !codigo) {
    return NextResponse.redirect(
      `${base}/dashboard/entrar?erro=${encodeURIComponent(
        erroDoLink ?? "Link inválido ou já usado.",
      )}`,
    );
  }

  const armazem = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => armazem.getAll(),
        setAll: (novos) =>
          novos.forEach(({ name, value, options }) =>
            armazem.set(name, value, options),
          ),
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(codigo);

  if (error) {
    return NextResponse.redirect(
      `${base}/dashboard/entrar?erro=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${base}/dashboard`);
}
