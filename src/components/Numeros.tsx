import { NumeroQueSobe } from "./NumeroQueSobe";
import { FaixaCorrendo } from "./FaixaCorrendo";
import { formatarAlcance } from "@/lib/tipos";
import type { Ajustes } from "@/lib/tipos";

/**
 * Os números vêm do banco, não do código.
 *
 * Escritos à mão eles envelheciam em silêncio: em seis meses estariam
 * mentindo, e corrigir exigiria um programador. Agora a equipe atualiza
 * pelo painel em dez segundos.
 */
export function Numeros({ ajustes }: { ajustes: Ajustes }) {
  const seguidores = formatarAlcance(ajustes.seguidores);
  const visualizacoes = formatarAlcance(ajustes.visualizacoes);

  return (
    <section className="border-y border-borda bg-creme-2">
      <div className="mx-auto w-full max-w-[1240px] px-6 py-14">
        <p className="mb-10 font-mono text-xs uppercase tracking-[0.18em] text-tinta-3">
          Alcance
        </p>

        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <NumeroQueSobe
              valor={seguidores.valor}
              sufixo={seguidores.sufixo}
              decimais={seguidores.decimais}
              className="font-titulo text-5xl font-bold text-verde lg:text-6xl"
            />
            <p className="mt-3 max-w-[16rem] text-sm text-tinta-2">
              pessoas acompanham o projeto
            </p>
          </div>

          <div>
            <NumeroQueSobe
              valor={visualizacoes.valor}
              sufixo={visualizacoes.sufixo}
              decimais={visualizacoes.decimais}
              className="font-titulo text-5xl font-bold text-verde lg:text-6xl"
            />
            <p className="mt-3 max-w-[16rem] text-sm text-tinta-2">
              de visualizações acumuladas
            </p>
          </div>

          {ajustes.destaque_valor ? (
            <div>
              <p className="font-titulo text-5xl font-bold text-verde lg:text-6xl">
                {ajustes.destaque_valor}
              </p>
              <p className="mt-3 max-w-[16rem] text-sm text-tinta-2">
                {ajustes.destaque_rotulo}
              </p>
            </div>
          ) : null}
        </div>

        {ajustes.nota ? (
          <p className="mt-12 max-w-lg text-tinta-2">{ajustes.nota}</p>
        ) : null}
      </div>

      {ajustes.imprensa.length > 0 ? (
        <FaixaCorrendo itens={ajustes.imprensa} />
      ) : null}
    </section>
  );
}
