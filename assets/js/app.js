const state = {
  terms: [],
  selectedCategory: 'összes',
  search: '',
  sort: 'abc',
  view: 'cards'
};

const els = {
  filters: document.querySelector('#filters'),
  categoryFolders: document.querySelector('#categoryFolders'),
  searchInput: document.querySelector('#searchInput'),
  sortSelect: document.querySelector('#sortSelect'),
  viewButtons: document.querySelectorAll('.view-button'),
  termList: document.querySelector('#termList'),
  termsTopline: document.querySelector('#termsTopline'),
  empty: document.querySelector('#empty'),
  count: document.querySelector('#count')
};

const categoryOrder = ['összes', 'kötésmód', 'gerincszerkezet', 'könyvforma', 'tárolóelem'];

const categoryMeta = {
  'kötésmód': {
    title: 'Kötésmód',
    description: 'A lapok, ívek vagy könyvtestek technikai összekapcsolásának módja.',
    examples: ['kopt kötés', 'japán fűzés', 'spirálkötés']
  },
  'gerincszerkezet': {
    title: 'Gerincszerkezet',
    description: 'A könyvtest hátoldali kialakítása és a fűzés láthatósága.',
    examples: ['nyitott gerinc', 'fedett gerinc', 'üreges gerinc']
  },
  'könyvforma': {
    title: 'Könyvforma',
    description: 'A mű egészének tárgyi, használati és olvasási logikája.',
    examples: ['leporelló', 'dos-à-dos', 'alagútkönyv']
  },
  'tárolóelem': {
    title: 'Tárolóelem',
    description: 'A műhöz tartozó tok, doboz, mappa vagy más védőegység.',
    examples: ['tok', 'doboz', 'archiváló doboz']
  }
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function displayCategory(category) {
  return String(category || '').toLowerCase();
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
      const categoryDiff = categoryOrder.indexOf(displayCategory(a.category)) - categoryOrder.indexOf(displayCategory(b.category));
      return categoryDiff || byHuLabel(a, b);
    }
    return byHuLabel(a, b);
  });
}

function getFilteredTerms() {
  const query = normalize(state.search.trim());
  const filtered = state.terms.filter(term => {
    const categoryMatch = state.selectedCategory === 'összes' || displayCategory(term.category) === state.selectedCategory;
    const queryMatch = !query || getSearchText(term).includes(query);
    return categoryMatch && queryMatch;
  });
  return sortTerms(filtered);
}

function getCategoryCount(category) {
  if (category === 'összes') return state.terms.length;
  return state.terms.filter(term => displayCategory(term.category) === category).length;
}

function setCategory(category, shouldScroll = false) {
  state.selectedCategory = category;
  renderFilters();
  renderCategoryFolders();
  renderCards();

  if (shouldScroll && els.termsTopline) {
    els.termsTopline.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderFilters() {
  els.filters.innerHTML = categoryOrder.map(category => `
    <button class="filter ${category === state.selectedCategory ? 'active' : ''}" type="button" data-category="${escapeHtml(category)}">
      <span class="filter-name">${escapeHtml(category)}</span>
      <span class="count">${getCategoryCount(category)}</span>
    </button>
  `).join('');

  els.filters.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => setCategory(button.dataset.category));
  });
}

function renderCategoryFolders() {
  if (!els.categoryFolders) return;

  const categories = categoryOrder.filter(category => category !== 'összes');
  els.categoryFolders.innerHTML = categories.map(category => {
    const meta = categoryMeta[category];
    const count = getCategoryCount(category);
    return `
      <button class="folder-card ${category === state.selectedCategory ? 'active' : ''}" type="button" data-category="${escapeHtml(category)}">
        <span class="folder-tab"></span>
        <span class="folder-category" data-category="${escapeHtml(category)}">${escapeHtml(meta.title)}</span>
        <strong>${escapeHtml(meta.description)}</strong>
        <span class="folder-count">${count} szócikk</span>
        <span class="folder-examples">pl. ${meta.examples.map(escapeHtml).join(', ')}</span>
        <span class="folder-open">Megnyitás →</span>
      </button>
    `;
  }).join('');

  els.categoryFolders.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => setCategory(button.dataset.category, true));
  });
}

function renderTags(items) {
  if (!items || !items.length) return '<span class="tag muted-tag">nincs megadva</span>';
  return items.map(item => `<button class="tag" type="button" data-tag="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('');
}

function renderSourceItems(items) {
  if (!items || !items.length) return '<span class="source-item">—</span>';
  return items.map(item => `<span class="source-item">${escapeHtml(item)}</span>`).join('');
}

function field(label, value) {
  return `<div class="field"><strong>${escapeHtml(label)}</strong>${escapeHtml(value || '—')}</div>`;
}

function tagField(label, values) {
  return `<div class="field"><strong>${escapeHtml(label)}</strong><div class="tag-list">${renderTags(values)}</div></div>`;
}

function sourceField(label, values) {
  return `<div class="field"><strong>${escapeHtml(label)}</strong><div class="source-list">${renderSourceItems(values)}</div></div>`;
}

function statusField(label, value) {
  return `<div class="field"><strong>${escapeHtml(label)}</strong><span class="status-badge">${escapeHtml(value || 'pilot')}</span></div>`;
}

function getCardMarkup(term) {
  const category = displayCategory(term.category);
  return `
    <article class="card" data-category="${escapeHtml(category)}">
      <div class="card-top">
        <h3>${escapeHtml(term.prefLabelHu)}</h3>
        <div class="en">${escapeHtml(term.prefLabelEn)}</div>
        <div class="meta-line">
          <span class="category" data-category="${escapeHtml(category)}">${escapeHtml(category)}</span>
          <span class="term-id">${escapeHtml(term.id)}</span>
        </div>
      </div>
      <div class="card-body">
        <p class="definition">${escapeHtml(term.definition)}</p>
        <details>
          <summary>Részletek</summary>
          <div class="detail-block">
            ${tagField('Alternatív címkék', term.altLabels)}
            ${field('Használati megjegyzés', term.usage)}
            ${field('Forma–jelentés kapcsolat', term.meaning)}
            <div class="ontology-row">
              ${field('MAMBO-osztály', term.class)}
              ${field('MAMBO-property', term.property)}
            </div>
            ${field('CIDOC', term.cidoc)}
            ${tagField('Kapcsolódó fogalmak', term.relatedTerms)}
            ${sourceField('Forrás', term.sources)}
            ${statusField('Demo-státusz', term.demoStatus)}
          </div>
        </details>
      </div>
    </article>
  `;
}

function renderCards() {
  const terms = getFilteredTerms();
  els.count.textContent = `${terms.length} / ${state.terms.length} szócikk`;
  els.termList.classList.toggle('list-view', state.view === 'list');
  els.empty.classList.toggle('show', terms.length === 0);

  els.termList.innerHTML = terms.map(getCardMarkup).join('');
}

function renderViewButtons() {
  els.viewButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.view === state.view);
  });
}

async function init() {
  try {
    const response = await fetch('data/terms.json');
    state.terms = await response.json();
    renderFilters();
    renderCategoryFolders();
    renderViewButtons();
    renderCards();
  } catch (error) {
    els.empty.textContent = 'A szótáradat nem tölthető be.';
    els.empty.classList.add('show');
    console.error(error);
  }
}

els.searchInput.addEventListener('input', event => {
  state.search = event.target.value;
  renderCards();
});

els.sortSelect.addEventListener('change', event => {
  state.sort = event.target.value;
  renderCards();
});

els.viewButtons.forEach(button => {
  button.addEventListener('click', () => {
    state.view = button.dataset.view;
    renderViewButtons();
    renderCards();
  });
});

els.termList.addEventListener('click', event => {
  const tag = event.target.closest('.tag');
  const summary = event.target.closest('summary');
  const card = event.target.closest('.card');

  if (tag) {
    state.search = tag.dataset.tag || '';
    els.searchInput.value = state.search;
    setCategory('összes');
    els.searchInput.focus();
    return;
  }

  if (!card) return;
  const details = card.querySelector('details');
  if (!details) return;

  if (summary) event.preventDefault();
  const shouldOpen = !details.open;

  els.termList.querySelectorAll('.card.is-open').forEach(openCard => {
    if (openCard !== card) {
      const openDetails = openCard.querySelector('details');
      if (openDetails) openDetails.open = false;
      openCard.classList.remove('is-open');
    }
  });

  details.open = shouldOpen;
  card.classList.toggle('is-open', shouldOpen);
});

init();
