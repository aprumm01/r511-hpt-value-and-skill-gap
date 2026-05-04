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
  // buildEduSection(); // Section removed
  // buildAiSection(); // Section removed
  buildHeatmap();
  // buildSurveyCharts(); // Section removed
  // initScrolly(); // Scrollytelling removed
  // initDashboard(); // Dashboard removed
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
  const ctx = document.getElementById('chart-edu').getContext('2d');
  chartEdu = new Chart(ctx, {
    type: 'bar',
    data: { labels: PARTICIPANTS, datasets: [] },
    options: {
      responsive: true, maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: { stacked: true, title: { display: true, text: '% of meaning units' }, min: 0, max: 100 },
        y: { stacked: true },
      },
      plugins: {
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` } },
        legend: { position: 'bottom' }
      }
    }
  });
  updateEduChart('edu-1');
  const eduQuotes = DATA.quotes.filter(q => q.cluster === 'edu_gap').slice(0, 4);
  renderQuoteCards('quotes-edu', eduQuotes);
}

function updateEduChart(step) {
  if (!chartEdu) return;
  const titleEl = document.getElementById('edu-vis-title');
  const capEl   = document.getElementById('edu-vis-caption');

  if (step === 'edu-1' || step === 'edu-2') {
    titleEl.textContent = 'Cluster share by participant';
    capEl.textContent   = 'What share of each participant\'s meaning units fell in each cluster. Shown as percentages so participants with different MU totals are comparable.';
    chartEdu.data.datasets = CLUSTER_ORDER.map(c => ({
      label: CLUSTER_LABELS[c],
      data: PARTICIPANTS.map(p => {
        const total = DATA.mus.filter(m => m.p === p).length;
        return total ? +((DATA.aggregates.cluster_counts[p][c] || 0) / total * 100).toFixed(1) : 0;
      }),
      backgroundColor: CLUSTER_COLORS[c], borderWidth: 0,
    }));
    chartEdu.options.indexAxis = 'y';
    chartEdu.options.scales = {
      x: { stacked: true, title: { display: true, text: '% of meaning units' }, min: 0, max: 100 },
      y: { stacked: true }
    };
  }
  else if (step === 'edu-3') {
    titleEl.textContent = 'Pershing elements within edu-gap MUs';
    capEl.textContent   = 'Of each participant\'s education-gap MUs, the share landing in each Pershing (2006) system element.';
    chartEdu.data.datasets = PERSHING_CELLS.map((pe, i) => ({
      label: PERSHING_LABELS[pe],
      data: PARTICIPANTS.map(p => {
        const eduMus = DATA.mus.filter(m => m.p === p && m.cluster === 'edu_gap');
        const total  = eduMus.length;
        return total ? +((eduMus.filter(m => m.pershing === pe).length / total) * 100).toFixed(1) : 0;
      }),
      backgroundColor: ['#8b2a1a','#2a5e8a','#4a8a4a','#a07020'][i], borderWidth: 0,
    }));
    chartEdu.options.indexAxis = 'y';
    chartEdu.options.scales = {
      x: { stacked: true, title: { display: true, text: '% of edu-gap MUs' }, min: 0, max: 100 },
      y: { stacked: true }
    };
  }
  else if (step === 'edu-4') {
    titleEl.textContent = 'Sentiment within edu-gap MUs';
    capEl.textContent   = 'Of each participant\'s education-gap MUs, the share by sentiment.';
    chartEdu.data.datasets = SENTIMENT_ORDER.map(s => ({
      label: s,
      data: PARTICIPANTS.map(p => {
        const eduMus = DATA.mus.filter(m => m.p === p && m.cluster === 'edu_gap');
        const total  = eduMus.length;
        return total ? +((eduMus.filter(m => m.sent === s).length / total) * 100).toFixed(1) : 0;
      }),
      backgroundColor: COLORS[s.toLowerCase()] || COLORS.neutral, borderWidth: 0,
    }));
    chartEdu.options.indexAxis = 'y';
    chartEdu.options.scales = {
      x: { stacked: true, title: { display: true, text: '% of edu-gap MUs' }, min: 0, max: 100 },
      y: { stacked: true }
    };
  }
  else if (step === 'edu-5') {
    titleEl.textContent = 'Selected quote share by cluster';
    capEl.textContent   = 'Of each participant\'s selected quotes, the share by cluster.';
    chartEdu.data.datasets = CLUSTER_ORDER.map(c => ({
      label: CLUSTER_LABELS[c],
      data: PARTICIPANTS.map(p => {
        const total = DATA.quotes.filter(q => q.p === p).length;
        return total ? +((DATA.quotes.filter(q => q.p === p && q.cluster === c).length / total) * 100).toFixed(1) : 0;
      }),
      backgroundColor: CLUSTER_COLORS[c], borderWidth: 0,
    }));
    chartEdu.options.indexAxis = 'y';
    chartEdu.options.scales = {
      x: { stacked: true, title: { display: true, text: '% of selected quotes' }, min: 0, max: 100 },
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
  chartAi = new Chart(ctx, {
    type: 'bar',
    data: { labels: BEM_CELLS.map(c => BEM_LABELS[c]), datasets: [] },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { y: { title: { display: true, text: '% of total MUs' }, min: 0 } },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}%` } }
      }
    }
  });
  updateAiChart('ai-1');
  const aiQuotes = DATA.quotes
    .filter(q => q.cluster === 'ai_tools' || q.cluster === 'ai_threat')
    .slice(0, 6);
  renderQuoteCards('quotes-ai', aiQuotes);
}

function updateAiChart(step) {
  if (!chartAi) return;
  const titleEl = document.getElementById('ai-vis-title');
  const capEl   = document.getElementById('ai-vis-caption');

  if (step === 'ai-1' || step === 'ai-2') {
    titleEl.textContent = 'AI mentions on Gilbert\'s BEM, by participant';
    capEl.textContent   = 'Share of each participant\'s total MUs touching each BEM cell in an AI context. Practitioners (blues) and students (ochres).';
    const aiMusByPbem = (p) => {
      const total = DATA.mus.filter(m => m.p === p).length;
      const cnt = Object.fromEntries(BEM_CELLS.map(c => [c, 0]));
      DATA.mus.filter(m => m.p === p && (m.cluster === 'ai_tools' || m.cluster === 'ai_threat'))
        .forEach(m => (m.bem || []).forEach(c => { if (cnt[c] !== undefined) cnt[c]++; }));
      return Object.fromEntries(Object.entries(cnt).map(([k, v]) => [k, total ? +((v/total)*100).toFixed(1) : 0]));
    };
    chartAi.data.labels = BEM_CELLS.map(c => BEM_LABELS[c]);
    chartAi.data.datasets = PARTICIPANTS.map(p => ({
      label: p, data: BEM_CELLS.map(c => aiMusByPbem(p)[c]),
      backgroundColor: COLORS[p], borderWidth: 0,
    }));
    chartAi.options.scales = { y: { title: { display: true, text: '% of total MUs' }, min: 0 } };
  }
  else if (step === 'ai-3') {
    titleEl.textContent = 'AI topic share vs negative sentiment';
    capEl.textContent   = 'Bars: share of each participant\'s MUs on AI topics. Line: share of those AI MUs with negative-leaning sentiment.';
    const aiPct = PARTICIPANTS.map(p => {
      const total   = DATA.mus.filter(m => m.p === p).length;
      const aiCount = DATA.mus.filter(m => m.p === p && (m.cluster === 'ai_tools' || m.cluster === 'ai_threat')).length;
      return total ? +((aiCount/total)*100).toFixed(1) : 0;
    });
    const negShare = PARTICIPANTS.map(p => {
      const mus = DATA.mus.filter(m => m.p === p && (m.cluster === 'ai_tools' || m.cluster === 'ai_threat'));
      if (!mus.length) return 0;
      return +((mus.filter(m => ['Negative','Concerned','Frustrated'].includes(m.sent)).length / mus.length) * 100).toFixed(1);
    });
    chartAi.data.labels = PARTICIPANTS;
    chartAi.data.datasets = [
      { type: 'bar',  label: '% of MUs on AI topics',            data: aiPct,    backgroundColor: PARTICIPANTS.map(p => COLORS[p]), borderWidth: 0, yAxisID: 'y' },
      { type: 'line', label: '% negative-leaning within AI MUs', data: negShare, borderColor: COLORS.negative, backgroundColor: 'rgba(176,64,48,0.15)', tension: 0.2, yAxisID: 'y1', pointRadius: 5, pointHoverRadius: 7 }
    ];
    chartAi.options.scales = {
      y:  { title: { display: true, text: '% of MUs on AI topics' },   position: 'left',  min: 0, max: 100 },
      y1: { title: { display: true, text: '% negative-leaning' }, position: 'right', grid: { drawOnChartArea: false }, min: 0, max: 100 }
    };
  }
  else if (step === 'ai-4') {
    titleEl.textContent = 'AI cluster sentiment by participant';
    capEl.textContent   = 'Share of each participant\'s total MUs, broken out by AI cluster and sentiment direction.';
    const pct = (p, filter) => { const t = DATA.mus.filter(m => m.p === p).length; return t ? +((DATA.mus.filter(filter.bind(null,p)).length/t)*100).toFixed(1) : 0; };
    chartAi.data.labels = PARTICIPANTS;
    chartAi.data.datasets = [
      { label: 'AI tools, positive',         data: PARTICIPANTS.map(p => pct(p, (p,m) => m.p===p && m.cluster==='ai_tools'  && m.sent==='Positive')),                              backgroundColor: '#4a8a4a', stack: 'tools'  },
      { label: 'AI tools, negative-leaning', data: PARTICIPANTS.map(p => pct(p, (p,m) => m.p===p && m.cluster==='ai_tools'  && ['Negative','Concerned','Frustrated'].includes(m.sent))), backgroundColor: '#a0c5a0', stack: 'tools'  },
      { label: 'AI threat, positive',        data: PARTICIPANTS.map(p => pct(p, (p,m) => m.p===p && m.cluster==='ai_threat' && m.sent==='Positive')),                              backgroundColor: '#a07020', stack: 'threat' },
      { label: 'AI threat, negative-leaning',data: PARTICIPANTS.map(p => pct(p, (p,m) => m.p===p && m.cluster==='ai_threat' && ['Negative','Concerned','Frustrated'].includes(m.sent))), backgroundColor: '#b04030', stack: 'threat' },
    ];
    chartAi.options.scales = {
      y: { title: { display: true, text: '% of total MUs' }, stacked: true, min: 0 },
      x: { stacked: true }
    };
  }
  else if (step === 'ai-5') {
    titleEl.textContent = 'AI-cluster quotes as share of selected quotes';
    capEl.textContent   = 'Of each participant\'s selected quotes, the share covering AI tools versus AI threat.';
    chartAi.data.labels = PARTICIPANTS;
    const qPct = (p, cluster) => { const t = DATA.quotes.filter(q => q.p===p).length; return t ? +((DATA.quotes.filter(q => q.p===p && q.cluster===cluster).length/t)*100).toFixed(1) : 0; };
    chartAi.data.datasets = [
      { label: 'AI tools',  data: PARTICIPANTS.map(p => qPct(p,'ai_tools')),  backgroundColor: '#4a8a4a' },
      { label: 'AI threat', data: PARTICIPANTS.map(p => qPct(p,'ai_threat')), backgroundColor: '#b04030' },
    ];
    chartAi.options.scales = { y: { title: { display: true, text: '% of selected quotes' }, min: 0 } };
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
