import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Renova a sessão a cada navegação. Sem isto o login expira sozinho e a
 * equipe é deslogada no meio do cadastro de um experimento.
 *
 * Roda só na dashboard: o resto do site é público e não precisa de sessão,
 * e checar sessão em página pública custaria tempo à toa.
 */
export async function middleware(request: NextRequest) {
  let resposta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesNovos) => {
          cookiesNovos.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          resposta = NextResponse.next({ request });
          cookiesNovos.forEach(({ name, value, options }) =>
            resposta.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  return resposta;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
