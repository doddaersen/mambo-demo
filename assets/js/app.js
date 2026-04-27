const state = {
  terms: [],
  selectedCategory: 'összes',
  search: '',
  view: 'cards',
  openCategories: new Set(['kötésmód'])
};

const els = {
  filters: document.querySelector('#filters'),
  categoryFolders: document.querySelector('#categoryFolders'),
  searchInput: document.querySelector('#searchInput'),
  viewButtons: document.querySelectorAll('.view-button'),
  termList: document.querySelector('#termList'),
  termsTopline: document.querySelector('#termsTopline'),
  empty: document.querySelector('#empty'),
  count: document.querySelector('#count')
};

const categoryOrder = ['kötésmód', 'gerincszerkezet', 'könyvforma', 'tárolóelem'];

const categoryMeta = {
  'kötésmód': {
    title: 'Kötésmód',
    description: 'A lapok, ívek vagy könyvtestek összekapcsolásának technikai módja.'
  },
  'gerincszerkezet': {
    title: 'Gerincszerkezet',
    description: 'A könyvtest hátoldali szerkezeti kialakítása.'
  },
  'könyvforma': {
    title: 'Könyvforma',
    description: 'A mű egészének tárgyi, használati és olvasási logikája.'
  },
  'tárolóelem': {
    title: 'Tárolóelem',
    description: 'A műhöz tartozó védő vagy tárolóelem típusa.'
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
    const categoryDiff = categoryOrder.indexOf(displayCategory(a.category)) - categoryOrder.indexOf(displayCategory(b.category));
    return categoryDiff || byHuLabel(a, b);
  });
}

function getVisibleTerms() {
  const query = normalize(state.search.trim());
  const filtered = state.terms.filter(term => !query || getSearchText(term).includes(query));
  return sortTerms(filtered);
}

function getFilteredTerms() {
  const visible = getVisibleTerms();
  if (state.selectedCategory === 'összes') return visible;
  return visible.filter(term => displayCategory(term.category) === state.selectedCategory);
}

function getCategoryTerms(category) {
  return getVisibleTerms().filter(term => displayCategory(term.category) === category);
}

function getCategoryCount(category) {
  if (category === 'összes') return state.terms.length;
  return state.terms.filter(term => displayCategory(term.category) === category).length;
}

function setCategory(category, shouldScroll = false) {
  state.selectedCategory = category;
  if (category !== 'összes') state.openCategories.add(category);
  renderCategoryBrowse();
  renderCategoryPanels();
  renderCards();

  if (shouldScroll && els.termsTopline) {
    els.termsTopline.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderCategoryBrowse() {
  els.filters.innerHTML = categoryOrder.map(category => {
    const isOpen = state.openCategories.has(category);
    const terms = getCategoryTerms(category);
    const meta = categoryMeta[category];
    return `
      <section class="browse-group">
        <button class="browse-toggle ${isOpen ? 'open' : ''}" type="button" data-category="${escapeHtml(category)}" aria-expanded="${isOpen}">
          <span>${isOpen ? '▾' : '▸'} ${escapeHtml(meta.title)}</span>
          <span class="count">${terms.length}</span>
        </button>
        <div class="browse-terms ${isOpen ? 'open' : ''}">
          ${terms.map(term => `
            <button class="browse-term ${displayCategory(term.category) === state.selectedCategory ? 'active' : ''}" type="button" data-id="${escapeHtml(term.id)}">
              ${escapeHtml(term.prefLabelHu)}
            </button>
          `).join('')}
        </div>
      </section>
    `;
  }).join('');

  els.filters.querySelectorAll('.browse-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      if (state.openCategories.has(category)) {
        state.openCategories.delete(category);
      } else {
        state.openCategories.add(category);
      }
      renderCategoryBrowse();
    });
  });

  els.filters.querySelectorAll('.browse-term').forEach(button => {
    button.addEventListener('click', () => {
      const term = state.terms.find(item => item.id === button.dataset.id);
      if (!term) return;
      state.selectedCategory = displayCategory(term.category);
      renderCategoryBrowse();
      renderCategoryPanels();
      renderCards();
      requestAnimationFrame(() => {
        const card = document.querySelector(`[data-term-id="${CSS.escape(term.id)}"]`);
        if (card) {
          const details = card.querySelector('details');
          if (details) details.open = true;
          card.classList.add('is-open');
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  });
}

function renderCategoryPanels() {
  if (!els.categoryFolders) return;

  els.categoryFolders.innerHTML = categoryOrder.map(category => {
    const meta = categoryMeta[category];
    const count = getCategoryCount(category);
    return `
      <button class="category-panel ${category === state.selectedCategory ? 'active' : ''}" type="button" data-category="${escapeHtml(category)}">
        <span class="category-panel-accent" data-category="${escapeHtml(category)}"></span>
        <h3 class="category-panel-title">${escapeHtml(meta.title)}</h3>
        <p class="category-panel-description">${escapeHtml(meta.description)}</p>
        <span class="category-panel-action">${count} szócikk →</span>
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

function noteParagraph(value) {
  if (!value) return '';
  return `<p class="detail-paragraph">${escapeHtml(value)}</p>`;
}

function tagField(label, values) {
  return `<div class="field"><strong>${escapeHtml(label)}</strong><div class="tag-list">${renderTags(values)}</div></div>`;
}

function sourceField(label, values) {
  return `<div class="field"><strong>${escapeHtml(label)}</strong><div class="source-list">${renderSourceItems(values)}</div></div>`;
}

function statusField(label, value) {
  return `<div class="field technical-field"><strong>${escapeHtml(label)}</strong><span class="status-badge">${escapeHtml(value || 'pilot')}</span></div>`;
}

function detailSection(title, content) {
  return `<section class="detail-section"><h4>${escapeHtml(title)}</h4>${content}</section>`;
}

function technicalGroup(title, content) {
  return `<div class="technical-group"><div class="technical-subheading">${escapeHtml(title)}</div>${content}</div>`;
}

function getCardMarkup(term) {
  const category = displayCategory(term.category);
  return `
    <article class="card" data-category="${escapeHtml(category)}" data-term-id="${escapeHtml(term.id)}">
      <div class="card-top">
        <span class="category" data-category="${escapeHtml(category)}">${escapeHtml(category)}</span>
        <h3>${escapeHtml(term.prefLabelHu)}</h3>
        <div class="en">${escapeHtml(term.prefLabelEn)}</div>
      </div>
      <div class="card-body">
        <p class="definition">${escapeHtml(term.definition)}</p>
        <details>
          <summary><span>Részletes nézet</span><span class="summary-icon" aria-hidden="true">↓</span></summary>
          <div class="detail-block">
            ${detailSection('Használat és értelmezés', `
              ${noteParagraph(term.usage)}
              ${noteParagraph(term.meaning)}
            `)}
            ${detailSection('Terminológiai kapcsolatok', `
              ${tagField('Más megnevezések', term.altLabels)}
              ${tagField('Kapcsolódó fogalmak', term.relatedTerms)}
            `)}
            <section class="detail-section technical-data">
              <h4>Technikai adatok</h4>
              ${technicalGroup('Rekord', `
                <div class="ontology-row">
                  ${field('Azonosító', term.id)}
                  ${statusField('Státusz', term.demoStatus)}
                </div>
              `)}
              ${technicalGroup('Ontológiai kapcsolás', `
                <div class="ontology-row">
                  ${field('MAMBO-osztály', term.class)}
                  ${field('MAMBO-property', term.property)}
                </div>
                ${field('CIDOC', term.cidoc)}
              `)}
              ${technicalGroup('Leírás forrásai', sourceField('Források', term.sources))}
            </section>
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

async function loadDefinitionOverrides() {
  try {
    const response = await fetch('data/definition-overrides.json');
    if (!response.ok) return {};
    return await response.json();
  } catch (error) {
    console.warn('Definition overrides could not be loaded; using base terms.json definitions.', error);
    return {};
  }
}

async function init() {
  try {
    const termsResponse = await fetch('data/terms.json');
    const terms = await termsResponse.json();
    const definitionOverrides = await loadDefinitionOverrides();

    state.terms = terms.map(term => ({
      ...term,
      definition: definitionOverrides[term.id] || term.definition
    }));

    renderCategoryBrowse();
    renderCategoryPanels();
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
  if (state.search.trim()) {
    state.selectedCategory = 'összes';
    state.openCategories = new Set(categoryOrder);
  }
  renderCategoryBrowse();
  renderCategoryPanels();
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
    state.selectedCategory = 'összes';
    state.openCategories = new Set(categoryOrder);
    els.searchInput.value = state.search;
    renderCategoryBrowse();
    renderCategoryPanels();
    renderCards();
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
