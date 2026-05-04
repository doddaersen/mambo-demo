(()=>{
  const excludedIds=new Set([
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

  const totalRemoved=excludedIds.size;
  const originalTotal=80;
  const cleanedTotal=originalTotal-totalRemoved;

  function cleanCoverLayer(){
    excludedIds.forEach(id=>{
      document.querySelectorAll(`[data-term-id="${CSS.escape(id)}"], [data-id="${CSS.escape(id)}"]`).forEach(el=>el.remove());
    });

    document.querySelectorAll('.browse-group').forEach(group=>{
      const count=group.querySelector('.count');
      const terms=group.querySelectorAll('.browse-term').length;
      if(count) count.textContent=String(terms);
    });

    document.querySelectorAll('.category-panel').forEach(panel=>{
      const category=panel.dataset.category;
      const count=panel.querySelector('.category-panel-count');
      if(!count) return;
      if(category==='borítószerkezet'){
        count.textContent='4';
      }
    });

    const resultCount=document.querySelector('#count');
    if(resultCount){
      const visibleCards=document.querySelectorAll('#termList .card').length;
      resultCount.textContent=`${visibleCards} / ${cleanedTotal} szócikk`;
    }
  }

  function init(){
    const list=document.querySelector('#termList');
    if(list){
      new MutationObserver(cleanCoverLayer).observe(list,{childList:true,subtree:true});
    }
    const filters=document.querySelector('#filters');
    if(filters){
      new MutationObserver(cleanCoverLayer).observe(filters,{childList:true,subtree:true});
    }
    const categories=document.querySelector('#categoryFolders');
    if(categories){
      new MutationObserver(cleanCoverLayer).observe(categories,{childList:true,subtree:true});
    }
    cleanCoverLayer();
    setTimeout(cleanCoverLayer,150);
    setTimeout(cleanCoverLayer,500);
    setTimeout(cleanCoverLayer,1000);
  }

  if(document.readyState==='loading'){
    window.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();
