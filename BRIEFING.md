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

---

## 12. Ideias ambiciosas — decidido na sessão de mecânicas da landing

### ✅ APROVADA — parede de imagens no hero (referência: Netflix)

Fundo do hero com **muitas capas de vídeo** em vez de uma foto só.
Referência dada pelo Augusto: a home da Netflix — grade de pôsteres em perspectiva,
escurecida no centro pra o texto vencer, com as bordas se apagando.

O que faz aquilo funcionar (e não virar poluição):
1. A grade é **deformada em perspectiva**, não é grade reta. É isso que dá "parede", não "mosaico".
2. **Escurecimento pesado** por cima. Sem isso o texto some. É o detalhe que todo mundo esquece.
3. As bordas **se apagam** em vez de cortar reto.

Detalhe que muda o desenho: **o Ifesciência só publica conteúdo curto (shorts)** — as capas
são **verticais (9:16)**, não horizontais. Isso na verdade ajuda: pôster vertical é exatamente
o formato que a Netflix usa.

Decisão pendente: a paleta é creme e o hero da Netflix é escuro. Ou o hero vira uma faixa
escura, ou as capas são lavadas em creme. Ver discussão.

### 📌 ANOTADA PARA DEPOIS — o hero com física de verdade

Aprovada pelo Augusto ("muita personalidade"), mas **fica pra depois** por dar bastante trabalho.

Como ele quer: não são formas genéricas. São **objetos reais dos vídeos do Ifesciência**
— o copo Stanley, e outros que a equipe escolher — caindo, colidindo e podendo ser
arrastados e arremessados com o dedo.

O trabalho que é da equipe: recortar cada objeto em PNG com fundo transparente.
O trabalho que é meu: física, colisão, arremesso e o plano B pra celular fraco.

### ❌ RECUSADAS
- **Números ao vivo do YouTube** — o Ifesciência é grande no **Instagram**, não no YouTube.
  Puxar número de lá mostraria um número pequeno e falso sobre o alcance real.
- **Cards da equipe com vídeo em loop** — o Augusto prefere manter foto parada.

### Ainda em aberto
- Como manter os números atualizados sem API (ver discussão: campo na dashboard).
- Onde a física mora: no hero ou como entrada do catálogo.
- Se clicar num objeto da física leva ao experimento daquele objeto.

---

## 13. Banco de dados (etapa 2)

**Projeto Supabase:** `ifesciencia` · `suocgfbfvcvmsgqypand` · região **São Paulo**
(a mais perto dos usuários) · custo **R$ 0/mês**.

### Tabelas
- **`experimentos`** — todos os campos da D19, separados entre obrigatórios e opcionais.
- **`membros`** — quem pode escrever. A equipe troca todo ano letivo (D3): quando alguém
  se forma, apaga-se a linha e o acesso acaba.

### Decisões de estrutura
- **Materiais e passos ficam em `jsonb`, não em tabelas separadas.** Ninguém vai perguntar
  "quais experimentos usam vinagre", e no formulário da dashboard salvar a lista inteira de
  uma vez é muito mais simples do que costurar três tabelas.
- **Guarda-se o id do vídeo, não a URL.** O formato de URL do YouTube muda; o id não.
  A partir dele monta-se o player e a miniatura.
- **Dinheiro em centavos, inteiro.** Número quebrado com dinheiro sempre dá errado.
- **`pdf_url` e `capa_url` vazios são o caso normal:** sem eles, o site gera o PDF (D15)
  e usa a miniatura do YouTube.

### Regras de acesso — conferidas de fora, com a chave pública
| Teste | Resultado |
|---|---|
| Ler experimentos | só os **publicados** aparecem; rascunho fica invisível |
| Ler a lista de membros | vem vazia |
| Escrever qualquer coisa | **bloqueado** |

As funções auxiliares ficam no schema `private`, que a API do Supabase não publica —
em `public` elas virariam rota acessível de fora. Zero alertas de segurança no painel.

### Dados de teste
Três experimentos de mentira cadastrados (`lata-que-amassa`, `ovo-na-garrafa`,
`repolho-que-muda-de-cor`), sendo um deles rascunho de propósito, pra testar a diferença.
**São descartáveis** — apagar quando os de verdade entrarem.

---

## 14. Objetos icônicos animados — PLANO FECHADO, execução marcada

> Uma das partes mais importantes do site na visão do Augusto: "vai quadruplicar o
> profissionalismo e a personalidade, e passa storytelling".
> **Nada construído ainda. A execução ficou marcada para o dia seguinte a esta conversa.**

### O caminho — decidido pelo Augusto

**Higgsfield, com os créditos dele.** Fluxo, em ordem:

1. **Gerar a imagem inicial** do objeto — já **nas cores da paleta do site**, para nascer
   combinando em vez de ser corrigido depois.
2. **Animar essa imagem** (imagem → vídeo) com o movimento do experimento.
3. **Extrair os quadros com ffmpeg.**
4. **Montar no site**, ligado ao scroll.

*(Registro honesto: eu insisti em alternativas — extrair quadros dos vídeos originais,
fotografar os objetos, testar com silhueta em SVG. O Augusto derrubou as três com razão:
os vídeos têm legenda queimada, a queda do copo nunca foi filmada, e silhueta vetorial
destruiria a qualidade do site. **O caminho é IA e está decidido — não reabrir.**)*

### Os três escolhidos

O critério: o objeto aparece com ~180px. Nesse tamanho, movimento sutil some e detalhe
fino vira borrão.

| Objeto | Views | Movimento |
|---|---|---|
| **Bola do efeito Magnus** | 1,8 M | atravessa em curva |
| **Coca-Cola Clear** | 4,7 M | garrafa enchendo, devagar |
| **Copo Stanley** | viral | cai e se parte ao meio — o clímax |

### Os descartados, com motivo (não reabrir sem motivo novo)
- **Gelo derretendo** (2,7 M) — lento e sutil demais; em 180px vira mancha.
- **Garrafa de Klein** (3,6 M) — a graça é entender a topologia, e isso exige tamanho.
- **Chocolate holográfico** (1,4 M) — o brilho iridescente é a primeira coisa que morre
  ao encolher; sobra uma barra marrom.
- **Fogo com água, do Pedro** (17,3 M) — dói deixar o maior de fora, mas a coreografia
  (cair e abrir em dois) é **a mesma do Stanley**. Seria repetir o truque.
- **NFT** (7,2 M), **gravidade zero** (1,0 M), **institucional** — não têm objeto.

### Onde cada um vai — aprovado pelo Augusto

Regra: **objeto só entra em seção que ainda não tem mecânica própria.**

| Seção | Objeto |
|---|---|
| **Hero** | **nenhum** — já tem cascata do título, máquina de escrever e botão magnético |
| **O projeto** | **Coca Clear enchendo** — seção longa, movimento lento acompanha a leitura |
| **Alcance** | **bola do Magnus** — seção curta, movimento rápido |
| **A equipe** | **nenhum** — a galeria já prende a tela |
| **Chamada pro catálogo** | **copo Stanley cai e parte ao meio** — o clímax; o copo se abre e revela o botão |

⚠️ O copo na chamada final **desfaz a decisão anterior** de aquele ser o único ponto parado
do site. A página passa a terminar em movimento. Se perder força, mover o copo.

### A exceção da bola (pedido do Augusto)
Os objetos moram nas margens — **menos a bola**. Ela **atravessa por cima do texto**,
sobreposta, pra dar a sensação de estar mesmo passando por cima. É o único objeto que
entra na área de conteúdo, e faz sentido justamente porque uma bola com efeito Magnus
curva para onde você não esperava. Cuidado: ela não pode deixar o texto ilegível —
passagem rápida, objeto pequeno.

### Configuração de geração
**Resolução alta, sem economia** — correção do Augusto sobre a minha sugestão de 480p:
o site está caprichado e imagem de baixa qualidade estragaria tudo.

- Modelo de vídeo: **Seedance 2.0** · `mode: std` · `resolution: 1080p`
- `generate_audio: false` — áudio é inútil aqui e só encarece
- `duration: 4–5s` — já rende quase 100 quadros, e só precisamos de 12 a 20
- Proporção conforme o objeto (garrafa e copo em 9:16; bola pode ser 1:1)
- **Fundo chapado** (verde ou branco liso) — recorte vira trivial
- **Enquadrar o objeto ocupando quase todo o quadro.** Isto importa tanto quanto a
  resolução: se o objeto ocupa 1/4 do quadro, um vídeo 1080p entrega um objeto de ~500px.

### Créditos
**70 créditos, plano basic.** O preço por geração só aparece na hora, então:
**fazer um objeto inteiro primeiro, do começo ao fim**, medir o custo real e só então
decidir se os 70 cobrem os três.
Começar pela **bola do Magnus** — a mais simples de gerar e a mais fácil de julgar.

---

## 15. Coreografia e prompts — pronto para gerar

> Detalhamento fechado antes de gastar crédito. Erro aqui desperdiça crédito e tempo.

### As sete travas — valem para TODO prompt

1. **Câmera absolutamente parada.** Se a câmera mexe, o objeto se desloca no quadro e,
   depois do recorte de fundo, treme na tela. É a causa nº 1 de material inutilizável.
2. **Fundo de uma cor só, chapado, sem chão e sem sombra projetada.** Sombra no chão vem
   junto no recorte e vira mancha cinza. A sombra entra depois, em código.
3. **Objeto inteiro no quadro do primeiro ao último instante.** Saiu pela borda, aqueles
   quadros viram lixo.
4. **Uma tomada só.** Sem corte, sem zoom, sem transição.
5. **Luz constante.** Variação vira piscada quando os quadros passam.
6. **O movimento ocupa o clipe inteiro**, não acontece no último meio segundo.
7. **Sem texto, sem logo, sem marca.**

### ⚠️ Marca registrada
**Stanley e Coca-Cola são marcas.** Num site institucional do Ifes financiado pela Fapes,
gerar o logo delas é problema desnecessário — e de graça de evitar.
Pedir **copo térmico genérico** e **garrafa de refrigerante genérica**, ambos no verde da
paleta. Fica melhor: combinam com o site em vez de trazer a identidade de outra empresa.

### Divisão de trabalho
**A IA faz o objeto; o código faz o movimento — menos quando o movimento muda a forma
do objeto.** Vantagem prática: se a pessoa rolar rápido, código continua coerente,
enquanto quadros presos ao scroll teleportam.

---

### 1. Bola do efeito Magnus — só imagem, sem vídeo

**Ativo:** 1 imagem. Bola verde, centralizada, fundo chapado.
**Movimento:** feito em código — atravessa **por cima do texto** numa curva, girando.
**Por quê sem vídeo:** a trajetória é o efeito, e trajetória é trivial em código. Se a
rotação ficar falsa, aí sim gerar um giro curto em loop — mas testar de graça primeiro.
**Scroll:** seção "Alcance". Progresso 0→1 = a bola cruza da esquerda para a direita,
subindo e curvando na descida.

### 2. Garrafa enchendo — imagem + vídeo

Precisa de quadros: o que muda é o líquido dentro do vidro, e isso código não faz.

**Prompt:** garrafa de vidro transparente, verde-clara, **imóvel**, centralizada, fundo
chapado. O líquido sobe do fundo até o topo, devagar. **Sem mão, sem jato entrando por
cima** — o nível simplesmente sobe. Câmera travada.
**Scroll:** seção "O projeto" (longa, texto preso). Progresso 0→1 = primeiro ao último
quadro. A garrafa enche no ritmo da leitura.

### 3. Copo que cai e parte ao meio — imagem + vídeo

**Decisão do Augusto: vídeo, não código.** Com razão — metade de copo caindo em código
seriam dois retângulos girando, sem queda em três dimensões e sem revelar o interior.

**O vídeo cobre só o que só vídeo consegue.** A descrição original tinha quatro tempos
(balançar, cair, rolar, partir) e modelo de vídeo perde o fio em instrução de vários
tempos. Então:
- **O balanço fica em código**, usando a própria imagem inicial, antes do vídeo tocar.
- **O vídeo começa no instante do tombo** e termina com as metades paradas. Dois tempos.
- A primeira imagem do vídeo é a imagem que estava balançando → passagem invisível.

**Três detalhes que precisam estar no prompt:**
- **Corte limpo, não estilhaçado.** É copo térmico de metal, e no vídeo do Ifesciência ele
  foi **serrado ao meio**. Se estilhaçar, perde a referência.
- **As metades param mostrando o interior oco.** É o ponto do experimento — o vácuo entre
  as paredes. De boca pra baixo, a animação perde o que deveria contar.
- **A queda é para o lado.** Caindo para a câmera ele cresce e desfoca; para trás, some.
  Tombo lateral mantém plano e tamanho.

**Scroll:** seção da chamada final. 0→60% balança e cai · 60% toca e parte ·
60→100% as metades se afastam e o botão aparece.

---

### Produção
- Gerar em **1080p**, entregar no site **redimensionado para 2× o tamanho de exibição**
  (~400–500px). Vinte quadros em 1080p passariam de 2 MB e a professora com 4G pagaria
  por isso sem ver diferença. **Gera grande, entrega do tamanho certo.**
- Vídeo: Seedance 2.0 · `mode: std` · `1080p` · `generate_audio: false` · 4–5s.
- Enquadrar o objeto ocupando quase todo o quadro.

### Ordem de execução (protege o crédito)
1. **Bola** — 1 imagem. Resultado na tela no mesmo dia; serve para julgar se objeto gerado
   combina com o site antes de gastar no resto.
2. **Garrafa** — 1 imagem + 1 vídeo de movimento simples, de um tempo só.
3. **Copo** — por último. É o mais caro e o mais provável de exigir 2 ou 3 tentativas;
   a essa altura já se sabe o custo real por geração e quanto sobra para insistir.

**Total: 3 imagens + 2 vídeos**, mais tentativas. Orçamento: 70 créditos.

### O que se decide na geração x o que se decide no ffmpeg

Observação do Augusto, correta: **a quantidade de quadros é decisão do ffmpeg**, não da
geração. O vídeo sai com todos os quadros e dá para reextrair quantas vezes quiser, de
graça, sem gerar de novo.

**Na geração — sem conserto depois:** visual do objeto, luz, enquadramento, fundo, câmera
parada, o movimento em si, resolução (dá para reduzir depois, nunca aumentar).

**No ffmpeg — reversível e grátis:** quantos quadros, qual trecho do clipe aproveitar,
tamanho final de entrega.

**Cadência decidida (poucos quadros, de propósito):** doze quadros lê como stop-motion —
proposital, feito à mão. Sessenta lê como filmagem colada no site, que é o desencaixe que
o Augusto temia. Menos quadros também é arquivo menor: estética e desempenho apontam para
o mesmo lado.
Ajustar por velocidade do movimento, não usar o mesmo número para todos:
**garrafa ~10–12 quadros** (lento) · **copo ~20** (rápido; com 10 a queda vira teleporte).

**Estilo decidido:** objeto **realista com luz de estúdio limpa** — não cartunesco e não
cinematográfico. Cartunesco brigaria com as fotos reais da equipe que vão entrar no site;
cinematográfico parece banco de imagem. O contraste "objeto real + cadência de stop-motion"
é justamente o que máquina nenhuma faz por acidente.

⚠️ **A exceção que vaza da cadência para a geração: borrão de movimento.**
Se o modelo renderizar a queda com borrão — normal em movimento rápido — cada quadro
extraído sai borrado, e em stop-motion vira sequência de manchas. **No prompt do copo,
pedir queda com movimento nítido, sem borrão.**

**Teste grátis combinado:** ao gerar o vídeo da garrafa, montar duas versões no site —
uma com 12 quadros e outra com 30 — e comparar antes de decidir. Custo zero em créditos.

---

## 16. ✅ Números do site vêm do banco (não mais do código)

Estavam escritos à mão em `Numeros.tsx`: envelheceriam em silêncio e corrigir
exigiria um programador. Agora são a tabela `ajustes` (linha única) e a equipe
edita em **/dashboard/ajustes**.

**O que é editável:** seguidores · visualizações · terceiro número e seu rótulo ·
a observação embaixo dos números · a lista da imprensa que corre na faixa ·
os endereços de Instagram, YouTube e TikTok.

**Guardados como número inteiro** (500000, não "500 mil"): o site escreve por
extenso sozinho e a contagem animada continua tendo um número para animar.
O painel mostra a prévia — "no site: 500 mil" — enquanto se digita.

**Rede sem endereço não aparece** no rodapé, em vez de virar link quebrado.

---

## 17. Lições do primeiro objeto (o copo) — ler antes de gerar o próximo

> Retrospectiva feita depois de o copo ficar pronto. Quase todos os erros
> foram meus, e todos têm conserto. Este é o checklist para a garrafa e a bola.

### Erros cometidos

**1. O prompt não descreveu a SILHUETA.** Falou de material, cor, acabamento,
enquadramento e fundo — e nada da forma. "Tumbler de aço com alça" é vago, e
saiu um formato afunilado de garrafa. O Augusto queria o **copo americano
grande: parede quase reta, boca larga, corpo encorpado.**

**2. Pedi quatro tempos num clipe só** (balançar, cair, pousar, partir) e o
modelo entregou um. Isso já estava escrito na seção 15 e eu não segui.

**3. Gastei crédito numa queda que o código ia fazer de qualquer jeito.**
Decidir antes o que o vídeo precisa entregar teria simplificado o prompt e
aumentado a chance de acertar de primeira.

**4. Não conferi o alinhamento dos quadros.** O objeto desce 42px dentro da
própria imagem ao longo da sequência. Tratar os quadros como se ele estivesse
parado fez o copo pousar num lugar e as metades aparecerem em outro.

**5. Dimensionei pela imagem, não pelo objeto.** O copo ocupa pouco mais da
metade do quadro; o resto é transparente. Resultado: objeto pequeno demais.

**6. Escolhi o lugar pelo sentido, sem olhar a geometria.** A chamada final era
narrativamente certa, mas era centralizada — não existia caminho livre para
nada cair. Três tentativas até perceber. **Sentido não resolve se a geometria
não permite.**

**7. Medi contra o elemento errado.** As posições saíam do palco travado, mas
quem posiciona o objeto é o bloco de texto. Duas rodadas perdidas nisso.

### Checklist para os próximos objetos

**Antes de gerar a imagem**
- [ ] Descrever a **silhueta em palavras**, com proporções. Não só material e cor.
- [ ] Cor da paleta, sem marca, sem texto, sem logo.
- [ ] Fundo magenta chapado, sem chão, sem sombra projetada.
- [ ] Enquadrar deixando espaço vazio **onde o movimento vai acontecer**.

**Antes de gerar o vídeo**
- [ ] Definir **UM único movimento** — o que só vídeo faz.
- [ ] Tudo que código consegue fazer (queda, translação, rotação) fica com o código.
- [ ] Câmera travada, uma tomada, luz constante, sem borrão de movimento.

**Antes de montar no site**
- [ ] **Medir a caixa do objeto em TODOS os quadros** e corrigir a deriva.
- [ ] Dimensionar pela **altura do objeto**, nunca pela da imagem.
- [ ] Medir posições contra o elemento que de fato posiciona o objeto
      (o `offsetParent`), não contra o container mais próximo.

**Antes de escolher o lugar**
- [ ] Conferir se existe **corredor vertical livre** na seção.
- [ ] Se não existir: ou muda a composição, ou muda o lugar — **antes** de gerar.
- [ ] Confirmar que existe um elemento para o objeto **colidir** no fim.
      Sem colisão o objeto vira adesivo, e aí não vale a pena.

### O que deu certo e vale repetir
- Fundo magenta chapado: recorte automático saiu limpo, sem franja.
- Dividir o trabalho: **a IA faz o que só ela faz** (a quebra em duas metades
  com o interior oco), **o código faz o resto** (queda, ritmo, colisão).
- **O elemento do site reagir ao impacto** — o botão achatando na batida foi o
  que finalmente fez o objeto parecer parte da página.
- 13 quadros WebP pesaram 152 KB no total.
