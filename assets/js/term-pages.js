(()=>{
  const DATA_URL='data/term-pages.json?v=nyitott-gerinc-1';
  let pageIndex=null;

  function escapeHtml(value){
    return String(value || '')
      .replace(/&/g,'&amp;')
      .replace(/"/g,'&quot;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
  }

  function normalize(value){
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .trim();
  }

  function chipList(items){
    return (items || [])
      .map(item => `<span class="mambo-field-chip">${escapeHtml(item)}</span>`)
      .join('');
  }

  function ontologyRows(ontology){
    const rows=[
      ['Leírási réteg', ontology.category],
      ['MAMBO-osztály', ontology.mamboClass],
      ['MAMBO-property', ontology.mamboProperty],
      ['CIDOC CRM-osztály', ontology.cidocClass],
      ['CIDOC CRM-kapcsolat', ontology.cidocProperty],
      ['Domain', ontology.domain],
      ['Range', ontology.range]
    ];
    return rows
      .filter(([,value]) => value)
      .map(([label,value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join('');
  }

  function linkedValues(values){
    return (values || [])
      .map(item => `<span class="mambo-linked-chip"><strong>${escapeHtml(item.label)}</strong>${escapeHtml(item.value)}</span>`)
      .join('');
  }

  function occurrenceCards(items){
    return (items || []).map(item => `
      <article class="mambo-occurrence-card">
        <h6>${escapeHtml(item.title)}</h6>
        <p class="mambo-occurrence-meta">${escapeHtml(item.creator)}${item.year ? ` · ${escapeHtml(item.year)}` : ''}</p>
        <p class="mambo-occurrence-field">${escapeHtml(item.field)}</p>
        <div class="mambo-linked-values">${linkedValues(item.linkedValues)}</div>
      </article>
    `).join('');
  }

  function renderPage(data){
    return `
      <section class="detail-section mambo-data-view mambo-data-view-dynamic">
        <h4>MAMBO-adatnézet</h4>

        <div class="mambo-subsection">
          <h5>Ontológiai helye</h5>
          <dl class="mambo-meta-list">${ontologyRows(data.ontology || {})}</dl>
          <p class="detail-paragraph">${escapeHtml(data.interpretiveNote)}</p>
        </div>

        <div class="mambo-subsection">
          <h5>Előfordul a mintában</h5>
          <p class="detail-paragraph mambo-occurrence-summary">${escapeHtml(data.occurrenceSummary)}</p>
          <div class="mambo-occurrence-grid">${occurrenceCards(data.occurrences)}</div>
        </div>

        <div class="mambo-subsection">
          <h5>Kapcsolódó mezők</h5>
          <div class="mambo-field-chips">${chipList(data.relatedFields)}</div>
        </div>

        <div class="mambo-subsection">
          <h5>Adatforrás</h5>
          <p class="detail-paragraph">${escapeHtml(data.dataSourceNote)}</p>
        </div>
      </section>
    `;
  }

  function getPageForCard(card){
    if(!pageIndex) return null;
    const termId=card.dataset.termId || '';
    const pageKeyById=pageIndex.terms && pageIndex.terms[termId];
    if(pageKeyById && pageIndex.pages[pageKeyById]) return pageIndex.pages[pageKeyById];

    const hu=normalize(card.querySelector('.card-top h3')?.textContent);
    const en=normalize(card.querySelector('.card-top .en')?.textContent);
    const pageKeyByHu=pageIndex.labels && pageIndex.labels[hu];
    const pageKeyByEn=pageIndex.labels && pageIndex.labels[en];
    const pageKey=pageKeyByHu || pageKeyByEn;
    return pageKey && pageIndex.pages[pageKey] ? pageIndex.pages[pageKey] : null;
  }

  function enhanceCard(card){
    if(card.dataset.termPageEnhanced==='1') return;
    const data=getPageForCard(card);
    if(!data) return;

    const detailBlock=card.querySelector('.detail-block');
    if(!detailBlock) return;

    const existing=detailBlock.querySelector('.mambo-data-view');
    if(existing) existing.remove();

    detailBlock.insertAdjacentHTML('beforeend',renderPage(data));
    card.dataset.termPageEnhanced='1';
  }

  function enhanceAll(){
    document.querySelectorAll('#termList .card').forEach(enhanceCard);
  }

  async function init(){
    try{
      const response=await fetch(DATA_URL,{cache:'no-store'});
      if(!response.ok) throw new Error(`Nem tölthető be: ${DATA_URL}`);
      pageIndex=await response.json();
      enhanceAll();
      const list=document.querySelector('#termList');
      if(list) new MutationObserver(enhanceAll).observe(list,{childList:true,subtree:false});
    }catch(error){
      console.warn('MAMBO szócikk-adatnézet nem tölthető be.',error);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
