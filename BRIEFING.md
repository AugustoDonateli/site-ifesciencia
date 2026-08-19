# Briefing — Site Ifes Ciência

> Documento vivo. Tudo que a gente conversar e decidir entra aqui.
> Enquanto isso, **nenhuma linha de código é escrita**. Só planejamento.
> Última atualização: 16/08/2026

---

## 0. Contexto do projeto (pesquisa inicial)

- **Ifes Ciência** (@ifesciencia) — projeto de divulgação científica do **Ifes, campus Cachoeiro de Itapemirim (ES)**.
- Começou em **2022**. Feito pelos próprios alunos (cursos de Mecânica / Eng. Mecânica entre outros).
- Professor orientador citado na imprensa: **Hilton Moulin**.
- Linguagem: humor, analogias e situações do cotidiano para explicar conceitos complexos.
- Alcance: **~500 mil seguidores** (número atualizado pelo Augusto; a imprensa de jul/2026 falava em 360 mil),
  **13 milhões+ de visualizações**, um vídeo isolado com **10M+**.
- **Finalista do Prêmio iBest 2026**, categoria Ciências.
- Vídeo mais citado pela imprensa: o experimento do **copo térmico**.

*(A confirmar com o Augusto: números atualizados, nomes da equipe, papéis, orientadores.)*

---

## 1. O que o site é

Duas coisas em um só domínio:

1. **Landing / institucional** — quem é o Ifes Ciência, a equipe, a história do projeto, métricas, imprensa, prêmios. Peça de *identidade e orgulho*.
2. **Biblioteca de experimentos** — cada vídeo vira uma "receita" replicável em sala de aula: materiais, passo a passo, PDF, link do vídeo, e tudo que um professor precisa para reproduzir aquilo.
3. **Dashboard privado** — só a equipe do Ifes Ciência entra. É onde os experimentos são cadastrados, com campos personalizáveis.

**Público-alvo primário do site:** professores (não o seguidor do Instagram).

---

## 2. Stack (definido pelo Augusto)

| Camada | Escolha |
|---|---|
| Hospedagem | Vercel |
| Banco / auth / storage | Supabase |
| Front | React (framework a definir — ver "Em aberto") |
| Estilo | Tailwind |

---

## 3. Direção criativa (o que já sabemos)

- **Não pode parecer feito por IA.** Nada de template genérico.
- Muita **personalidade**.
- Mecânicas de scroll modernas e bem executadas — ex.: **galeria horizontal com scroll-hijack** (a página trava, a galeria passa lateralmente, depois a página volta a rolar).
- Interatividade de verdade, não decoração.
- Fotos reais da equipe e do projeto serão fornecidas pelo Augusto — vamos definir onde cada uma entra.

---

## 4. Decidido

**D1 — Vídeos.** O acervo existe no **YouTube e no TikTok**, além do Instagram.
→ Consequência: a página de experimento usa **YouTube** como player (funciona em rede de escola,
não pede login, tem legenda, velocidade e roda em projetor). Instagram/TikTok ficam para a landing,
onde o formato vertical e o clima de rede social são um ganho, não um problema.

**D2 — Público.** **Qualquer professor(a) de qualquer escola do Brasil.** Não é só o Ifes,
não é só escola pública, não é só o Espírito Santo.
→ Consequências: mobile-first de verdade; internet ruim como cenário padrão; PDF que imprime
bem em preto e branco; lista de materiais com **preço aproximado e substituições**;
busca/filtro por ano escolar, disciplina, tempo de aula e custo; **SEO é a porta de entrada
principal** (professor acha no Google, não na bio do Instagram).

**D3 — Equipe.** **5 pessoas** hoje.
→ Consequência: autenticação simples. Supabase Auth com lista de e-mails autorizados,
um papel único de admin (talvez um "dono" que convida). Sem sistema de permissões complexo.

**D4 — Direção criativa.** Quatro palavras do Augusto: **clareza, confiança, muitas animações,
brincar com as palavras.**

**D5 — Porta de entrada.** O acesso principal é o **link da bio do Instagram**, não o Google.
O foco é quem **já conhece** o Ifes Ciência. SEO é bem-vindo, mas não é a estratégia.
→ Consequências (grandes):
- O visitante chega pelo **navegador interno do Instagram (WebView)**, não pelo Chrome/Safari.
  Ambiente hostil: PDF abre mal ou não abre, download é pouco confiável, `100vh` mente por causa
  das barras do app. **O PDF não pode ser o entregável principal** — ver D6.
- Mobile não é "importante", mobile **é o site**. Desktop é o segundo caso (a professora volta
  no computador na hora de imprimir e planejar).
- A landing não precisa convencer que o projeto é legal — quem chega já gosta. Ela precisa
  converter esse carinho em **uso**.
- O canal de distribuição que substitui o Google é o **compartilhamento em WhatsApp/DM entre
  professores**. Logo: **imagem de preview (Open Graph) de cada experimento vira entregável
  de design**, não detalhe técnico.
- A URL precisa ser curta e falável em voz alta dentro dos vídeos.

**D6 — A ficha do experimento é uma página, o PDF é para impressão.**
Consequência direta de D5: a página em si tem que ser o guia completo, legível no celular,
dentro do app do Instagram. O PDF existe para quem vai imprimir e levar para a sala — não para
quem está lendo pela primeira vez.

**D7 — Link direto por vídeo.** Cada post novo leva um link próprio para a ficha daquele
experimento (não para a home). → URLs curtas, faláveis em voz alta e estáveis para sempre.

**D8 — Acervo pequeno: ~20 experimentos no lançamento**, crescendo devagar.
→ Busca e filtro deixam de ser prioridade no lançamento (mas o sistema tem que aguentar crescer).

**D9 — Público mais amplo do que "só professor".**
Professores são o principal, mas também: **pais e mães** querendo fazer em casa com os filhos,
e **curiosos** que acham legal e **encaminham para um professor conhecido**.
→ Confirma a importância da imagem de compartilhamento (D5).
→ Proposta de estrutura: **núcleo comum + camada "para a sala de aula"** (ver sessão 4).

**D10 — A regra que organiza o site inteiro (corrigida pelo Augusto na sessão 5):**

> **A landing é feita à mão. O catálogo é um sistema.**

A landing é escrita uma vez, no código, e nunca muda sozinha → ali cabe animação sob medida,
gesto único, capricho individual, espetáculo.
O catálogo nasce de formulário preenchido na dashboard → ali **nada** pode depender de
alguém programar algo a mais. Experimento novo entra sozinho, bonito, sem ninguém tocar em código.

**D11 — Galeria horizontal = seção da EQUIPE, na landing.** Não é o catálogo de vídeos.
O usuário rola, a página prende, e cada integrante passa lateralmente com foto e nome.
Depois a página volta a rolar normalmente.
→ **Fica fixa no código** (não entra na dashboard). Cada card tem **só foto + nome** —
sem curso, sem função, sem frase, sem @.
→ Professor orientador: **Hilton** Moulin (confirmado).

**D13 — ✅ PALETA E TIPOGRAFIA — fechadas na etapa 1.**

| Papel | Cor | Uso |
|---|---|---|
| Fundo | `#FAF7EF` creme | O fundo do site. **Não é branco puro** — cansa menos a vista à noite. |
| Fundo 2 | `#F3EFE4` | Cards e blocos. |
| Borda | `#E3DECF` | Fios e divisórias. |
| Tinta | `#17170F` | Texto principal. |
| Tinta suave | `#5C594C` | Texto secundário. |
| **Verde** | `#2F9E44` | A marca. Botões, etiquetas de área. |
| **Tomate** | `#E23D28` | **As palavras importantes.** Escolhido pelo Augusto. |
| Âmbar | `#B45309` | **Avisos e segurança.** |

**Por que o âmbar existe:** o tomate virou a cor de destaque, então ele não pode ser
também a cor de perigo — aviso de segurança e palavra importante ficariam iguais e ninguém
enxergaria o aviso. O âmbar resolve isso.

**Sem modo escuro** (decisão do Augusto): dobraria o trabalho de toda etapa e o público
chega pelo Instagram, de dia, em celular comum.

**Tipografia:** títulos em **Bricolage Grotesque** (a personalidade mora aqui),
texto corrido em **Inter** (neutro, porque a ficha do experimento é para ler).
Nunca a mesma fonte nos dois — é o que dá cara de modelo pronto.

*(O verde é aproximado de uma imagem de 150px da logo. Quando chegar o arquivo bom,
pego a cor exata.)*

**D14 — A regra mais importante do projeto (corrigida três vezes pelo Augusto).**

> **Estrutura convencional + detalhes de interação muito bons.**

O site é de estrutura padrão de mercado: hero com título, subtítulo, botões e imagem; seções
normais abaixo. O que faz ele se destacar são as **mecânicas** — a máquina de escrever, a galeria
horizontal, o card que vira vídeo.
**Não é para reinventar conceito visual.** Nada de metáfora, nada de estética de caderno, nada de
abertura em vídeo. Mas também **não é para ser simplório**: o diferencial está nos detalhes,
e eles têm que ser caprichados.

*(Erros meus, registrados para não repetir: tipografia cinética por experimento, abertura em
vídeo que encolhe, direção "papel e marca-texto" com o copo. Todos descartados pelo Augusto.)*

**D12 — Tudo que aparece na ficha de um experimento tem que sair de um campo do formulário.**
Regra de ouro derivada de D10. Vale para texto, imagem, cor, ícone, ordem — e para animação.
Se uma ideia não sobrevive a "isso dá para preencher numa caixinha?", a ideia morre.

**❌ Descartado — tipografia cinética por experimento.** A ideia das palavras se comportando
como o fenômeno (GRAVIDADE caindo, INÉRCIA continuando) **não vai acontecer no catálogo**:
exigiria programar uma animação nova a cada vídeo enviado, o que quebra D10 e D12.
"Brincar com as palavras" continua valendo — mas mora **na landing**, que é território feito à mão.

---

## 5. Em aberto (fila de conversa)

- [ ] **Fotos do projeto + logo** — Augusto vai mandar. Fecham a paleta e a tipografia.
- [ ] Versão mobile de cada mecânica de scroll (risco real — ver seção 7).
- [ ] Textos da landing (hero, sobre, chamada final) e as palavras da máquina de escrever.

---

## 10. Espaços de imagem (Augusto preenche depois)

O site é construído com os lugares já reservados e marcadores no lugar das fotos.
Trocar depois é só subir o arquivo — nada de mexer em layout.

| Onde | Quantas | Proporção | Formato |
|---|---|---|---|
| Logo (topo e rodapé) | 1 | livre | SVG, ou PNG com fundo transparente |
| Hero | 1 | 1:1 ou 4:5 | JPG |
| Sobre + métricas (seção presa) | 3 a 5 | 3:2 deitada | JPG |
| **Equipe** | 5 | **3:4 em pé, todas iguais** | JPG |
| Faixa da imprensa | logos dos veículos | livre | PNG transparente |
| Capa do experimento | 1 por experimento | 16:9 | **puxada automaticamente do YouTube**, com campo opcional para subir outra |
| Fotos do passo a passo | opcional, por passo | 4:3 | JPG |
| Compartilhamento (WhatsApp) | — | 1200×630 | **gerada sozinha** |
| Favicon | — | — | derivado da logo |

**Importante:** as 5 fotos da equipe precisam ter a **mesma proporção** e, de preferência,
enquadramento parecido. É o que faz a galeria horizontal parecer profissional em vez de
colagem. Mandar em alta — o site comprime sozinho. Evitar print de tela.

---

## 11. Nossa cara — marcas registradas do Ifes Ciência

> Lista viva. Tudo que é *de vocês* e pode virar detalhe do site em vez de decoração genérica.
> Conversar sobre isso ao longo de toda a construção (ver a regra de processo no PLANO.md).

### Confirmadas

**🔑 "Ciência como você nunca viu"** — frase que fecha os vídeos.
→ **Proposta de uso:** ela é um *fecho*, então fecha coisas no site também.
Aparece no fim da landing **e no fim de cada ficha de experimento** — do mesmo jeito que
encerra cada vídeo. Quem conhece vocês vai reconhecer na hora; quem não conhece leva
um bordão de brinde. Custo: zero. É texto fixo, não quebra D12.

**🔑 A tese da marca** (o *porquê* do bordão, dito pelo Augusto):
> A gente traz a ciência de um jeito mais divertido, **diferente do que é ensinado na escola.**

→ Isso é o posicionamento do projeto inteiro, e vale para escrever todo texto do site:
o Ifesciência é o **contrário da aula chata**. Toda vez que um texto puder soar como livro
didático, está errado.

**👕 A camiseta do Ifes é o uniforme oficial do projeto.**
→ Aparece em foto de equipe, foto de experimento e vídeo. É elemento de identidade,
não coincidência — e reforça a confiança (tem instituição por trás).

**✍️ Grafia oficial: `Ifesciência`** — uma palavra só, I maiúsculo, acento no e.
Vale para o site inteiro, título de aba, textos e domínio.

### Ainda a levantar
- Frase ou gesto de **abertura** dos vídeos (o gancho)?
- Como vocês chamam quem assiste?
- Objeto, som ou trilha que sempre aparece?
- [ ] Formato do catálogo (vertical? grade? lista?) — reaberto, já que a galeria horizontal foi
      realocada para a equipe. Depende da identidade visual.
- [ ] A **equipe** também é cadastrada pela dashboard, ou fica fixa no código?
      (Aluno se forma, entra gente nova todo ano — isso muda com o tempo.)
- [ ] Confirmar o nome do professor: **Hilton** Moulin (imprensa) ou Wilton?
- [ ] Como o PDF é gerado — feito à mão e enviado, ou gerado pelo site a partir dos campos?
- [ ] Onde exatamente entram as fotos da equipe e do projeto.
- [ ] Framework: Next.js (App Router) x Vite + React Router. *(D2 empurra forte para Next.)*
- [ ] Domínio próprio — **Augusto ainda vai comprar.**
- [ ] Fotos e nomes da equipe — **Augusto vai mandar.**
**Decididos por mim ("o resto faz do seu jeito") — reversíveis se o Augusto discordar:**
- **Contato:** sem formulário. Link para o Instagram + um e-mail. Zero manutenção, e o público
  já vive no Instagram.
- **Catálogo:** filtro por área (Física / Química / Biologia), ordem padrão do mais novo para o
  mais antigo. **Sem campo de busca** — com 20 itens ele só ocupa espaço.
- **Dashboard:** login por e-mail; rascunho antes de publicar; reordenar arrastando;
  apagar com confirmação.
- [ ] O que acontece com um experimento que ainda não tem PDF/ficha pronta.

---

## 6. Log da conversa

**16/08/2026 — sessão 1**
- Augusto apresentou a ideia geral do projeto e as restrições (ver seções 1–3).
- Pesquisa inicial sobre o @ifesciencia feita.
- Regra combinada: conversar muito antes de qualquer plano ou código. O plano será por etapas,
  executadas uma a uma.
- Levantada a tensão central: landing espetáculo x biblioteca utilitária.

**16/08/2026 — sessão 2**
- Respondidas as três perguntas → viraram D1, D2 e D3.
- Direção criativa recebida (D4).
- Proposta em cima da mesa: **tipografia cinética como identidade** — as palavras se comportam
  como o fenômeno que nomeiam. Aguardando reação do Augusto.
- Proposta em cima da mesa: **orçamento de animação** — a landing gasta, a biblioteca economiza.

**16/08/2026 — sessão 3**
- Augusto corrigiu a premissa de SEO: a entrada é a bio do Instagram → virou D5, e D5 gerou D6.
- Pendentes desde a sessão 2 (Augusto ainda não respondeu, mensagem foi cortada no meio):
  identidade visual existente, tamanho do acervo, e se a equipe topa catalogar BNCC.
- Nova pergunta aberta: como uma professora que **não** segue o perfil descobre o site?

**16/08/2026 — sessão 4**
- Confirmado o link direto por vídeo (D7), o tamanho do acervo (D8) e o público real (D9).
- Número de seguidores atualizado para ~500 mil.
- A tensão central da sessão 1 foi reescrita como D10.
- Dashboard já estava definido desde a sessão 1 (5 pessoas, campos personalizáveis) — o que falta
  é desenhar **quais** campos, e isso é o próximo tema.

**16/08/2026 — sessão 5**
- Augusto derrubou duas ideias minhas, com razão nas duas:
  1. Tipografia cinética por experimento — inviável, o conteúdo entra por formulário.
  2. Galeria horizontal no catálogo — o lugar dela é a seção da equipe, na landing.
- Dessas duas correções saiu a regra geral do projeto (D10) e a regra de ouro do catálogo (D12),
  que valem para tudo que a gente decidir daqui pra frente.
- Formato do catálogo voltou a ficar em aberto.

**D15 — PDF: os dois caminhos.** O site **gera o PDF sozinho** a partir dos campos preenchidos.
Existe também um campo opcional para **subir um PDF próprio** — se houver, ele substitui o
gerado. Nunca falta PDF, e dá para caprichar em um específico quando quiserem.

**D16 — ❌ BNCC está fora.** Descartado pelo Augusto: é burocracia demais para a equipe.
Sem campo de código, sem filtro por habilidade. Não reabrir.

**D17 — "Sobre Nós" não é seção nem página separada.** Vai tudo num bloco só na landing:
sobre o projeto + métricas + equipe. O item do menu apenas leva até lá.

**D19 — ✅ FICHA DO EXPERIMENTO — fechada.**

*Obrigatórios* (a ficha já publica bonita só com isso, ~10 min de preenchimento):
1. Título · 2. Área (Física/Química/Biologia) + nível · 3. Link do YouTube ·
4. Tempo, custo e dificuldade · 5. Materiais (item, quantidade, **substituto**) ·
6. Passo a passo numerado (foto opcional por passo).

*Opcionais* (o bloco **só aparece no site se alguém preencher** — nunca sobra espaço vazio):
7. Frase de gancho · 8. Por que funciona · 9. O que costuma dar errado ·
10. Segurança · 11. Dá para fazer em casa? · 12. PDF próprio (substitui o gerado — D15).

*Automático, sem ninguém preencher:* experimentos relacionados (puxa outros da mesma área)
e a imagem de compartilhamento para WhatsApp.

**❌ Cortados da ficha:** "como conduzir com a turma" e BNCC.
→ Consequência: **a camada docente deixou de existir.** A ficha é puramente "como fazer o
experimento", e serve igual para professor, pai e curioso. Um público só, uma página só.

**D18 — Os experimentos entram aos poucos.** A equipe escolhe quais publicar e vai somando
um ou outro conforme sai vídeo novo. Não existe "lista final" — o catálogo é vivo.
→ Reforça D12: publicar não pode depender de programador.

---

**16/08/2026 — sessões 7 a 9**
- Augusto me corrigiu três vezes: eu insistia em reinventar conceito visual, ele queria
  estrutura normal + detalhes bons. Virou **D14**, que passa a valer acima de tudo.
- Pesquisa refeita no alvo certo: **catálogo de mecânicas em uso hoje**, não ferramentas.
- Mecânicas escolhidas e distribuídas por seção → **seção 9**.
- Confirmado pela análise do Awwwards: galeria horizontal serve para galeria/portfólio/linha do
  tempo e **não** para site de texto → a decisão do Augusto (tirar do catálogo, pôr na equipe)
  estava certa.
- **Próximo tema: anatomia da ficha do experimento** (campos), que define a dashboard.

**16/08/2026 — sessão 6**
- Equipe: fixa no código, só foto + nome. Hilton confirmado. Paleta: verde e branco (prévia).
- Tema da sessão: **estrutura da landing e as mecânicas de interação**. Ver seção 7.

---

## 7. Landing — estrutura e mecânicas (em discussão)

### Esqueleto proposto

| # | Seção | Mecânica | Por que existe |
|---|---|---|---|
| 1 | **Abertura** | Vídeo em tela cheia, mudo, parado no instante do "uau". Ao rolar, ele **encolhe e vira o primeiro item do catálogo**. | O produto de vocês é o vídeo. A transição liga "eu assisti" a "eu posso fazer". |
| 2 | **A prova** | Números grandes (500 mil / 13 milhões / iBest), contagem contida, texto com o humor de vocês. | Confiança. Quem chega da bio já conhece; quem chega encaminhado, não. |
| 3 | **O método** | Texto fixo, mídia trocando ao lado conforme rola. | Explica humor + analogia — o diferencial do projeto. |
| 4 | **A equipe** | **Galeria horizontal com scroll preso** (D11). | Momento de gente. Rostos reais = confiança. |
| 5 | **A virada** | Chamada para o catálogo. A seção mais importante da landing. | O trabalho da landing é converter carinho em uso (D5/D9). |
| 6 | **Rodapé** | Ifes, redes, contato. | Institucional. |

### Caixa de ferramentas (mecânicas candidatas)
- Scroll preso com movimento lateral (equipe).
- Elemento que atravessa seções mudando de tamanho/posição (vídeo da abertura → catálogo).
- Reação à **velocidade** do scroll — arrasto, inércia, resistência. Barato e muito "físico".
- Camada de textura: papel, grão, anotação à mão, fita crepe — **estética de caderno de bancada**.

### Lista negra (o que faz um site parecer feito por IA em 2026)
Gradiente roxo/azul • vidro fosco (glassmorphism) • formas 3D flutuantes sem função •
fundo "aurora" • grade bento • texto aparecendo palavra por palavra em toda seção •
ícone genérico de linha fina • foto de banco de imagens • simetria perfeita em tudo.
**Antídoto:** imperfeição proposital, textura física, assimetria, e escrita com voz própria.

### Risco assumido
Mobile é o site (D5), e mobile é dentro do navegador do Instagram. **Scroll preso é justamente
o que mais quebra nesse ambiente.** Toda mecânica precisa ter uma versão mobile decidida de
propósito — nunca "desliga no celular".

### ❌ Abertura descartada (sessão 7)
Vídeo em tela cheia que encolhe e vira item do catálogo — Augusto não gostou.
A *técnica* foi reaproveitada: virou a transição **catálogo → ficha** (ver seção 8).
Três novas direções de abertura em discussão.

---

## 8. Estado da arte e stack de animação (pesquisa da sessão 7)

### Ferramentas — o padrão de 2026
- **GSAP é 100% gratuito desde abril/2025**, incluindo os plugins que antes eram pagos
  (**ScrollTrigger**, SplitText, MorphSVG, DrawSVG, ScrollSmoother). Webflow comprou a GreenSock
  e liberou tudo, inclusive uso comercial. → Para um projeto de alunos sem orçamento, isso é enorme.
- **Lenis** (~3KB, da Darkroom Engineering) virou o padrão de scroll suave. Não quebra
  `position: sticky` nem IntersectionObserver.
- **Lenis + GSAP ScrollTrigger** é o combo padrão de site animado em 2026.
- **CSS scroll-driven animations** (`animation-timeline: scroll()` / `view()`) hoje são nativas:
  Chrome/Edge 115+, Safari 26, Firefox 132+ (parcial). ~84% de cobertura global.
  **Rodam fora da main thread** → é a opção certa para celular fraco. Usar com
  `@supports (animation-timeline: scroll())` e cair para algo simples no resto.
- **View Transitions API** entre páginas: Chromium desde a 126, Safari 18.2+, Firefox em andamento.

### O critério dos jurados é o mesmo critério da professora
Da análise de sites premiados de 2026, as reprovações mais citadas:
- Motion decorativo, sem propósito narrativo → não ganha nada.
- **Cair para 18fps em Android mediano = desclassificado.**
- Falta de `prefers-reduced-motion` → "marca de amador".
- Sem ponto de vista próprio, nem parado o site se salva.

→ Ou seja: a barra do Awwwards e a barra da professora com Android baratinho dentro do
navegador do Instagram **são a mesma barra**. Otimizar para uma é otimizar para a outra.

### Referências para estudar
| Site | Por que importa |
|---|---|
| **Josh Worth — "If the Moon Were Only 1 Pixel"** | Webby de ciência, scroll horizontal pelo espaço com humor no vazio. Ciência + piada + scroll, usado por professores no mundo todo. **A referência mais próxima do que a gente quer.** |
| **Mat Voyce** | Tipografia cinética, letras que esticam e se recombinam no scroll. Indicado a GSAP Site of the Year 2025. Valida a ideia descartada — mas só cabe na landing. |
| **By-Kin** | Tipografia editorial confiante, scroll suave e pesado, transição discreta. Múltiplos prêmios. |
| **Uncommon Studio** | Grid firme com quebras propositais; transição GSAP como movimento de câmera; rápido apesar de art-directed. |
| **Iventions** | WebGL usado como atmosfera, não como espetáculo. |

### 21st.dev — onde usar e onde NÃO usar
Registro de ~12 mil componentes React/Tailwind sobre shadcn/ui, MIT, o código é copiado
para o repositório.
- ✅ **Dashboard.** Formulário, tabela, upload, modal, autenticação. Ali velocidade vale mais
  que originalidade.
- ❌ **Landing.** Componente de comunidade na landing é exatamente como se produz a cara
  genérica de IA que o Augusto não quer.
- → Encaixa perfeitamente em D10: *landing feita à mão, catálogo/dashboard como sistema.*

---

## 9. ✅ MECÂNICAS DECIDIDAS — por seção

**As três grandes** (as que a pessoa vai lembrar):
1. Máquina de escrever no hero · 2. Galeria da equipe · 3. Card que vira vídeo.
Todo o resto é acabamento.

| Seção | Entra | Fica de fora |
|---|---|---|
| **Menu (todo o site)** | Menu que encolhe ao descer e volta ao subir | — |
| **Hero** | Máquina de escrever em loop (troca de palavra) · título entrando em cascata, palavra por palavra, uma vez no carregamento · botão magnético (só desktop) | Embaralhar — brigaria com a máquina de escrever |
| **Números** | Números que sobem ao entrar na tela · **faixa correndo** com a imprensa (TV Gazeta, Tribuna, iBest) — **única faixa do site** | — |
| **Sobre o projeto** | Seção presa: texto parado, imagens trocando ao lado | Parallax — datado e custa desempenho |
| **Equipe** | **Galeria horizontal, construída duas vezes:** no computador **prende** a página e passa de lado; no celular **arrasta com o dedo e freia com inércia** | Versão "desligada no celular" |
| **Chamada pro catálogo** | Troca de cor de fundo na chegada — e **nenhum efeito**, de propósito. Único ponto parado do site | — |
| **Rodapé** | Rodapé que aparece por trás | — |
| **Catálogo** | Cards entrando em cascata · prévia em vídeo no hover (desktop) | Cartas empilhadas (esconde conteúdo, ruim para escolher entre 20) · encaixe/snap (atrapalha quem procura) |
| **Ficha do experimento** | Card que cresce e vira o vídeo · barra de progresso (aqui ela serve) · índice lateral acompanhando o scroll | Todo o resto — é a página que cala a boca |
| **Dashboard** | Componente pronto (21st.dev/shadcn), sem invenção | — |

**Cortados de vez:** glitch · parallax · snap · imagem que inclina · cartas empilhadas ·
embaralhar · cursor customizado.

**Regra de ouro das microinterações:** resposta entre **200 e 500 ms**. Menos, ninguém percebe;
mais, irrita.

---

### Técnica aproveitada: transição catálogo → ficha
Clicar num experimento faz a miniatura **crescer e virar o vídeo da ficha**, com View
Transitions. É a ideia da abertura descartada, mas num lugar melhor: é útil, dá sensação de
aplicativo e **funciona sozinha para os 20 experimentos** sem ninguém programar nada por item
— respeita D12.
