const state = {
  terms: [],
  selectedCategory: 'Összes',
  search: '',
  selectedId: null
};

const els = {
  filters: document.querySelector('#filters'),
  searchInput: document.querySelector('#searchInput'),
  termList: document.querySelector('#termList'),
  termDetail: document.querySelector('#termDetail'),
  count: document.querySelector('#count')
};

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getSearchText(term) {
  return normalize([
    term.id,
    term.prefLabelHu,
    term.prefLabelEn,
    term.category,
    term.class,
    term.property,
    term.cidoc,
    term.definition,
    term.usage,
    term.meaning,
    ...(term.altLabels || []),
    ...(term.sources || [])
  ].join(' '));
}

function getFilteredTerms() {
  const query = normalize(state.search.trim());
  return state.terms.filter(term => {
    const categoryMatch = state.selectedCategory === 'Összes' || term.category === state.selectedCategory;
    const queryMatch = !query || getSearchText(term).includes(query);
    return categoryMatch && queryMatch;
  });
}

function renderFilters() {
  const categories = ['Összes', ...new Set(state.terms.map(term => term.category))];
  els.filters.innerHTML = categories.map(category => `
    <button class="filter-button ${category === state.selectedCategory ? 'active' : ''}" type="button" data-category="${category}">
      ${category}
    </button>
  `).join('');

  els.filters.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedCategory = button.dataset.category;
      render();
    });
  });
}

function renderList() {
  const terms = getFilteredTerms();
  els.count.textContent = `${terms.length} elem`;

  els.termList.innerHTML = terms.map(term => `
    <button class="term-button ${term.id === state.selectedId ? 'active' : ''}" type="button" data-id="${term.id}">
      <span class="term-title">${term.prefLabelHu}</span>
      <span class="term-meta">${term.prefLabelEn} · ${term.class}</span>
    </button>
  `).join('');

  els.termList.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedId = button.dataset.id;
      renderDetail();
      renderList();
    });
  });

  if (!terms.length) {
    els.termList.innerHTML = '<p class="empty-state" style="padding:18px;">Nincs találat.</p>';
  }
}

function renderDetail() {
  const terms = getFilteredTerms();
  const selected = state.terms.find(term => term.id === state.selectedId) || terms[0];

  if (!selected) {
    els.termDetail.innerHTML = '<p class="empty-state">Nincs megjeleníthető szócikk.</p>';
    return;
  }

  state.selectedId = selected.id;

  els.termDetail.innerHTML = `
    <div class="detail-kicker">${selected.category}</div>
    <h2>${selected.prefLabelHu}</h2>
    <div class="en-label">${selected.prefLabelEn}</div>

    <div class="field-grid">
      <div class="field"><span>Azonosító</span><strong>${selected.id}</strong></div>
      <div class="field"><span>MAMBO-osztály / típus</span><strong>${selected.class}</strong></div>
      <div class="field"><span>Javasolt property</span><strong>${selected.property}</strong></div>
      <div class="field"><span>CIDOC-kapcsolás</span><strong>${selected.cidoc}</strong></div>
    </div>

    <section class="detail-section">
      <h3>Definíció</h3>
      <p>${selected.definition}</p>
    </section>

    <section class="detail-section">
      <h3>Használati megjegyzés</h3>
      <p>${selected.usage}</p>
    </section>

    <section class="detail-section">
      <h3>Forma–jelentés kapcsolat</h3>
      <p>${selected.meaning}</p>
    </section>

    <section class="detail-section">
      <h3>Alternatív címkék</h3>
      <div class="tags">${(selected.altLabels || []).map(label => `<span class="tag">${label}</span>`).join('')}</div>
    </section>

    <section class="detail-section">
      <h3>Források</h3>
      <div class="tags">${(selected.sources || []).map(source => `<span class="tag">${source}</span>`).join('')}</div>
    </section>
  `;
}

function render() {
  renderFilters();
  renderList();
  renderDetail();
}

async function init() {
  try {
    const response = await fetch('data/terms.json');
    state.terms = await response.json();
    state.selectedId = state.terms[0]?.id || null;
    render();
  } catch (error) {
    els.termDetail.innerHTML = '<p class="empty-state">A szótáradat nem tölthető be.</p>';
    console.error(error);
  }
}

els.searchInput.addEventListener('input', event => {
  state.search = event.target.value;
  state.selectedId = null;
  renderList();
  renderDetail();
});

init();
