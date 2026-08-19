# Ifesciência — site

Site do projeto de divulgação científica **Ifesciência** (@ifesciencia), do Ifes campus
Cachoeiro de Itapemirim.

Duas partes:
1. **Landing** — o projeto, as métricas e a equipe.
2. **Catálogo de experimentos** — cada vídeo vira uma ficha que um professor consegue
   reproduzir em sala: materiais, passo a passo, vídeo e PDF.
3. **Dashboard privada** — onde a equipe cadastra os experimentos, sem programador.

> Documentos do projeto: [BRIEFING.md](BRIEFING.md) (todas as decisões) e
> [PLANO.md](PLANO.md) (as etapas de construção).

---

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

Antes de rodar, copie as variáveis de ambiente:

```bash
cp .env.example .env.local
```

*(As chaves do Supabase só passam a ser necessárias na etapa 2.)*

---

## Stack

- **Next.js 16** (App Router) — necessário para o preview de link no WhatsApp
- **Tailwind CSS 4**
- **Supabase** — banco, login e arquivos
- **Vercel** — hospedagem
- **GSAP + Lenis** — as mecânicas de scroll (a partir da etapa 4)

## Estrutura

```
src/
  app/            rotas
    page.tsx      landing
  components/     peças de interface
  lib/            supabase, utilitários
public/           imagens estáticas
```

## Estado

**Etapa 0 concluída** — fundação e deploy.
Próxima: etapa 1, identidade visual. Ver [PLANO.md](PLANO.md).
