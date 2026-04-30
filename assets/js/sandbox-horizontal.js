(() => {
  const icons = {
    'könyvforma': 'assets/szotar_ikon_formatum_szines..png?v=format-double-dot-fix-1',
    'kötésmód': 'assets/szotar_ikon_kotes_szines.png?v=format-double-dot-fix-1',
    'gerincszerkezet': 'assets/szotar_ikon_gerinc_szines.png?v=format-double-dot-fix-1',
    'tárolóelem': 'assets/szotar_ikon_tarolo_szines.png?v=format-double-dot-fix-1'
  };

  function setOpen(card, open) {
    const details = card.querySelector('details');
    const hint = card.querySelector('.open-hint');

    card.classList.toggle('is-open', open);
    if (details) details.open = open;
    if (hint) hint.textContent = open ? 'Bezárás' : 'Részletek';
  }

  function closeOtherCards(activeCard) {
    document.querySelectorAll('#termList .card.is-open').forEach(card => {
      if (card !== activeCard) setOpen(card, false);
    });
  }

  function toggleCard(card) {
    const nextState = !card.classList.contains('is-open');
    closeOtherCards(card);
    setOpen(card, nextState);
  }

  function buildCardHeader(card) {
    if (card.dataset.horizontalEnhanced === '1') return;

    const top = card.querySelector('.card-top');
    const body = card.querySelector('.card-body');
    const definition = card.querySelector('.definition');
    const details = card.querySelector('details');

    if (!top || !body || !definition || !details) return;

    card.dataset.horizontalEnhanced = '1';

    const category = card.dataset.category || 'könyvforma';
    const iconSrc = icons[category] || icons['könyvforma'];

    const summary = document.createElement('div');
    summary.className = 'term-summary';
    summary.setAttribute('role', 'button');
    summary.setAttribute('tabindex', '0');
    summary.setAttribute('aria-label', 'Szócikk részleteinek megnyitása');

    summary.innerHTML = `
      <div class="term-icon"><img src="${iconSrc}" alt=""></div>
      <div class="term-content">
        <span class="open-hint">Részletek</span>
      </div>
    `;

    const content = summary.querySelector('.term-content');
    const hint = summary.querySelector('.open-hint');

    content.insertBefore(top, hint);
    content.insertBefore(definition, hint);
    card.insertBefore(summary, body);

    summary.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      toggleCard(card);
    });

    summary.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleCard(card);
    });

    setOpen(card, false);
  }

  function enhanceCards() {
    document.querySelectorAll('#termList .card').forEach(buildCardHeader);
  }

  window.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('#termList');
    if (list) {
      new MutationObserver(enhanceCards).observe(list, { childList: true });
    }

    enhanceCards();
    setTimeout(enhanceCards, 300);
    setTimeout(enhanceCards, 900);
  });
})();
