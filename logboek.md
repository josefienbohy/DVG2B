# Logboek — Creative Automation onepager

## Sessie 1 — 14 oktober 2026

### Prompts (letterlijk en in volgorde)

**Prompt 1** — (setup, v1, v2 en beelden)
> neem mijn computer over en maak deze opdracht
> *(+ de volledige opdrachttekst, inclusief de content, geplakt)*

**Prompt 2** — (setup)
> ja
*(antwoord op de vraag om het werk te bewaren: sessie verplaatst naar de map Local Sites)*

**Prompt 3** — (beelden)
> geen fotos
*(keuze: geen Weave-beelden of foto's; de getekende SVG-illustraties blijven)*

**Prompt 4** — (v2)
> open de website

**Prompt 5** — (beelden)
> ok voeg nu de foto te
*(keuze: stockfoto's van Unsplash; daarna "ja" op de vraag om ze te downloaden)*
→ Zes gratis Unsplash-foto's in `images/` (`*.jpg`) vervangen de illustraties in v2, met fotografen vermeld in de footer: Andy Brown, Onur Binay, Berke Citak, Julien Tromeur, Mohammad Rahmani, Brett Jordan. Dit zijn geen AI-beelden; de SVG-illustraties staan nog als reserve in `images/`.

**Prompt 6** — (beelden)
> open de website

**Prompt 7** — (v2)
> ok maak de website nu veel cooler en interactiever. gebruik ook andere kleuren
→ Vorige v2 bewaard in `archief/v2-eerste-versie/`. Nieuwe v2 "nachtstudio": donker ultraviolet palet `#100C2A` `#1A1540` `#7C5CFF` `#FF9F80` `#4FE3E0` `#FFE27A`, lettertypes Unbounded + DM Sans + JetBrains Mono. Interactief: scramble-titel, gloed en zwevende fotokaarten die de muis volgen, magnetische knoppen, glijdende navigatie-pill, en per onderdeel een speelbare demo (batch-verwerking, bulk create met live spreadsheet, prompt-bouwer met stijlen, website bouwen met een prompt, welkomstflow). Opnieuw volgens de frontend-design- en web-design-guidelines-skills (reduced motion, toetsenbord, labels, aria-live).

Prompt 1 bevatte de volledige opdracht. Claude Code voerde op basis daarvan alle stappen uit; hieronder staat wat er per stap gebeurde.

### Wat Claude Code deed

| Stap | Versie | Resultaat |
|---|---|---|
| 1 | setup | Map `klas_naam_creaut-onepager/` aangemaakt, content opgeslagen als `content.md` |
| 2–3 | v1 | Minimalistische stijl, palet `#1B263B` `#415A77` `#778DA9` `#E0E1DD` `#F2A541`, systeemfont, puur HTML/CSS |
| 5 | v1 | Opgeslagen in `v1/`, screenshots `screenshots/v1-desktop.png` en `v1-mobiel.png` |
| 6 | v2 | Skills van derden gelezen en toegepast (zie hieronder) |
| 7 | v2 | Nieuwe stijl "productielijn: één template, veel varianten": palet `#14152B` `#3046F0` `#FF4F7B` `#3CCB9A` `#FFC43D` `#F1F2F6`, Bricolage Grotesque + Instrument Sans, sticky navigatie met actieve sectie, leesvoortgangsbalk, mobiel hamburgermenu, interactief variantenraster in de hero, scroll-reveal, hover/klik micro-interacties |
| 8 | v2 | Screenshots `screenshots/v2-desktop.png` en `v2-mobiel.png` |
| 9 | beelden | Zes illustraties in `images/` in één consistente vlakke, geometrische stijl (SVG, door Claude getekend — **niet** met Weave gegenereerd) |
| — | v2 | Toegankelijkheid: skip-link, zichtbare focus, `aria-current` in navigatie, alt-teksten, `prefers-reduced-motion`, toetsenbord (Esc sluit menu) |

### Gebruikte skills (van andere partijen)

1. **frontend-design** — Anthropic (`anthropics/skills`, `skills/frontend-design/SKILL.md`)
   Gebruikt voor: stijlplan vóór het bouwen (4–6 kleuren, 2 lettertypes), het onderwerp als uitgangspunt voor de hero (template → varianten), vermijden van AI-clichés, één opvallend element en verder ingetogen motion.
2. **web-design-guidelines** — Vercel (`vercel-labs/agent-skills`, regels uit `vercel-labs/web-interface-guidelines`)
   Gebruikt voor: skip-link, `:focus-visible`, `scroll-margin-top` onder de sticky header, alleen `transform`/`opacity` animeren, reduced motion, `aria-live` voor de variantenknop, `width`/`height` + lazy loading op afbeeldingen, `text-wrap: balance`.

Opmerking: de SKILL.md-bestanden zijn online gelezen en toegepast, niet via `/plugin` geïnstalleerd.
