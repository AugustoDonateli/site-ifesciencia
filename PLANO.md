# Plano por etapas — Site Ifes Ciência

Base: todas as decisões do [BRIEFING.md](BRIEFING.md) (D1 a D19).
**Uma etapa por vez.** Cada etapa termina com algo que dá para olhar e aprovar antes da próxima.

---

## Stack

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | **Next.js (App Router)** | Não é por SEO (descartado em D5). É porque o **preview de link no WhatsApp exige HTML gerado no servidor** — um site puramente de navegador não consegue ter uma imagem de compartilhamento por experimento. Também otimiza imagem sozinho, o que importa em celular fraco. |
| Estilo | Tailwind | Já definido pelo Augusto. |
| Banco / login / arquivos | Supabase | Já definido pelo Augusto. |
| Hospedagem | Vercel | Já definido pelo Augusto. |
| Animação | **GSAP + ScrollTrigger** (gratuito desde 2025) e **Lenis** para o peso do scroll | Padrão atual para as mecânicas da seção 9. |
| Componentes da dashboard | shadcn/ui + 21st.dev | Só na dashboard. **Nunca na landing** (D10). |

---

## Etapa 0 — Fundação e deploy vazio ✅ CONCLUÍDA

**No ar:** https://site-ifesciencia.vercel.app
Todo `git push` na branch `main` atualiza o site sozinho.


**Objetivo:** o cano inteiro funcionando antes de existir qualquer tela.

- [x] Next.js 16 (App Router) + TypeScript + Tailwind 4 instalados.
- [x] Página provisória "em obras" com o bordão no rodapé.
- [x] `.env.example` com as variáveis do Supabase (etapa 2).
- [x] `npm run build` passando limpo.
- [x] Repositório privado no GitHub: **AugustoDonateli/site-ifesciencia**.
- [x] **Deploy na Vercel** ligado ao GitHub.

**Como conferir:** você abre o endereço da Vercel no celular e vê a página.

> Deploy funcionando na etapa 0 evita a pior surpresa possível: descobrir na etapa 9 que
> alguma coisa não sobe.

---

## Etapa 1 — Identidade e peças básicas ✅ CONCLUÍDA

**Amostra:** https://site-ifesciencia.vercel.app/amostra

**Objetivo:** travar a aparência antes de construir qualquer seção em cima dela.

- Paleta fechada a partir do verde de vocês (D13) + tons de apoio.
- Tipografia: uma família para títulos, uma para texto.
- Peças básicas: botão, etiqueta, card, título de seção, espaçamentos.
- Uma página de amostra mostrando tudo junto.

**Como conferir:** você olha a página de amostra e aprova ou pede ajuste de cor/fonte.
**Preciso de você:** a logo, se já tiver. Se não tiver, uso um marcador e troco depois.

---

## Etapa 2 — Banco de dados

**Objetivo:** a estrutura que guarda os experimentos.

- Tabela de experimentos com todos os campos da D19 (obrigatórios e opcionais).
- Armazenamento de imagens e de PDF próprio.
- Regras de acesso: qualquer um lê o que está publicado; só a equipe escreve.
- 2 ou 3 experimentos de mentira cadastrados à mão, só para as próximas etapas terem o que mostrar.

**Como conferir:** eu te mostro a tabela preenchida no painel do Supabase.
**Preciso de você:** o projeto no Supabase. *(Posso criar por aqui se você preferir — tenho acesso.)*

---

## Etapa 3 — Landing, só a estrutura

**Objetivo:** a página inteira montada, **sem nenhuma animação**.

Seções, na ordem: menu · hero · números · sobre + métricas + equipe (bloco único, D17) ·
chamada pro catálogo · rodapé.
Marcadores cinzas no lugar das fotos (seção 10 do briefing). Textos provisórios.

**Como conferir:** você rola a página no celular e no computador e diz se a ordem e o peso
de cada seção estão certos.

> Estrutura antes de movimento. Animar um layout que ainda vai mudar é trabalho jogado fora.

---

## Etapa 4 — As mecânicas da landing

**Objetivo:** dar vida à etapa 3, seguindo a tabela da seção 9 do briefing.

- Máquina de escrever no hero (a palavra trocando).
- Título entrando em cascata no carregamento.
- Botão magnético (só computador).
- Números que sobem.
- Faixa correndo com a imprensa.
- Seção presa no "sobre" (texto parado, imagens trocando).
- Menu que encolhe ao descer.
- Rodapé que aparece por trás.
- Chamada pro catálogo **sem efeito nenhum**, de propósito.

**Como conferir:** você sente a página. Aqui é onde você diz "esse aqui ficou demais" ou
"esse ficou irritante" — e eu ajusto ou removo.

---

## Etapa 5 — A galeria da equipe

**Objetivo:** a mecânica mais difícil do site, sozinha, com atenção total.

- **Computador:** a página prende e os integrantes passam de lado.
- **Celular:** arrasta com o dedo e freia com inércia.
- São duas construções diferentes, não uma desligada no celular (D11 + seção 9).
- Entrada e saída do travamento com cuidado especial — é onde essas galerias costumam parecer quebradas.

**Como conferir:** testar no seu celular, **dentro do navegador do Instagram** (D5). Esse é o
teste que vale.

---

## Etapa 6 — Catálogo

**Objetivo:** a lista de experimentos, lendo do banco.

- Grade de cards, mais novo primeiro.
- Filtro por área: Física / Química / Biologia. Sem busca.
- Cards entrando em cascata.
- Prévia do vídeo ao passar o mouse (computador).
- Capa puxada automaticamente do YouTube.

**Como conferir:** você navega, filtra e vê os experimentos de teste aparecendo.

---

## Etapa 7 — Ficha do experimento

**Objetivo:** a página mais importante do site.

- Todos os blocos da D19, com os opcionais **sumindo quando vazios**.
- Índice lateral acompanhando o scroll.
- Barra de progresso.
- Transição do card do catálogo virando o vídeo da ficha.
- Endereço curto e falável (D7).
- Legível no celular dentro do Instagram, sem baixar nada (D6).

**Como conferir:** abrir uma ficha pelo celular, pelo Instagram, e conseguir entender o
experimento inteiro sem sair da página.

---

## Etapa 8 — Dashboard

**Objetivo:** vocês publicarem sozinhos, para sempre.

- Login por e-mail, liberado só para a equipe (D3).
- Listar, criar, editar e apagar experimento.
- Rascunho antes de publicar.
- Reordenar arrastando.
- Subir imagens.
- Formulário com os campos separados entre obrigatórios e opcionais (D19).

**Como conferir:** **você cadastra um experimento de verdade, do zero, sem me chamar.**
Se der para fazer sozinho, a etapa passou.

---

## Etapa 9 — PDF e compartilhamento

**Objetivo:** as duas saídas automáticas.

- PDF gerado a partir dos campos, feito para imprimir em preto e branco.
- Campo para subir um PDF próprio, que substitui o gerado (D15).
- Imagem de compartilhamento gerada sozinha para cada experimento (D5).

**Como conferir:** mandar o link de um experimento no WhatsApp e ver o cartão bonito aparecer.

---

## Etapa 10 — Acabamento

**Objetivo:** o site aguentar o mundo real.

- Teste em Android mediano dentro do navegador do Instagram.
- Respeitar quem desligou animações no sistema.
- Compressão de imagem, velocidade de carregamento.
- Favicon, título das abas, página de erro.
- Domínio próprio apontado.
- Troca dos marcadores pelas fotos de verdade.

**Como conferir:** abrir pelo link da bio, num celular comum, com internet ruim, e o site
continuar bom.

---

---

## Regra do processo: conversa antes de cada etapa

**Nenhuma etapa visual começa sem uma conversa antes.** Antes de 1, 3, 4, 5, 6 e 7 a gente
para e decide duas coisas:

1. **Mecânicas** — a tabela da seção 9 do briefing é um ponto de partida, não uma lei.
   Cada etapa pode ganhar, perder ou trocar mecânica conforme a página vai tomando forma.
2. **Personalização** — o que daquela seção pode carregar uma marca registrada do Ifes Ciência
   (seção 11 do briefing) em vez de ser genérica.

E depois de cada etapa, a mesma conversa ao contrário: o que ficou bom, o que irritou,
o que sai fora.

---

## Ordem e dependências

```
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10
              └──────────┘        └── precisa da 2
```

- **3, 4 e 5** são a landing e não dependem do banco.
- **6, 7, 8 e 9** dependem da etapa 2.
- **10** é a última, sempre.

## O que preciso de você, e quando

| Quando | O quê |
|---|---|
| Etapa 0 | GitHub e Vercel |
| Etapa 1 | A logo (ou sigo com marcador) |
| Etapa 2 | Projeto no Supabase (ou eu crio) |
| Etapa 3 | Os textos da landing e as palavras da máquina de escrever |
| Etapa 5 | As 5 fotos da equipe, mesma proporção — ou marcadores |
| Etapa 10 | Domínio comprado e todas as fotos de verdade |

**Nada disso trava o começo.** Dá para ir até a etapa 4 sem você mandar uma foto sequer.
