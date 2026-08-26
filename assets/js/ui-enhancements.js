(()=>{
  const quickSearchInput = document.querySelector('#quickSearchInput');
  const sidebarSearchInput = document.querySelector('#searchInput');
  const categoryOverview = document.querySelector('.category-overview');

  function hasSearchValue(){
    const quickValue = quickSearchInput ? quickSearchInput.value : '';
    const sidebarValue = sidebarSearchInput ? sidebarSearchInput.value : '';
    return `${quickValue}${sidebarValue}`.trim().length > 0;
  }

  function isSpecificCategoryActive(){
    return Boolean(document.querySelector('.category-panel.active'));
  }

  function updateDefaultHomepageTerms(){
    const defaultHomepageView = !hasSearchValue() && !isSpecificCategoryActive();
    document.querySelectorAll('#termList .card[data-category="anyag"]').forEach(card=>{
      card.hidden = defaultHomepageView && !card.classList.contains('is-open');
    });
  }

  function syncSearchMode(){
    const hasSearch = hasSearchValue();

    document.body.classList.toggle('search-active', hasSearch);
    if(categoryOverview){
      categoryOverview.hidden = hasSearch;
    }
    updateDefaultHomepageTerms();
  }

  function ensureQuickViewStyles(){
    if(document.querySelector('#quickViewShapeFixes')) return;

    const style = document.createElement('style');
    style.id = 'quickViewShapeFixes';
    style.textContent = `
      #termList .term-summary{
        grid-template-columns:98px minmax(0,1fr)!important;
      }

      #termList .term-icon{
        width:98px!important;
        height:98px!important;
        aspect-ratio:1 / 1!important;
        padding:7px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        overflow:hidden!important;
        border:1px solid #dedede!important;
        background:#fff!important;
        box-sizing:border-box!important;
      }

      #termList .term-icon img{
        width:100%!important;
        height:100%!important;
        max-width:none!important;
        max-height:none!important;
        object-fit:contain!important;
        object-position:center center!important;
        display:block!important;
      }

      #termList .zoom-btn{
        right:6px!important;
        bottom:6px!important;
        width:32px!important;
        height:32px!important;
        padding:0!important;
      }

      #termList .zoom-btn svg{
        width:17px!important;
        height:17px!important;
        display:block!important;
      }

      #termList .quickview-alt-labels strong{
        font-size:11.5px!important;
        letter-spacing:.06em!important;
      }

      @media(max-width:560px){
        #termList .term-summary{
          grid-template-columns:78px minmax(0,1fr)!important;
        }

        #termList .term-icon{
          width:78px!important;
          height:78px!important;
          padding:6px!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeQuickViewLabels(){
    document.querySelectorAll('#termList .detail-section .field').forEach(field=>{
      const label = field.querySelector('strong');
      if(!label) return;
      if(label.textContent.trim().toLowerCase() === 'alternatív elnevezések'){
        label.textContent = 'Alternatív elnevezések';
        field.classList.add('quickview-alt-labels');
      }
    });
  }

  function ensureImageZoomModal(){
    let modal = document.querySelector('#imageZoomModal');
    if(modal) return modal;

    modal = document.createElement('div');
    modal.id = 'imageZoomModal';
    modal.className = 'image-zoom-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="image-zoom-backdrop" data-close="true"></div>
      <div class="image-zoom-dialog" role="dialog" aria-modal="true" aria-label="Nagyított szócikkábra">
        <button class="image-zoom-close" type="button" aria-label="Bezárás">×</button>
        <img class="image-zoom-img" alt="">
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', event=>{
      if(event.target.dataset.close || event.target.closest('.image-zoom-close') || event.target.closest('.image-zoom-img')){
        closeImageZoomModal();
      }
    });

    document.addEventListener('keydown', event=>{
      if(event.key === 'Escape') closeImageZoomModal();
    });

    return modal;
  }

  function openImageZoomModal(src, alt){
    const modal = ensureImageZoomModal();
    const img = modal.querySelector('.image-zoom-img');
    img.src = src;
    img.alt = alt || 'Nagyított szócikkábra';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeImageZoomModal(){
    const modal = document.querySelector('#imageZoomModal');
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function isRealIcon(img){
    return img && img.dataset.iconReal === '1';
  }

  function addImageZoomButtons(){
    document.querySelectorAll('#termList .card').forEach(card=>{
      const icon = card.querySelector('.term-icon');
      const img = icon ? icon.querySelector('img') : null;
      if(!icon || !img) return;

      let button = icon.querySelector('.zoom-btn');
      const real = isRealIcon(img);
      icon.classList.toggle('has-real-icon', real);
      icon.classList.toggle('has-placeholder-icon', !real);

      if(!real){
        if(button) button.remove();
        return;
      }

      if(button) return;
      button = document.createElement('button');
      button.className = 'zoom-btn';
      button.type = 'button';
      button.setAttribute('aria-label', 'Ábra nagyítása');
      button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="10.5" cy="10.5" r="5.75" fill="none" stroke="currentColor" stroke-width="1.8"></circle>
          <path d="M15 15l4.25 4.25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
        </svg>
      `;
      button.addEventListener('click', event=>{
        event.preventDefault();
        event.stopPropagation();
        if(!isRealIcon(img)) return;
        const title = card.querySelector('h3')?.textContent || 'Szócikkábra';
        openImageZoomModal(img.currentSrc || img.src, title);
      });

      icon.appendChild(button);
    });
    normalizeQuickViewLabels();
    updateDefaultHomepageTerms();
  }

  if(quickSearchInput && sidebarSearchInput){
    quickSearchInput.addEventListener('input', ()=>{
      sidebarSearchInput.value = quickSearchInput.value;
      sidebarSearchInput.dispatchEvent(new Event('input', { bubbles:true }));
      syncSearchMode();
    });

    sidebarSearchInput.addEventListener('input', ()=>{
      if(document.activeElement !== quickSearchInput){
        quickSearchInput.value = sidebarSearchInput.value;
      }
      syncSearchMode();
    });

    document.addEventListener('click', event=>{
      if(!event.target.closest('.tag, .category-panel, .browse-term')) return;
      window.setTimeout(()=>{
        quickSearchInput.value = sidebarSearchInput.value;
        syncSearchMode();
      }, 0);
    });

    syncSearchMode();
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    ensureQuickViewStyles();
    ensureImageZoomModal();
    const termList = document.querySelector('#termList');
    if(termList){
      new MutationObserver(()=>{
        addImageZoomButtons();
        normalizeQuickViewLabels();
        updateDefaultHomepageTerms();
      }).observe(termList, { childList:true, subtree:true, attributes:true, attributeFilter:['src','data-icon-real','class'] });
    }
    addImageZoomButtons();
    normalizeQuickViewLabels();
    updateDefaultHomepageTerms();
    window.setTimeout(addImageZoomButtons, 300);
    window.setTimeout(addImageZoomButtons, 900);
    window.setTimeout(normalizeQuickViewLabels, 300);
    window.setTimeout(updateDefaultHomepageTerms, 1200);
  });
})();