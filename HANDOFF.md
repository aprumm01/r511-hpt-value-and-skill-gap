# R511 Project Handoff
**Last updated:** 2026-05-03  
**Author:** Adam Prumm, EDU-R511, Indiana University HCID PhD  
**Claude Code session file:** `C:\Users\adamp\.claude\projects\C--Users-adamp\0b74b5d9-f65c-4871-a6a6-06cb4106771e.jsonl`

---

## What this project is

A static, single-page visualization of a personal inquiry for EDU-R511 (Spring 2026) at Indiana University. The research question is:

> **How does the use of AI in design practice shift perceptions of designer value?**

The site reads four semi-structured interview transcripts — two SAP Concur UX practitioners and two IU HCID graduate students — coded using a CMDA-derived codebook, then layers an HPT interpretive overlay using Gilbert's (1978) Behavior Engineering Model (BEM) and Pershing's (2006) four-element taxonomy. It is a scholarly visualization artifact, not a web app.

**Primary audience:** HPT instructor and classmates, with awareness that method and interpretive restraint are the most important signals to communicate.

---

## Live site and repository

| Resource | URL |
|---|---|
| GitHub repo | https://github.com/aprumm01/r511-hpt-value-and-skill-gap |
| GitHub Pages (live) | https://aprumm01.github.io/r511-hpt-value-and-skill-gap/ |
| Notion Interviews folder | https://www.notion.so/Interviews-31880151ea6380a1942cdb0c427baf59 |
| GitHub username | aprumm01 |

---

## Local file locations (primary machine)

```
C:\Users\adamp\Desktop\IU Classes\Spring 2026\r511\
├── Interviews\
│   ├── R511_Site\                    ← the site (git repo root)
│   │   ├── index.html
│   │   ├── app.js
│   │   ├── style.css
│   │   ├── HANDOFF.md                ← this file
│   │   └── data\
│   │       ├── mus.json              ← 550 MUs (P1:69, P2:117, P3:177, P4:187)
│   │       ├── aggregates.json       ← pre-computed counts and sketches
│   │       ├── quotes.json           ← 31+ selected quotes
│   │       ├── survey.json           ← 3 Qualtrics responses
│   │       ├── themes_to_hpt.json    ← theme→BEM/Pershing mapping
│   │       └── MUs_raw.json          ← full raw export (unused by site)
│   ├── analysis\
│   │   ├── P1_Interview_Analysis.xlsx
│   │   ├── P1_Interview_Analysis_Report.docx
│   │   ├── P2_Interview_Analysis.xlsx
│   │   ├── P2_Interview_Analysis_Report.docx
│   │   ├── P3_Interview_Analysis.xlsx
│   │   ├── P3_Interview_Analysis_Report.docx
│   │   ├── P4_Interview_Analysis_Report.xlsx   ← only 35 rows; NOW superseded by mus.json
│   │   ├── P4_Interview_Analysis_Report.docx
│   │   ├── Qualtrics_May01_Simplified.xlsx
│   │   └── CMDA_Codebook_v2.docx               ← authoritative codebook
│   ├── P1-Ken-transcript.txt
│   ├── P2-Gyuree-transcript.txt
│   ├── P3-Saeoul-transcript.txt
│   ├── P4-Pradyumna Interview_transcript.txt
│   ├── interview-analysis_SKILL.md             ← Claude CMDA coding skill
│   └── Content_analysis_prompt_v3.md           ← general UX content analysis skill
```

---

## Participant mapping

| Site label | Real name | Role | Org | MUs |
|---|---|---|---|---|
| P1 | Ken | UX practitioner (Senior) | SAP Concur | 69 |
| P2 | Gyuree | UX practitioner (Specialist) | SAP Concur | 117 |
| P3 | Saeoul | Graduate student | Indiana University HCID | 177 |
| P4 | Pradyumna | Graduate student | Indiana University HCID | 187 |

**Anonymization rule:** The site uses only P1–P4. No names, roles, divisions, program cohort years, or HCID references appear. Hero cards show only "UX practitioner, SAP" or "Graduate student, Indiana University." This is intentional — with four participants, any additional descriptor becomes identifying.

---

## HPT framework in use

### Gilbert's (1978) Behavior Engineering Model (BEM)
Six cells organized in a 2×3 grid:

| | Environmental (outside the person) | Individual (inside the person) |
|---|---|---|
| **Data / Information** | Feedback, standards, expectations visible to the performer | Knowledge: skills and training the person holds |
| **Resources** | Tools, materials, time, access | Capacity: physical/cognitive ability to perform |
| **Incentives** | Consequences, rewards, career alignment | Motives: desire, identity, willingness |

**Why BEM is used here:** Gilbert's model maps where performance gaps originate. The research question is whether AI shifts *where* the gap sits — in the environmental row (organizations not providing information about AI expectations, or not giving designers the right tools) or the individual row (designers lacking knowledge, capacity, or motivation to use AI). BEM gives us a diagnostic grid for that question.

**What the data shows:** Practitioners (P1, P2) concentrate on the environmental row — information and incentives — because they experience the gap through management decisions. Students (P3, P4) concentrate on the individual row — knowledge and motives — because they're preparing for entry, not operating in the system yet.

### Pershing's (2006) Four-Element Taxonomy
Each MU is also tagged to one of four Pershing system levels:
- **Organizational:** Economic structure, lines of communication, culture
- **Management:** Managers, performance standards, priorities
- **Physical/Technical:** Facilities, equipment, tools, technical processes
- **Human/Social:** People competencies, education, training, mentoring

---

## Data architecture

### mus.json (slim fields per MU)
```json
{
  "p": "P1",                        // participant label
  "theme": "Career Journey",         // main theme (inductive)
  "sub": "Current role",             // subtheme
  "sent": "Neutral",                 // Positive / Neutral / Negative
  "tone": "General",                 // General / Concerned / Frustrated / Enthusiastic / Uncertain
  "act": "Non-actionable",           // Actionable / Non-actionable
  "cluster": "value_articulation",   // see clusters below
  "bem": ["knowledge"],              // array of BEM cells
  "pershing": "human_social",        // pershing system level
  "text": "verbatim MU text"
}
```

### Clusters (used for chart grouping)
| Key | Label | What it captures |
|---|---|---|
| `edu_gap` | Education gap | Gap between program preparation and industry expectations |
| `org_perception` | Org perception | How employers/leadership understand (or misunderstand) design value |
| `ai_tools` | AI tools | Actual use of AI tools — specific, personal, practical |
| `ai_threat` | AI threat | Perceived threat to designer roles, job anxiety, devaluation risk |
| `value_articulation` | Value articulation | Defining and communicating what UX is and does |
| `future_work` | Future of work | Predictions about design roles in 3–5 years |

### aggregates.json
Pre-computed counts for all dimensions, broken out by participant:
- `participants[]` — name, role, org, group, MU count, sketch
- `theme_counts` — theme distribution per participant
- `sentiment_counts` — sentiment distribution per participant
- `cluster_counts` — cluster distribution per participant
- `bem_counts` — BEM cell counts per participant (with multi-cell MUs counted once per cell)
- `pershing_counts` — Pershing element counts per participant
- `sentiment_by_cluster` — cross-tab of cluster × sentiment per participant
- `group_for` — maps participant label to group (practitioner/student)

---

## Site sections

| Section | ID | What it does |
|---|---|---|
| Hero | `#hero` | R2 question, participant cards with MU counts and sketches, gap statement |
| Section A | `#section-edu` | Scrollytelling on the education-practice gap; cluster share bar chart |
| Section B | `#section-ai` | Scrollytelling on AI in practice and studies; BEM bar chart |
| Section C | `#section-heatmap` | BEM heatmap: participants × 6 BEM cells, CSS color intensity |
| Dashboard | `#dashboard` | Filter MUs by participant, BEM cell, cluster, sentiment; see counts and quotes |
| Survey | `#survey` | 3 Qualtrics responses; hedged as illustrative, not statistical |
| Methods | `#methods` | Corpus description, HPT overlay explanation, limits, references |

---

## Tech stack

- **Vanilla HTML/CSS/JS** — no build step, no framework
- **Chart.js 4.4.0** (CDN) — all charts
- **Scrollama 3.2.0** (CDN) — scrollytelling step triggers
- **Google Fonts** — Source Serif 4, IBM Plex Sans
- **GitHub Pages** — static hosting from `main` branch root
- **No Python/Node required** — run locally with any HTTP server: `python3 -m http.server 8080` from the `R511_Site` folder

---

## Key decisions made (with rationale)

### Anonymization
Removed all participant names, job titles, program divisions, and any descriptor specific enough to identify a four-person sample. Hero cards show "UX practitioner, SAP" and "Graduate student, Indiana University" only. The P-number labels (P1–P4) run through all data files and all site text.

### Chart normalization
All cross-participant charts show percentages of each participant's own MU total, not raw counts. P3 has 177 MUs and P4 has 187 — if raw counts were used, P3 and P4 would visually dominate P1 (69 MUs) and make the chart misleading. Normalization makes cross-participant comparison valid.

### P4 data backfill
The original P4 analysis xlsx had only 35 of 187 MUs coded (the source report described 187). Rather than show a partial-data participant, the full P4 transcript (`P4-Pradyumna Interview_transcript.txt`) was coded in full using the `interview-analysis_SKILL.md` CMDA protocol. All 187 MUs are now in `mus.json` and reflected in `aggregates.json`. The P4 hero card shows the MU count without a qualifier.

### HPT overlay methodology
CMDA codes MUs inductively (theme, subtheme, sentiment, tone, speech act, hedging, emotional intensity). HPT codes are added as a *second layer* at the theme level — not re-coded at the MU level. Each unique theme is mapped to BEM cell(s) and a Pershing element in `themes_to_hpt.json` with a one-line rationale. The methods section states this plainly, and the gap statement in the hero uses explicit Gilbert and Pershing citations to frame the interpretive overlay.

### Gap statement
Added to hero: "desired state" (designers enter practice with AI-fluent preparation) vs. "actual state" (expectations shifting faster than preparation). Cites Gilbert (1978) BEM and Pershing (2006) as the diagnostic tools. This is the HPT lens made explicit upfront.

### Claude Code role
Claude Code (Sonnet 4.6) was used under Adam's direction for:
- CMDA coding of P4's transcript (187 meaning units)
- JSON data generation and all site data files
- Site layout, CSS, and JavaScript
- Data synthesis across all four transcripts for charts and aggregates

This is acknowledged in the site footer/methods. **It is important that the methods section accurately reflects Claude Code's role in data synthesis and site construction.**

---

## What still needs to be done

### Immediate (before submission)
1. **BEM explanation section** — readers (HPT instructor + classmates) need to understand *why* BEM is being used as a measurement lens, what each cell means in this research context, and why the practitioner/student split in BEM concentration matters. Add this as a visible block before or within Section C (heatmap).
2. **Claude Code acknowledgment** — formal acknowledgment in the methods section and/or footer that Claude Code was used for CMDA coding, data synthesis, and site construction, under Adam's direction.
3. **Section A alignment fix** — the quote/text card in Section A is visually offset from the chart card. The sticky scrollytelling grid needs layout correction.

### Future / nice-to-have
4. **P4 quotes** — only a few P4 quotes are in `quotes.json`; backfill with high-signal P4 quotes from the newly coded MUs
5. **Survey section hedging** — consider removing the survey section entirely or making it even more hedged (N=3 is very small)
6. **Mobile polish** — gap statement columns stack but may need spacing tuning at small breakpoints

---

## Running locally

```bash
cd "C:\Users\adamp\Desktop\IU Classes\Spring 2026\r511\Interviews\R511_Site"
python3 -m http.server 8080
# open http://localhost:8080
```

On Windows without Python: `npx serve .` or use VS Code Live Server extension.

---

## Git workflow

- Branch: `main` (single branch — this is a course project, not a production system)
- Remote: `origin` → `https://github.com/aprumm01/r511-hpt-value-and-skill-gap.git`
- GitHub Pages serves from `main` branch, root `/`
- **Never push directly to `main` with breaking changes** — verify locally first
- Git credentials: stored in Windows Credential Manager (was set up in a prior session)

---

## Selected references (for citation accuracy)

- Cho, Y., Jo, S. J., Park, S., Kang, I., & Chen, Z. (2011). The current state of HPT: A citation network analysis. *Performance Improvement Quarterly, 24*(1), 69–95.
- Gilbert, T. F. (1978). *Human competence: Engineering worthy performance.* McGraw-Hill.
- Herring, S. C. (2004). Computer-mediated discourse analysis. In Barab, Kling, & Gray (Eds.), *Designing for virtual communities in the service of learning* (pp. 338–376). Cambridge University Press.
- Holton, E. F. (1999). Performance domain and their boundaries. *Advances in Developing Human Resources, 1*(3), 26–46.
- Pershing, J. A. (Ed.). (2006). *Handbook of human performance technology* (3rd ed.). Pfeiffer.
- Wilmoth, F. S., Prigmore, C., & Bray, M. (2010). HPT models: An overview. In Silber et al. (Eds.), *Handbook of improving performance in the workplace* (Vol. 2, pp. 5–26). Pfeiffer/ISPI.
