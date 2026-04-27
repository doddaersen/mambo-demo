const state = {
  terms: [],
  selectedCategory: 'Összes',
  search: '',
  selectedId: null,
  sort: 'abc'
};

const els = {
  filters: document.querySelector('#filters'),
  searchInput: document.querySelector('#searchInput'),
  sortSelect: document.querySelector('#sortSelect'),
  termList: document.querySelector('#termList'),
  termDetail: document.querySelector('#termDetail'),
  count: document.querySelector('#count')
};

const categoryOrder = ['Kötésmód', 'Gerincszerkezet', 'Könyvforma', 'Tárolóelem'];

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function byHuLabel(a, b) {
  return a.prefLabelHu.localeCompare(b.prefLabelHu, 'hu');
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
    term.demoStatus,
    ...(term.altLabels || []),
    ...(term.relatedTerms || []),
    ...(term.sources || [])
  ].join(' '));
}

function sortTerms(terms) {
  return [...terms].sort((a, b) => {
    if (state.sort === 'id') return a.id.localeCompare(b.id, 'hu');
    if (state.sort === 'category') {
      const categoryDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
      return categoryDiff || byHuLabel(a, b);
    }
    return byHuLabel(a, b);
  });
}

function getFilteredTerms() {
  const query = normalize(state.search.trim());
  const filtered = state.terms.filter(term => {
    const categoryMatch = state.selectedCategory === 'Összes' || term.category === state.selectedCategory;
    const queryMatch = !query || getSearchText(term).includes(query);
    return categoryMatch && queryMatch;
  });
  return sortTerms(filtered);
}

function renderFilters() {
  const categories = ['Összes', ...categoryOrder.filter(category => state.terms.some(term => term.category === category))];
  els.filters.innerHTML = categories.map(category => `
    <button class="filter-button ${category === state.selectedCategory ? 'active' : ''}" type="button" data-category="${category}">
      ${category}
    </button>
  `).join('');

  els.filters.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedCategory = button.dataset.category;
      state.selectedId = null;
      render();
    });
  });
}

function renderList() {
  const terms = getFilteredTerms();
  els.count.textContent = `${terms.length} elem`;

  if (!terms.length) {
    els.termList.innerHTML = '<p class="empty-state" style="padding:18px;">Nincs találat.</p>';
    return;
  }

  els.termList.innerHTML = terms.map(term => `
    <button class="term-button ${term.id === state.selectedId ? 'active' : ''}" type="button" data-id="${term.id}">
      <span class="term-title">${term.prefLabelHu}</span>
      <span class="term-meta">${term.prefLabelEn} · ${term.category} · ${term.id}</span>
    </button>
  `).join('');

  els.termList.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedId = button.dataset.id;
      renderDetail();
      renderList();
      history.replaceState(null, '', `#${encodeURIComponent(state.selectedId)}`);
    });
  });
}

function renderTags(items) {
  if (!items || !items.length) return '<span class="tag muted-tag">nincs megadva</span>';
  return items.map(item => `<span class="tag">${item}</span>`).join('');
}

function renderDetail() {
  const terms = getFilteredTerms();
  const hashId = decodeURIComponent(location.hash.replace('#', ''));
  const selected = state.terms.find(term => term.id === state.selectedId)
    || state.terms.find(term => term.id === hashId)
    || terms[0];

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
      <div class="field"><span>Demo-státusz</span><strong>${selected.demoStatus || 'pilot'}</strong></div>
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
      <h3>Kapcsolódó fogalmak</h3>
      <div class="tags">${renderTags(selected.relatedTerms)}</div>
    </section>

    <section class="detail-section">
      <h3>Alternatív címkék</h3>
      <div class="tags">${renderTags(selected.altLabels)}</div>
    </section>

    <section class="detail-section">
      <h3>Források</h3>
      <div class="tags">${renderTags(selected.sources)}</div>
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
    const hashId = decodeURIComponent(location.hash.replace('#', ''));
    state.selectedId = state.terms.find(term => term.id === hashId)?.id || state.terms[0]?.id || null;
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

els.sortSelect.addEventListener('change', event => {
  state.sort = event.target.value;
  renderList();
  renderDetail();
});

init();
