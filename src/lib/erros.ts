/**
 * O Supabase responde em inglês e em linguagem de banco de dados. Ninguém da
 * equipe deveria precisar traduzir "duplicate key value violates unique
 * constraint" pra entender que já existe um experimento com aquele endereço.
 */
export function traduzirErro(mensagem: string) {
  const m = mensagem.toLowerCase();

  if (m.includes("duplicate key") && m.includes("slug"))
    return "Já existe um experimento com esse endereço. Mude o campo Endereço.";
  if (m.includes("duplicate key"))
    return "Esse registro já existe.";
  if (m.includes("invalid login credentials"))
    return "E-mail ou senha não conferem.";
  if (m.includes("already registered"))
    return "Esse e-mail já tem acesso. Use a opção de entrar.";
  if (m.includes("rate limit"))
    return "Muitas tentativas seguidas. Espere alguns minutos.";
  if (m.includes("row-level security") || m.includes("permission denied"))
    return "Sua conta não tem permissão para isso. Confira se o seu e-mail está na lista da equipe.";
  if (m.includes("violates not-null"))
    return "Faltou preencher um campo obrigatório.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Sem conexão com o servidor. Confira a internet e tente de novo.";
  if (m.includes("jwt") || m.includes("session"))
    return "Sua sessão expirou. Entre de novo.";

  return mensagem;
}
