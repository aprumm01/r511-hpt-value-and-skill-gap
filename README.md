# R511: AI Literacy, Designer Value, and the Making of a Skill Gap

An R511 personal inquiry visualizing how UX practitioners and HCID students perceive designer value as AI reshapes practice — and what that reveals about whether academic programs are building AI literacy or building skill gaps.

**R2 question:** *How does the use of AI in design practice shift perceptions of designer value?*

---

## What this site is

A static, single-page site combining guided scrollytelling with a filterable dashboard. Built with vanilla HTML, CSS, and JavaScript, plus Chart.js and Scrollama from a CDN. No build step required.

The site reads four interview transcripts (two SAP practitioners and two IU HCID students) coded under a CMDA-derived codebook, layers an HPT interpretive overlay (Gilbert's Behavior Engineering Model and Pershing's four-element taxonomy), and presents:

1. **Hero** — R2 question, participant cards, theory primer (Gilbert, Pershing, Holton), performance gap statement
2. **Section A: Education-practice gap** — narrative framing + five scrollytelling steps with a morphing chart, plus quote cards
3. **Section B: AI in practice and studies** — narrative framing + scrollytelling, framed by Gilbert's BEM environmental/individual split
4. **Section C: BEM heatmap** — single grid showing where each participant's MUs concentrate across the six BEM cells, plus a post-heatmap intervention implication block
5. **Dashboard** — filter by participant, BEM cell, cluster, and sentiment; see counts and matching quotes
6. **Survey companion** — three Qualtrics responses, plotted with appropriate hedging
7. **Methods, limits, and citations**

---

## Repository layout

```
R511_Site/
├── index.html          # Page structure and all narrative content
├── style.css           # All styling (no framework)
├── app.js              # Charts, scrollytelling, dashboard logic
├── data/
│   ├── mus.json        # 550 coded meaning units (slim fields; P1:69 P2:117 P3:177 P4:187)
│   ├── aggregates.json # Pre-computed counts and sketches
│   ├── quotes.json     # 31+ selected high-signal quotes
│   ├── survey.json     # 3 Qualtrics responses
│   ├── themes_to_hpt.json # Theme-to-BEM/Pershing mapping with rationale
│   └── MUs_raw.json    # Full raw export (unused by site)
└── README.md
```

---

## Run locally

`fetch()` calls block when opening as a `file://` URL. Serve over HTTP:

```bash
cd R511_Site
python -m http.server 8080
# open http://localhost:8080
```

Note: use `python`, not `python3` — the `python3` alias is not configured on the primary machine.

---

## How the HPT overlay works

CMDA codes meaning units inductively for theme, subtheme, sentiment, tone, speech act, hedging, and emotional intensity. The HPT layer is added on top: each unique theme is mapped to one or more cells of Gilbert's (1978) BEM and to one of Pershing's (2006) four elements. The mapping lives in `data/themes_to_hpt.json` with a one-line rationale per theme. This is interpretive overlay at the theme level, not a separately coded MU dimension.

---

## Participant mapping

| Label | Role | Org | MUs |
|-------|------|-----|-----|
| P1 | UX practitioner (Senior) | SAP | 69 |
| P2 | UX practitioner (Specialist) | SAP | 117 |
| P3 | Graduate student | Indiana University HCID | 177 |
| P4 | Graduate student | Indiana University HCID | 187 |

Anonymization rule: the site uses only P1–P4. No names, specific titles, program cohort years, or division references appear anywhere on the site.

---

## Session history

### 2026-05-03 — Storytelling and title revision
- **Title changed** from "HPT Value and Skill Gap" to "AI Literacy, Designer Value, and the Making of a Skill Gap" — updated in `<title>`, header brand, and hero lede
- **Theory primer added** to hero: three cards introducing Gilbert (BEM), Pershing (four-element taxonomy), and Holton (transfer/performance domain) in plain language, each grounded in participant voice
- **Narrative blocks added** to Section A, Section B, and Section C connecting HPT theory to specific participant quotes and intervention implications
- **Gilbert card rewritten**: moved the framing question ("are they pointing at the system or at themselves?") to the opening; "AI fluency" changed to "AI literacy" throughout
- **Pershing card rewritten**: removed parenthetical clutter; added explicit connection to AI and design education
- **Hero lede updated** to reflect the new title framing: academic programs building toward AI literacy vs. away from it
- **HANDOFF.md removed** from repo; handoff documentation moved to Notion (Handoff sessions (Final) page)

### 2026-05-03 — BEM explainer, alignment fix, acknowledgment (earlier session)
- Added BEM explainer block before Section C heatmap
- Fixed Section A scrollytelling layout offset
- Added Claude Code acknowledgment to methods section and footer

---

## Limits

- N = 4 interviews, N = 3 surveys. Patterns are juxtapositions, not statistical findings.
- Inter-rater reliability is scoped out for this course project.
- P4 full coding (187 MUs) was produced from the complete transcript; the source xlsx contains only 35 rows.
- HPT codes are applied at the theme level, not re-coded per MU.

---

## Selected references

Cho, Y., Jo, S. J., Park, S., Kang, I., & Chen, Z. (2011). The current state of human performance technology. *Performance Improvement Quarterly, 24*(1), 69–95.

Gilbert, T. F. (1978). *Human competence: Engineering worthy performance.* McGraw-Hill.

Herring, S. C. (2004). Computer-mediated discourse analysis. In Barab, Kling, & Gray (Eds.), *Designing for virtual communities in the service of learning* (pp. 338–376). Cambridge University Press.

Holton, E. F. (1999). Performance domain and their boundaries. *Advances in Developing Human Resources, 1*(3), 26–46.

Pershing, J. A. (Ed.). (2006). *Handbook of human performance technology* (3rd ed.). Pfeiffer.

---

## Author

Adam Prumm — EDU-R511, Spring 2026, Indiana University HCID PhD program.
Claude Code (Anthropic, claude-sonnet-4-6) assisted with CMDA coding, data synthesis, site construction, and narrative development under the author's direction.

## License

Project content (text, analysis) © 2026 Adam Prumm. Code released under MIT for re-use in similar academic visualizations.


