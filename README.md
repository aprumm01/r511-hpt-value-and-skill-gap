# R511: HPT Value and Skill Gap

An R511 personal inquiry visualizing how UX practitioners and HCID students experience the education-practice gap and the rise of AI tools. Framed by Human Performance Technology (HPT).

**R2 question:** *How does the use of AI in design practice shift perceptions of designer value?*

---

## What this site is

A static, single-page site combining guided scrollytelling with a filterable dashboard. Built with vanilla HTML, CSS, and JavaScript, plus Chart.js and Scrollama from a CDN. No build step required.

The site reads four interview transcripts (two SAP Concur practitioners and two IU HCID students) coded under a CMDA-derived codebook, layers an HPT interpretive overlay (Gilbert's Behavior Engineering Model and Pershing's four-element taxonomy), and presents:

1. **Hero** — R2 question, four participant cards, methodological framing
2. **Section A: Education-practice gap** — five scrollytelling steps with a chart that morphs as the reader scrolls, plus quote cards
3. **Section B: AI in practice and studies** — same scrollytelling pattern, framed by Gilbert's BEM
4. **Section C: BEM heatmap** — single grid showing where each participant's MUs concentrate across the six BEM cells
5. **Dashboard** — filter by participant, BEM cell, cluster, and sentiment; see counts and matching quotes
6. **Survey companion** — three Qualtrics responses, plotted with appropriate hedging
7. **Methods, limits, and citations**

## Repository layout

```
site/
├── index.html          # Page structure
├── style.css           # All styling (no framework)
├── app.js              # Charts, scrollytelling, dashboard logic
├── data/
│   ├── mus.json        # 398 coded meaning units (slim fields)
│   ├── aggregates.json # Pre-computed counts and sketches
│   ├── quotes.json     # 31 selected high-signal quotes
│   ├── survey.json     # 3 Qualtrics responses
│   ├── themes_to_hpt.json # Theme-to-HPT mapping with rationale
│   └── MUs_raw.json    # Full raw export from xlsx (for re-derivations)
└── README.md
```

## Run locally

`fetch()` calls block when opening the page as a `file://` URL. Serve over HTTP from the `site/` folder:

```bash
cd site
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a new GitHub repo (public).
2. From the repo root: `git init`, commit the contents of `site/` so `index.html` sits at the repo root (or under a `/docs` folder).
3. Push to `main`.
4. In repo settings → Pages: source `Deploy from a branch`, branch `main`, folder `/` (or `/docs`).
5. URL appears within a minute or two at `https://<username>.github.io/<repo>/`.

If the repo will hold the project broadly (analysis files plus the site), put the site under `/docs` and select that as the Pages source so the rest of the repo stays unpublished.

## How the HPT overlay works

The CMDA codebook codes meaning units inductively for theme, subtheme, sentiment, tone, speech act, hedging, and emotional intensity. The HPT layer is added on top: each unique theme is mapped to one or more cells of Gilbert's (1978) BEM (information, resources, incentives, knowledge, capacity, motives) and to one of Pershing's (2006) four elements (organizational, management, physical/technical, human/social systems). The mapping lives in `data/themes_to_hpt.json` with a one-line rationale per theme.

This is interpretive overlay at the theme level, not a separately coded MU dimension. The methods section of the site states this plainly.

## Limits

- N = 4 interviews and N = 3 surveys. Patterns are juxtapositions, not statistical findings.
- Inter-rater reliability is scoped out for this course project.
- The Pradyumna coded sheet (`P4_Interview_Analysis_Report.xlsx`) contains 35 of the 187 MUs described in the corresponding report. Visuals reflect what is in the coded data, not the report.
- The codebook P-numbering scheme, the file P-numbering, and within-report labeling do not agree. Internally the site uses participant names (Senior, Specialist, Saeoul, Pradyumna) to avoid ambiguity.

## Selected references

Cho, Y., Jo, S. J., Park, S., Kang, I., & Chen, Z. (2011). The current state of human performance technology: A citation network analysis of *Performance Improvement Quarterly*, 1988–2010. *Performance Improvement Quarterly, 24*(1), 69–95.

Gilbert, T. F. (1978). *Human competence: Engineering worthy performance.* McGraw-Hill.

Herring, S. C. (2004). Computer-mediated discourse analysis: An approach to researching online behavior. In S. A. Barab, R. Kling, & J. H. Gray (Eds.), *Designing for virtual communities in the service of learning* (pp. 338–376). Cambridge University Press.

Pershing, J. A. (Ed.). (2006). *Handbook of human performance technology* (3rd ed.). Pfeiffer.

Wilmoth, F. S., Prigmore, C., & Bray, M. (2010). HPT models: An overview of the major models in the field. In K. H. Silber et al. (Eds.), *Handbook of improving performance in the workplace* (Vol. 2, pp. 5–26). Pfeiffer/ISPI.

## Author

Adam Prumm — EDU-R511, Spring 2026, Indiana University HCID PhD program.

## License

Project content (text, analysis) © 2026 Adam Prumm. Code released under MIT for re-use in similar academic visualizations.
