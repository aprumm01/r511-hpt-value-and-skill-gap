// =====================================================================
// Designer Value in the Age of AI
// R511 personal inquiry, Spring 2026
// =====================================================================

const PARTICIPANTS = ['P1', 'P2', 'P3', 'P4'];
const GROUPS = { P1: 'practitioner', P2: 'practitioner', P3: 'student', P4: 'student' };

const COLORS = {
  P1:         '#2a5e8a',
  P2:         '#4a7fa8',
  P3:         '#c08a2c',
  P4:         '#a06a18',
  practitioner: '#2a5e8a',
  student:    '#c08a2c',
  positive:   '#4a8a4a',
  neutral:    '#888888',
  negative:   '#b04030',
  concerned:  '#a07020',
  frustrated: '#783050',
  ink:        '#1a1a1a',
  rule:       '#d6d3c8',
};

const CLUSTER_LABELS = {
  edu_gap:           'Education gap',
  org_perception:    'Org perception',
  ai_tools:          'AI tools',
  ai_threat:         'AI threat',
  value_articulation:'Value articulation',
  future_work:       'Future of work',
};
const CLUSTER_ORDER = ['edu_gap', 'org_perception', 'ai_tools', 'ai_threat', 'value_articulation', 'future_work'];
const CLUSTER_COLORS = {
  edu_gap:           '#8b2a1a',
  org_perception:    '#2a5e8a',
  ai_tools:          '#4a8a4a',
  ai_threat:         '#a07020',
  value_articulation:'#783050',
  future_work:       '#5a5a5a',
};

const BEM_CELLS = ['information', 'resources', 'incentives', 'knowledge', 'capacity', 'motives'];
const BEM_LABELS = {
  information: 'Information', resources: 'Resources', incentives: 'Incentives',
  knowledge: 'Knowledge', capacity: 'Capacity', motives: 'Motives'
};

const PERSHING_CELLS = ['organizational', 'management', 'physical_technical', 'human_social'];
const PERSHING_LABELS = {
  organizational: 'Organizational', management: 'Management',
  physical_technical: 'Physical/Technical', human_social: 'Human/Social'
};

const SENTIMENT_ORDER = ['Positive', 'Neutral', 'Negative', 'Concerned', 'Frustrated'];

let DATA = { mus: [], aggregates: null, quotes: [], survey: [], hpt: null };

// =====================================================================
// Boot
// =====================================================================
async function boot() {
  Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = '#4a4a4a';
  Chart.defaults.plugins.legend.labels.font = { size: 13 };
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 13 };
  Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(26,26,26,0.93)';
  Chart.defaults.plugins.tooltip.cornerRadius = 4;
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.tooltip.boxPadding = 4;

  try {
    const [mus, aggs, quotes, survey, hpt] = await Promise.all([
      fetch('data/mus.json').then(r => r.json()),
      fetch('data/aggregates.json').then(r => r.json()),
      fetch('data/quotes.json').then(r => r.json()),
      fetch('data/survey.json').then(r => r.json()),
      fetch('data/themes_to_hpt.json').then(r => r.json()),
    ]);
    DATA = { mus, aggregates: aggs, quotes, survey, hpt };
  } catch (e) {
    console.error('Data load failed', e);
    document.body.insertAdjacentHTML('afterbegin',
      '<div style="padding:20px;background:#fee;color:#900;font-family:sans-serif">Could not load data. If running locally, serve via <code>python3 -m http.server</code>; opening as a file:// URL blocks fetch.</div>');
    return;
  }

  fillHero();
  buildEduSection();
  buildAiSection();
  buildHeatmap();
  buildSurveyCharts();
  initScrolly();
  initDashboard();
}

// =====================================================================
// Hero
// =====================================================================
function fillHero() {
  for (const p of DATA.aggregates.participants) {
    const muEl = document.getElementById(`mu-${p.name}`);
    const skEl = document.getElementById(`sketch-${p.name}`);
    if (muEl) muEl.textContent = p.mus;
    if (skEl) skEl.textContent = p.sketch;
  }
}

// =====================================================================
// Section A: Education-Practice Gap
// =====================================================================
let chartEdu;
function buildEduSection() {
  // Default chart: cluster distribution by participant (stacked bar)
  const ctx = document.getElementById('chart-edu').getContext('2d');
  const datasets = CLUSTER_ORDER.map(c => ({
    label: CLUSTER_LABELS[c],
    data: PARTICIPANTS.map(p => DATA.aggregates.cluster_counts[p][c] || 0),
    backgroundColor: CLUSTER_COLORS[c],
    borderWidth: 0,
  }));
  chartEdu = new Chart(ctx, {
    type: 'bar',
    data: { labels: PARTICIPANTS, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: { stacked: true, title: { display: true, text: 'Meaning units' } },
        y: { stacked: true },
      },
      plugins: {
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}` } },
        legend: { position: 'bottom' }
      }
    }
  });

  // Quote cards
  const eduQuotes = DATA.quotes.filter(q => q.cluster === 'edu_gap').slice(0, 4);
  renderQuoteCards('quotes-edu', eduQuotes);
}

function updateEduChart(step) {
  if (!chartEdu) return;
  const titleEl = document.getElementById('edu-vis-title');
  const capEl = document.getElementById('edu-vis-caption');

  if (step === 'edu-2' || step === 'edu-1') {
    titleEl.textContent = 'Cluster distribution by participant';
    capEl.textContent = 'Each row is one participant; segments show meaning units per cluster.';
    chartEdu.data.datasets = CLUSTER_ORDER.map(c => ({
      label: CLUSTER_LABELS[c],
      data: PARTICIPANTS.map(p => DATA.aggregates.cluster_counts[p][c] || 0),
      backgroundColor: CLUSTER_COLORS[c], borderWidth: 0,
    }));
    chartEdu.options.indexAxis = 'y';
    chartEdu.options.scales = {
      x: { stacked: true, title: { display: true, text: 'Meaning units' } },
      y: { stacked: true }
    };
  }
  else if (step === 'edu-3') {
    titleEl.textContent = 'Pershing four elements within edu-gap MUs';
    capEl.textContent = 'Among MUs in the education-gap cluster, where the cause sits in Pershing\'s (2006) taxonomy.';
    // For each participant, count Pershing elements among edu_gap MUs
    chartEdu.data.datasets = PERSHING_CELLS.map((pe, i) => ({
      label: PERSHING_LABELS[pe],
      data: PARTICIPANTS.map(p => DATA.mus.filter(m => m.p === p && m.cluster === 'edu_gap' && m.pershing === pe).length),
      backgroundColor: ['#8b2a1a','#2a5e8a','#4a8a4a','#a07020'][i], borderWidth: 0,
    }));
    chartEdu.options.indexAxis = 'y';
    chartEdu.options.scales = {
      x: { stacked: true, title: { display: true, text: 'Meaning units in cluster' } },
      y: { stacked: true }
    };
  }
  else if (step === 'edu-4') {
    titleEl.textContent = 'Sentiment within edu-gap MUs';
    capEl.textContent = 'Sentiment of meaning units in the education-gap cluster, by participant.';
    chartEdu.data.datasets = SENTIMENT_ORDER.map(s => ({
      label: s,
      data: PARTICIPANTS.map(p => DATA.mus.filter(m => m.p === p && m.cluster === 'edu_gap' && m.sent === s).length),
      backgroundColor: COLORS[s.toLowerCase()] || COLORS.neutral, borderWidth: 0,
    }));
    chartEdu.options.indexAxis = 'y';
    chartEdu.options.scales = {
      x: { stacked: true, title: { display: true, text: 'Meaning units in cluster' } },
      y: { stacked: true }
    };
  }
  else if (step === 'edu-5') {
    titleEl.textContent = 'Quote density by cluster';
    capEl.textContent = 'Where each participant\'s most actionable, emotionally loaded quotes sit.';
    chartEdu.data.datasets = CLUSTER_ORDER.map(c => ({
      label: CLUSTER_LABELS[c],
      data: PARTICIPANTS.map(p => DATA.quotes.filter(q => q.p === p && q.cluster === c).length),
      backgroundColor: CLUSTER_COLORS[c], borderWidth: 0,
    }));
    chartEdu.options.indexAxis = 'y';
    chartEdu.options.scales = {
      x: { stacked: true, title: { display: true, text: 'Selected quotes' } },
      y: { stacked: true }
    };
  }
  chartEdu.update();
}

// =====================================================================
// Section B: AI Impact
// =====================================================================
let chartAi;
function buildAiSection() {
  const ctx = document.getElementById('chart-ai').getContext('2d');
  // Default: BEM cell counts on AI-related MUs (cluster ai_tools or ai_threat)
  const aiMusByPbem = (p) => {
    const cnt = Object.fromEntries(BEM_CELLS.map(c => [c, 0]));
    DATA.mus.filter(m => m.p === p && (m.cluster === 'ai_tools' || m.cluster === 'ai_threat')).forEach(m => {
      (m.bem || []).forEach(c => { if (cnt[c] !== undefined) cnt[c]++; });
    });
    return cnt;
  };
  const datasets = PARTICIPANTS.map(p => ({
    label: p,
    data: BEM_CELLS.map(c => aiMusByPbem(p)[c]),
    backgroundColor: COLORS[p],
    borderWidth: 0,
  }));
  chartAi = new Chart(ctx, {
    type: 'bar',
    data: { labels: BEM_CELLS.map(c => BEM_LABELS[c]), datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        y: { title: { display: true, text: 'AI-related meaning units' } }
      },
      plugins: { legend: { position: 'bottom' } }
    }
  });

  const aiQuotes = DATA.quotes
    .filter(q => q.cluster === 'ai_tools' || q.cluster === 'ai_threat')
    .slice(0, 6);
  renderQuoteCards('quotes-ai', aiQuotes);
}

function updateAiChart(step) {
  if (!chartAi) return;
  const titleEl = document.getElementById('ai-vis-title');
  const capEl = document.getElementById('ai-vis-caption');

  if (step === 'ai-1' || step === 'ai-2') {
    titleEl.textContent = 'AI mentions on Gilbert\'s BEM, by participant';
    capEl.textContent = 'Same six cells, very different shapes. Practitioners (blues) and students (ochres).';
    const aiMusByPbem = (p) => {
      const cnt = Object.fromEntries(BEM_CELLS.map(c => [c, 0]));
      DATA.mus.filter(m => m.p === p && (m.cluster === 'ai_tools' || m.cluster === 'ai_threat'))
        .forEach(m => (m.bem || []).forEach(c => { if (cnt[c] !== undefined) cnt[c]++; }));
      return cnt;
    };
    chartAi.data.labels = BEM_CELLS.map(c => BEM_LABELS[c]);
    chartAi.data.datasets = PARTICIPANTS.map(p => ({
      label: p, data: BEM_CELLS.map(c => aiMusByPbem(p)[c]),
      backgroundColor: COLORS[p], borderWidth: 0,
    }));
    chartAi.options.scales = { y: { title: { display: true, text: 'AI-related MUs' } } };
  }
  else if (step === 'ai-3') {
    titleEl.textContent = 'AI volume vs AI valence';
    capEl.textContent = 'Total AI-cluster MUs (bars) compared to negative/concerned/frustrated share (line).';
    const counts = PARTICIPANTS.map(p =>
      DATA.mus.filter(m => m.p === p && (m.cluster === 'ai_tools' || m.cluster === 'ai_threat')).length);
    const negShare = PARTICIPANTS.map(p => {
      const mus = DATA.mus.filter(m => m.p === p && (m.cluster === 'ai_tools' || m.cluster === 'ai_threat'));
      if (!mus.length) return 0;
      const neg = mus.filter(m => ['Negative','Concerned','Frustrated'].includes(m.sent)).length;
      return Math.round((neg / mus.length) * 100);
    });
    chartAi.data.labels = PARTICIPANTS;
    chartAi.data.datasets = [
      { type: 'bar', label: 'AI-cluster MUs', data: counts, backgroundColor: PARTICIPANTS.map(p => COLORS[p]), borderWidth: 0, yAxisID: 'y' },
      { type: 'line', label: '% negative-leaning', data: negShare, borderColor: COLORS.negative, backgroundColor: 'rgba(176,64,48,0.15)', tension: 0.2, yAxisID: 'y1' }
    ];
    chartAi.options.scales = {
      y:  { title: { display: true, text: 'MU count' }, position: 'left' },
      y1: { title: { display: true, text: '% negative-leaning' }, position: 'right', grid: { drawOnChartArea: false }, min: 0, max: 100 }
    };
  }
  else if (step === 'ai-4') {
    titleEl.textContent = 'Cluster sentiment: AI tools vs AI threat';
    capEl.textContent = 'Within each participant, the same topic landscape carries different affective weight.';
    chartAi.data.labels = PARTICIPANTS;
    const aiToolsNeg = PARTICIPANTS.map(p => DATA.mus.filter(m => m.p === p && m.cluster === 'ai_tools' && ['Negative','Concerned','Frustrated'].includes(m.sent)).length);
    const aiToolsPos = PARTICIPANTS.map(p => DATA.mus.filter(m => m.p === p && m.cluster === 'ai_tools' && m.sent === 'Positive').length);
    const aiThreatNeg = PARTICIPANTS.map(p => DATA.mus.filter(m => m.p === p && m.cluster === 'ai_threat' && ['Negative','Concerned','Frustrated'].includes(m.sent)).length);
    const aiThreatPos = PARTICIPANTS.map(p => DATA.mus.filter(m => m.p === p && m.cluster === 'ai_threat' && m.sent === 'Positive').length);
    chartAi.data.datasets = [
      { label: 'AI tools — positive', data: aiToolsPos, backgroundColor: '#4a8a4a', stack: 'tools' },
      { label: 'AI tools — negative-leaning', data: aiToolsNeg, backgroundColor: '#a0c5a0', stack: 'tools' },
      { label: 'AI threat — positive', data: aiThreatPos, backgroundColor: '#a07020', stack: 'threat' },
      { label: 'AI threat — negative-leaning', data: aiThreatNeg, backgroundColor: '#b04030', stack: 'threat' },
    ];
    chartAi.options.scales = { y: { title: { display: true, text: 'Meaning units' }, stacked: true }, x: { stacked: true } };
  }
  else if (step === 'ai-5') {
    titleEl.textContent = 'Selected AI-cluster quotes by participant';
    capEl.textContent = 'How many of each participant\'s most-loaded quotes are about AI tools versus AI threat.';
    chartAi.data.labels = PARTICIPANTS;
    const tools = PARTICIPANTS.map(p => DATA.quotes.filter(q => q.p === p && q.cluster === 'ai_tools').length);
    const threat = PARTICIPANTS.map(p => DATA.quotes.filter(q => q.p === p && q.cluster === 'ai_threat').length);
    chartAi.data.datasets = [
      { label: 'AI tools', data: tools, backgroundColor: '#4a8a4a' },
      { label: 'AI threat', data: threat, backgroundColor: '#b04030' },
    ];
    chartAi.options.scales = { y: { title: { display: true, text: 'Selected quotes' } } };
  }
  chartAi.update();
}

// =====================================================================
// Section C: BEM heatmap
// =====================================================================
function buildHeatmap() {
  const root = document.getElementById('heatmap');
  // Compute share of MUs touching each cell, by participant
  const shares = {};
  PARTICIPANTS.forEach(p => {
    const total = DATA.mus.filter(m => m.p === p).length;
    shares[p] = {};
    BEM_CELLS.forEach(c => {
      const n = DATA.mus.filter(m => m.p === p && (m.bem || []).includes(c)).length;
      shares[p][c] = { pct: total ? n / total : 0, n };
    });
  });

  // Find max for shading
  let maxPct = 0;
  for (const p of PARTICIPANTS) for (const c of BEM_CELLS) maxPct = Math.max(maxPct, shares[p][c].pct);

  let html = '';
  // Top header row
  html += '<div class="hm-corner"></div>';
  BEM_CELLS.forEach(c => { html += `<div class="hm-col-label">${BEM_LABELS[c]}</div>`; });

  // One row per participant
  PARTICIPANTS.forEach(p => {
    const isPract = GROUPS[p] === 'practitioner';
    const accent = isPract ? COLORS.practitioner : COLORS.student;
    html += `<div class="hm-row-label" style="color:${accent}">${p}</div>`;
    BEM_CELLS.forEach(c => {
      const { pct, n } = shares[p][c];
      const intensity = maxPct ? pct / maxPct : 0;
      // soft fill from off-paper to accent
      const bg = `rgba(${isPract ? '42,94,138' : '192,138,44'}, ${0.08 + intensity * 0.55})`;
      const display = (pct * 100).toFixed(0) + '%';
      html += `<div class="hm-cell" style="background:${bg}" data-tooltip="${BEM_LABELS[c]}, ${p}: ${n} of ${DATA.mus.filter(m=>m.p===p).length} MUs (${display})">
                 <span class="hm-pct">${display}</span>
                 <span class="hm-n">n=${n}</span>
               </div>`;
    });
  });

  root.innerHTML = html;
}

// =====================================================================
// Survey
// =====================================================================
function buildSurveyCharts() {
  const survey = DATA.survey;
  if (!survey || survey.length === 0) return;

  // Skill ranks (1 = most important). We invert to plot importance height.
  const skillFields = ['Skill_Rank_Visual_Design', 'Skill_Rank_User_Research', 'Skill_Rank_Strategic_Thinking', 'Skill_Rank_AI_Proficiency', 'Skill_Rank_Critique', 'Skill_Rank_Communication'];
  const skillLabels = ['Visual design', 'User research', 'Strategic thinking', 'AI proficiency', 'Critique', 'Communication'];
  const skillsCtx = document.getElementById('chart-survey-skills');
  if (skillsCtx) {
    new Chart(skillsCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: skillLabels,
        datasets: survey.map((r, i) => ({
          label: `R${i + 1}`,
          data: skillFields.map(f => Number(r[f]) || 0),
          backgroundColor: ['#8b2a1a', '#2a5e8a', '#4a8a4a'][i % 3],
          borderWidth: 0,
        }))
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        scales: { x: { reverse: true, min: 0, max: 7, title: { display: true, text: 'Rank (1 = most important)' } } },
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  const scoresCtx = document.getElementById('chart-survey-scores');
  if (scoresCtx) {
    new Chart(scoresCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: survey.map((r, i) => `Respondent ${i + 1}`),
        datasets: [
          { label: 'Future feeling (0–10)', data: survey.map(r => Number(r.Future_Feelings_Score) || 0), backgroundColor: '#2a5e8a' },
          { label: 'Program confidence (0–10)', data: survey.map(r => Number(r.Program_Confidence_Score) || 0), backgroundColor: '#c08a2c' },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { min: 0, max: 10 } },
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}

// =====================================================================
// Quote rendering
// =====================================================================
function renderQuoteCards(containerId, quotes) {
  const root = document.getElementById(containerId);
  if (!root) return;
  if (!quotes.length) { root.innerHTML = '<p class="quote-list-empty">No quotes match this view.</p>'; return; }
  root.innerHTML = quotes.map(q => {
    const cls = GROUPS[q.p] || '';
    return `<article class="quote-card ${cls}">
      <div class="q-meta">
        <span class="q-p">${q.p}</span>
        <span>${q.theme || ''}</span>
        ${q.sentiment ? `<span>${q.sentiment}</span>` : ''}
      </div>
      <blockquote>${escapeHtml(q.text)}</blockquote>
      <div class="q-tail">${q.tone || ''}</div>
    </article>`;
  }).join('');
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// =====================================================================
// Scrollytelling
// =====================================================================
function initScrolly() {
  if (!window.scrollama) return;
  document.querySelectorAll('.scrolly').forEach(scrolly => {
    const sc = scrollama();
    sc.setup({
      step: scrolly.querySelectorAll('.step'),
      offset: 0.55,
      progress: false,
    }).onStepEnter(({ element }) => {
      scrolly.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
      element.classList.add('active');
      const id = element.dataset.step;
      if (id && id.startsWith('edu-')) updateEduChart(id);
      if (id && id.startsWith('ai-'))  updateAiChart(id);
    });
    window.addEventListener('resize', () => sc.resize());
  });
}

// =====================================================================
// Dashboard
// =====================================================================
let dashClusterChart, dashSentChart;

function initDashboard() {
  document.querySelectorAll('.f-p, .f-bem, .f-cluster, .f-sent').forEach(cb => {
    cb.addEventListener('change', updateDashboard);
  });

  const cCtx = document.getElementById('chart-dash-cluster').getContext('2d');
  dashClusterChart = new Chart(cCtx, {
    type: 'bar',
    data: { labels: CLUSTER_ORDER.map(c => CLUSTER_LABELS[c]), datasets: [{ label: 'MUs', data: [], backgroundColor: CLUSTER_ORDER.map(c => CLUSTER_COLORS[c]), borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });

  const sCtx = document.getElementById('chart-dash-sent').getContext('2d');
  dashSentChart = new Chart(sCtx, {
    type: 'doughnut',
    data: { labels: SENTIMENT_ORDER, datasets: [{ data: [], backgroundColor: SENTIMENT_ORDER.map(s => COLORS[s.toLowerCase()] || COLORS.neutral), borderWidth: 1, borderColor: '#fff' }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
  });

  updateDashboard();
}

function updateDashboard() {
  const sel = {
    p: getChecked('.f-p'),
    bem: getChecked('.f-bem'),
    cluster: getChecked('.f-cluster'),
    sent: getChecked('.f-sent'),
  };

  const filtered = DATA.mus.filter(m => {
    if (!sel.p.includes(m.p)) return false;
    if (m.cluster && !sel.cluster.includes(m.cluster)) return false;
    if (m.sent && !sel.sent.includes(m.sent)) return false;
    if (m.bem && m.bem.length) {
      if (!m.bem.some(c => sel.bem.includes(c))) return false;
    }
    return true;
  });

  document.getElementById('stat-mus').textContent = filtered.length;
  const themes = new Set(filtered.map(m => m.theme).filter(Boolean));
  document.getElementById('stat-themes').textContent = themes.size;
  const bemSet = new Set();
  filtered.forEach(m => (m.bem || []).forEach(c => bemSet.add(c)));
  document.getElementById('stat-bem').textContent = bemSet.size;

  // Cluster chart
  const clusterCounts = CLUSTER_ORDER.map(c => filtered.filter(m => m.cluster === c).length);
  dashClusterChart.data.datasets[0].data = clusterCounts;
  dashClusterChart.update();

  // Sentiment chart
  const sentCounts = SENTIMENT_ORDER.map(s => filtered.filter(m => m.sent === s).length);
  dashSentChart.data.datasets[0].data = sentCounts;
  dashSentChart.update();

  // Quote list
  const list = document.getElementById('quote-list');
  // Pick MUs that have meaningful text and are loadbearing
  const loaded = filtered
    .filter(m => m.text && m.text.length >= 40 && m.text.length <= 360)
    .slice()
    .sort((a, b) => (b.act === 'Yes' ? 1 : 0) - (a.act === 'Yes' ? 1 : 0))
    .slice(0, 25);

  if (!loaded.length) {
    list.innerHTML = '<li class="quote-list-empty">No quotes match this filter combination.</li>';
    return;
  }
  list.innerHTML = loaded.map(m => `
    <li class="p-${m.p}">
      <div class="q-meta">${m.p} · ${m.theme || ''} ${m.sent ? '· ' + m.sent : ''}</div>
      <div class="q-text">${escapeHtml(m.text)}</div>
    </li>
  `).join('');
}

function getChecked(sel) {
  return Array.from(document.querySelectorAll(sel + ':checked')).map(cb => cb.value);
}

// =====================================================================
document.addEventListener('DOMContentLoaded', boot);
