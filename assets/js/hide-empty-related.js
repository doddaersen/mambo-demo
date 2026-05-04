(()=>{
  // Applies to every term card, not only the decoration data layer.
  // Empty related-term fields are visual noise, so they are removed after each render.
  function removeEmptyRelatedFields(){
    document.querySelectorAll('#termList .field').forEach(field=>{
      const label=field.querySelector('strong');
      if(!label) return;

      const labelText=label.textContent.trim().toLowerCase();
      if(labelText!=='kapcsolódó fogalmak') return;

      const realTags=[...field.querySelectorAll('.tag')].filter(tag=>!tag.classList.contains('muted-tag'));
      const mutedOnly=field.querySelector('.muted-tag') && realTags.length===0;
      const tagList=field.querySelector('.tag-list');
      const emptyText=!tagList || !tagList.textContent.trim();

      if(mutedOnly || emptyText) field.remove();
    });

    document.querySelectorAll('#termList .detail-section').forEach(section=>{
      const heading=section.querySelector('h4');
      if(!heading) return;
      if(heading.textContent.trim().toLowerCase()!=='terminológiai kapcsolatok') return;

      const fields=section.querySelectorAll('.field');
      if(!fields.length) section.remove();
    });
  }

  function init(){
    const list=document.querySelector('#termList');
    if(list){
      new MutationObserver(removeEmptyRelatedFields).observe(list,{childList:true,subtree:true});
    }

    removeEmptyRelatedFields();
    setTimeout(removeEmptyRelatedFields,150);
    setTimeout(removeEmptyRelatedFields,500);
    setTimeout(removeEmptyRelatedFields,1000);
  }

  if(document.readyState==='loading'){
    window.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
})();
