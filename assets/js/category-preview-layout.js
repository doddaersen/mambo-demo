(()=>{
  const primaryCategories = [
    {key:'formátum', title:'Formátum', count:7, icon:'assets/icons/kategoria-formatum-v2.png?v=preview-cats'},
    {key:'kötésmód', title:'Kötés és fűzés', count:10, icon:'assets/icons/kategoria-fuzes.png?v=preview-cats', combined:['kötésmód','fűzésmód']},
    {key:'borítószerkezet', title:'Borító', count:15, icon:'assets/icons/kategoria-kotes-2.png?v=preview-cats'},
    {key:'gerincszerkezet', title:'Gerinc', count:2, icon:'assets/icons/kategoria-gerinc.png?v=preview-cats'},
    {key:'díszítés', title:'Díszítés', count:12, icon:'assets/icons/kephamarosan.png?v=preview-cats'}
  ];

  const secondaryCategories = [
    {key:'záródás', title:'Záródás', count:12, icon:'assets/icons/kategoria-zarodas-2.png?v=preview-cats'},
    {key:'tárolóelem', title:'Tárolóelem', count:6, icon:'assets/icons/kategoria-tarolo.png?v=preview-cats'},
    {key:'anyag', title:'Anyag', count:16, icon:'assets/icons/kephamarosan.png?v=preview-cats'}
  ];

  function escapeHtml(value){
    return String(value || '').replace(/&/g,'&amp;').replace(/\"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function getTargets(item){
    return item.combined && item.combined.length ? item.combined : [item.key];
  }

  function cardMarkup(item, variant){
    const targets = getTargets(item).join('|');
    return `<button class="preview-category-card ${variant}" type="button" data-preview-targets="${escapeHtml(targets)}">
      <span class="preview-category-icon"><img src="${escapeHtml(item.icon)}" alt="" loading="lazy"></span>
      <span class="preview-category-title">${escapeHtml(item.title)}</span>
      <span class="preview-category-count">${item.count} szócikk</span>
    </button>`;
  }

  function renderPreviewCategories(){
    const root = document.querySelector('#categoryFolders');
    if(!root) return;

    root.className = 'preview-category-layout';
    root.innerHTML = `
      <section class="preview-category-section preview-primary-section">
        <div class="preview-category-heading"><span></span><h3>Elsődleges leírási rétegek</h3></div>
        <div class="preview-primary-grid">${primaryCategories.map(item => cardMarkup(item,'primary')).join('')}</div>
      </section>
      <section class="preview-category-section preview-secondary-section">
        <div class="preview-category-heading"><span></span><h3>További leírási rétegek</h3></div>
        <div class="preview-secondary-grid">${secondaryCategories.map(item => cardMarkup(item,'secondary')).join('')}</div>
      </section>
    `;

    root.querySelectorAll('[data-preview-targets]').forEach(button => {
      button.addEventListener('click', () => {
        const targets = (button.dataset.previewTargets || '').split('|').filter(Boolean);
        const targetCategory = targets[0] || '';
        const originalButton = [...document.querySelectorAll('.category-panel[data-category]')]
          .find(panel => panel.dataset.category === targetCategory);

        if(originalButton){
          originalButton.click();
        }else{
          const cards = [...document.querySelectorAll('#termList .card')];
          cards.forEach(card => {
            const visible = targets.includes(card.dataset.category);
            card.style.display = visible ? '' : 'none';
          });
          const count = document.querySelector('#count');
          if(count){
            const visibleCount = cards.filter(card => card.style.display !== 'none').length;
            count.textContent = `${visibleCount} / 80 szócikk`;
          }
          const top = document.querySelector('#termsTopline');
          if(top) top.scrollIntoView({behavior:'smooth', block:'start'});
        }
      });
    });
  }

  function waitForAppRender(){
    const root = document.querySelector('#categoryFolders');
    if(!root) return;
    const observer = new MutationObserver(() => {
      if(root.querySelector('.category-panel')){
        observer.disconnect();
        renderPreviewCategories();
      }
    });
    observer.observe(root,{childList:true,subtree:false});
    setTimeout(renderPreviewCategories,800);
    setTimeout(renderPreviewCategories,1600);
  }

  if(document.readyState === 'loading') window.addEventListener('DOMContentLoaded', waitForAppRender);
  else waitForAppRender();
})();
