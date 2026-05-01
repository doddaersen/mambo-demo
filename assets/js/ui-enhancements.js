(()=>{
  const quickSearchInput = document.querySelector('#quickSearchInput');
  const sidebarSearchInput = document.querySelector('#searchInput');
  const categoryOverview = document.querySelector('.category-overview');

  function syncSearchMode(){
    const quickValue = quickSearchInput ? quickSearchInput.value : '';
    const sidebarValue = sidebarSearchInput ? sidebarSearchInput.value : '';
    const hasSearch = `${quickValue}${sidebarValue}`.trim().length > 0;

    document.body.classList.toggle('search-active', hasSearch);
    if(categoryOverview){
      categoryOverview.hidden = hasSearch;
    }
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

  function addImageZoomButtons(){
    document.querySelectorAll('#termList .card').forEach(card=>{
      const icon = card.querySelector('.term-icon');
      const img = icon ? icon.querySelector('img') : null;
      if(!icon || !img || icon.querySelector('.zoom-btn')) return;

      const button = document.createElement('button');
      button.className = 'zoom-btn';
      button.type = 'button';
      button.setAttribute('aria-label', 'Ábra nagyítása');
      button.textContent = '⌕';
      button.addEventListener('click', event=>{
        event.preventDefault();
        event.stopPropagation();
        const title = card.querySelector('h3')?.textContent || 'Szócikkábra';
        openImageZoomModal(img.currentSrc || img.src, title);
      });

      icon.appendChild(button);
    });
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
      if(!event.target.closest('.tag')) return;
      window.setTimeout(()=>{
        quickSearchInput.value = sidebarSearchInput.value;
        syncSearchMode();
      }, 0);
    });

    syncSearchMode();
  }

  window.addEventListener('DOMContentLoaded', ()=>{
    ensureImageZoomModal();
    const termList = document.querySelector('#termList');
    if(termList){
      new MutationObserver(addImageZoomButtons).observe(termList, { childList:true, subtree:true });
    }
    addImageZoomButtons();
    window.setTimeout(addImageZoomButtons, 300);
    window.setTimeout(addImageZoomButtons, 900);
  });
})();