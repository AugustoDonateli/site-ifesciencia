/**
 * Espaço reservado para as fotos que o Augusto vai mandar (seção 10 do briefing).
 * Trocar por <Image> na etapa 10 — o layout já está no lugar certo.
 */
export function Marcador({
  proporcao,
  rotulo,
  className = "",
}: {
  proporcao: string;
  rotulo: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-borda bg-creme-2 ${className}`}
      style={{ aspectRatio: proporcao }}
    >
      <span className="px-3 text-center font-mono text-[11px] leading-relaxed text-tinta-3">
        {rotulo}
        <br />
        {proporcao.replace("/", ":")}
      </span>
    </div>
  );
}
