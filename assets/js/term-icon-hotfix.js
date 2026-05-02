(()=>{
  const iconVersion='?v=term-icons-20260502';
  const iconMap={
    'mambo:sewing-002':'assets/icons/fuzes-irka.png',
    'mambo:binding-004':'assets/icons/kotes-gyurus.png',
    'mambo:binding-005':'assets/icons/fuzes-longstich.png',
    'mambo:bind-004':'assets/icons/fuzes-irka.png',
    'mambo:bind-030':'assets/icons/kotes-gyurus.png',
    'mambo:bind-031':'assets/icons/fuzes-longstich.png'
  };
  function applyTermIcons(){
    Object.entries(iconMap).forEach(([id,src])=>{
      const card=document.querySelector(`#termList .card[data-term-id="${CSS.escape(id)}"]`);
      if(!card)return;
      const img=card.querySelector('.term-icon img');
      if(!img)return;
      const finalSrc=src+iconVersion;
      if(img.getAttribute('src')!==finalSrc){
        img.setAttribute('src',finalSrc);
        img.dataset.iconReal='1';
        img.dataset.index='0';
        img.dataset.candidates=finalSrc;
        img.dataset.zoomableCandidates='1';
      }
    });
  }
  window.addEventListener('DOMContentLoaded',()=>{
    const list=document.querySelector('#termList');
    if(list)new MutationObserver(applyTermIcons).observe(list,{childList:true,subtree:true});
    applyTermIcons();
    setTimeout(applyTermIcons,300);
    setTimeout(applyTermIcons,900);
    setTimeout(applyTermIcons,1800);
  });
})();
