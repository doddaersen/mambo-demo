(()=>{
  const hiddenTermIds=new Set([
    'mambo:cover-101',
    'mambo:cover-102',
    'mambo:cover-103',
    'mambo:cover-104',
    'mambo:cover-105',
    'mambo:cover-106',
    'mambo:cover-107',
    'mambo:cover-108',
    'mambo:cover-109',
    'mambo:cover-110',
    'mambo:cover-111'
  ]);

  function updateCounts(){
    const cards=[...document.querySelectorAll('#termList .card')]
      .filter(card=>!card.hidden && card.style.display!=='none');
    const totalVisible=69;
    const count=document.querySelector('#count');
    if(count) count.textContent=`${cards.length} / ${totalVisible} szócikk`;

    document.querySelectorAll('.browse-group').forEach(group=>{
      const countEl=group.querySelector('.count');
      const visibleTerms=[...group.querySelectorAll('.browse-term')]
        .filter(term=>!term.hidden && term.style.display!=='none');
      if(countEl) countEl.textContent=String(visibleTerms.length);
    });

    document.querySelectorAll('.category-panel').forEach(panel=>{
      const category=panel.dataset.category;
      const countEl=panel.querySelector('.category-panel-count');
      if(category==='borítószerkezet' && countEl) countEl.textContent='4';
    });
  }

  function applyVisibilityFilter(){
    hiddenTermIds.forEach(id=>{
      document.querySelectorAll(`[data-term-id="${CSS.escape(id)}"], [data-id="${CSS.escape(id)}"]`).forEach(el=>{
        el.hidden=true;
        el.style.display='none';
      });
    });
    updateCounts();
  }

  function init(){
    ['#termList','#filters','#categoryFolders'].forEach(selector=>{
      const node=document.querySelector(selector);
      if(node){
        new MutationObserver(applyVisibilityFilter).observe(node,{childList:true,subtree:true});
      }
    });
    applyVisibilityFilter();
    setTimeout(applyVisibilityFilter,150);
    setTimeout(applyVisibilityFilter,500);
    setTimeout(applyVisibilityFilter,1000);
  }

  if(document.readyState==='loading'){
    window.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();
