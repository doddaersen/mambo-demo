(() => {
  const iconVersion = '?v=icon-fix-1';
  const categories = {
    'könyvforma': {
      title: 'Könyvformátum',
      description: 'A könyv térbeli, szerkezeti vagy hordozói formája.',
      icon: 'assets/szotar-ikon_formatum.svg' + iconVersion
    },
    'kötésmód': {
      title: 'Kötésmód',
      description: 'A lapok, ívek vagy könyvtestek összekapcsolásának technikai módja.',
      icon: 'assets/szotar-ikon_kotes.svg' + iconVersion
    },
    'gerincszerkezet': {
      title: 'Gerincszerkezet',
      description: 'A könyvgerinc kialakítása, láthatósága és működése.',
      icon: 'assets/szotar-ikon_gerinc.svg' + iconVersion
    },
    'tárolóelem': {
      title: 'Tárolóelem',
      description: 'A könyvhöz tartozó védő-, hordozó- vagy gyűjteményi elem.',
      icon: 'assets/szotar-ikon_tarolo.svg' + iconVersion
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

      let img = media.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        img.alt = '';
        img.loading = 'lazy';
        media.appendChild(img);
      }
      if (img.getAttribute('src') !== data.icon) img.setAttribute('src', data.icon);

      const title = panel.querySelector('.category-panel-title');
      if (title && title.textContent !== data.title) title.textContent = data.title;

      const description = panel.querySelector('.category-panel-description');
      if (description && description.textContent !== data.description) description.textContent = data.description;
    });
  }

  function enhanceBrowseLabels() {
    document.querySelectorAll('.browse-toggle').forEach(toggle => {
      const data = categories[toggle.dataset.category];
      const label = toggle.querySelector('span:first-child');
      if (!data || !label) return;
      const marker = toggle.classList.contains('open') ? '▾' : '▸';
      const text = `${marker} ${data.title}`;
      if (label.textContent !== text) label.textContent = text;
    });
  }

  function enhance() {
    enhanceCategoryPanels();
    enhanceBrowseLabels();
  }

  window.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelector('#categoryFolders');
    const filters = document.querySelector('#filters');
    const observer = new MutationObserver(enhance);

    if (panels) observer.observe(panels, { childList: true });
    if (filters) observer.observe(filters, { childList: true });

    enhance();
    window.setTimeout(enhance, 300);
    window.setTimeout(enhance, 900);
  });
})();
