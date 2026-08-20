"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { criarClienteNavegador } from "@/lib/supabase-navegador";

/**
 * Envia um arquivo e devolve o endereço público dele.
 *
 * O nome no armazenamento é sorteado de propósito: nome de arquivo de celular
 * vem com acento, espaço e til, e isso quebra endereço. Além disso, dois
 * "foto.jpg" de pessoas diferentes se sobrescreveriam.
 */
export function EnviarArquivo({
  balde,
  valor,
  aoMudar,
  rotulo,
  imagem = true,
}: {
  balde: "imagens" | "pdfs";
  valor: string | null;
  aoMudar: (url: string | null) => void;
  rotulo: string;
  imagem?: boolean;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const entrada = useRef<HTMLInputElement>(null);

  const enviar = async (arquivo: File) => {
    setEnviando(true);
    setErro(null);

    const supabase = criarClienteNavegador();
    const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "bin";
    const caminho = `${crypto.randomUUID()}.${extensao}`;

    const { error } = await supabase.storage
      .from(balde)
      .upload(caminho, arquivo, { cacheControl: "31536000" });

    if (error) {
      setErro(error.message);
      setEnviando(false);
      return;
    }

    const { data } = supabase.storage.from(balde).getPublicUrl(caminho);
    aoMudar(data.publicUrl);
    setEnviando(false);
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{rotulo}</p>

      {valor ? (
        <div className="flex items-center gap-4">
          {imagem ? (
            <Image
              src={valor}
              alt=""
              width={160}
              height={200}
              className="h-28 w-24 rounded-lg border border-borda object-cover"
            />
          ) : (
            <a
              href={valor}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-verde-escuro underline underline-offset-4"
            >
              Ver arquivo
            </a>
          )}
          <button
            type="button"
            onClick={() => aoMudar(null)}
            className="rounded-full border border-borda px-4 py-2 text-sm text-tinta-2 transition-colors hover:border-tomate hover:text-tomate"
          >
            Remover
          </button>
        </div>
      ) : (
        <>
          <input
            ref={entrada}
            type="file"
            accept={imagem ? "image/*" : "application/pdf"}
            className="hidden"
            onChange={(e) => {
              const arquivo = e.target.files?.[0];
              if (arquivo) enviar(arquivo);
            }}
          />
          <button
            type="button"
            onClick={() => entrada.current?.click()}
            disabled={enviando}
            className="rounded-full border border-borda px-5 py-2.5 text-sm text-tinta-2 transition-colors hover:border-tinta-3 hover:text-tinta disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Escolher arquivo"}
          </button>
        </>
      )}

      {erro ? <p className="mt-2 text-sm text-tomate">{erro}</p> : null}
    </div>
  );
}
