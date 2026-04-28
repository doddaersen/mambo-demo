(() => {
  const categories = {
    'könyvforma': {
      title: 'Könyvformátum',
      description: 'A könyv térbeli, szerkezeti vagy hordozói formája.',
      icon: 'assets/szotar-ikon_formatum.svg'
    },
    'kötésmód': {
      title: 'Kötésmód',
      description: 'A lapok, ívek vagy könyvtestek összekapcsolásának technikai módja.',
      icon: 'assets/szotar-ikon_kotes.svg'
    },
    'gerincszerkezet': {
      title: 'Gerincszerkezet',
      description: 'A könyvgerinc kialakítása, láthatósága és működése.',
      icon: 'assets/szotar-ikon_gerinc.svg'
    },
    'tárolóelem': {
      title: 'Tárolóelem',
      description: 'A könyvhöz tartozó védő-, hordozó- vagy gyűjteményi elem.',
      icon: 'assets/szotar-ikon_tarolo.svg'
    }
  };

  function enhanceCategoryPanels() {
    document.querySelectorAll('.category-panel').forEach(panel => {
      const data = categories[panel.dataset.category];
      if (!data) return;

      panel.classList.add('category-panel-with-icon');

      let media = panel.querySelector('.category-panel-media');
      if (!media) {
        media = document.createElement('span');
        media.className = 'category-panel-media';
        const title = panel.querySelector('.category-panel-title');
        panel.insertBefore(media, title || panel.firstChild);
      }

      media.innerHTML = `<img src="${data.icon}" alt="" loading="lazy" />`;

      const title = panel.querySelector('.category-panel-title');
      if (title) title.textContent = data.title;

      const description = panel.querySelector('.category-panel-description');
      if (description) description.textContent = data.description;
    });
  }

  function enhanceBrowseLabels() {
    document.querySelectorAll('.browse-toggle').forEach(toggle => {
      const data = categories[toggle.dataset.category];
      const label = toggle.querySelector('span:first-child');
      if (!data || !label) return;
      const marker = toggle.classList.contains('open') ? '▾' : '▸';
      label.textContent = `${marker} ${data.title}`;
    });
  }

  function enhance() {
    enhanceCategoryPanels();
    enhanceBrowseLabels();
  }

  const observer = new MutationObserver(enhance);

  window.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelector('#categoryFolders');
    const filters = document.querySelector('#filters');
    if (panels) observer.observe(panels, { childList: true, subtree: true });
    if (filters) observer.observe(filters, { childList: true, subtree: true });
    enhance();
  });

  window.setTimeout(enhance, 500);
})();
