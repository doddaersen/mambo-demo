(()=>{
  function removeEmptyRelatedFields(){
    document.querySelectorAll('#termList .field').forEach(field=>{
      const label=field.querySelector('strong');
      if(!label) return;
      const labelText=label.textContent.trim().toLowerCase();
      if(labelText!=='kapcsolódó fogalmak') return;
      const hasOnlyEmptyTag=field.querySelector('.muted-tag') && !field.querySelector('.tag:not(.muted-tag)');
      const tagList=field.querySelector('.tag-list');
      const hasNoRealContent=!tagList || !tagList.textContent.trim() || hasOnlyEmptyTag;
      if(hasNoRealContent) field.remove();
    });

    document.querySelectorAll('#termList .detail-section').forEach(section=>{
      const heading=section.querySelector('h4');
      if(!heading || heading.textContent.trim().toLowerCase()!=='terminológiai kapcsolatok') return;
      const fields=section.querySelectorAll('.field');
      if(!fields.length) section.remove();
    });
  }

  window.addEventListener('DOMContentLoaded',()=>{
    const list=document.querySelector('#termList');
    if(list){
      new MutationObserver(removeEmptyRelatedFields).observe(list,{childList:true,subtree:true});
    }
    removeEmptyRelatedFields();
    setTimeout(removeEmptyRelatedFields,300);
    setTimeout(removeEmptyRelatedFields,900);
  });
})();
