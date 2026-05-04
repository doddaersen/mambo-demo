const categoryOrder=['formátum','fűzésmód','kötésmód','borítószerkezet','gerincszerkezet','anyag','díszítés','záródás','tárolóelem'];
const categoryKeyMap={
  'könyvforma':'formátum','formátum':'formátum','fűzésmód':'fűzésmód','kötésmód':'kötésmód',
  'borítószerkezet':'borítószerkezet','borító':'borítószerkezet','gerincszerkezet':'gerincszerkezet',
  'anyag':'anyag','material':'anyag','díszítés':'díszítés','diszites':'díszítés','decoration':'díszítés',
  'záródás':'záródás','tárolóelem':'tárolóelem'
};
const categoryLabelMap={
  'formátum':'Formátum','fűzésmód':'Fűzésmód','kötésmód':'Kötésmód','borítószerkezet':'Borítószerkezet',
  'gerincszerkezet':'Gerincszerkezet','anyag':'Anyag','díszítés':'Díszítés','záródás':'Záródás','tárolóelem':'Tárolóelem'
};
const categoryColors={
  'formátum':'#e0a9ba','fűzésmód':'#c2c9ef','kötésmód':'#dbb8e3','borítószerkezet':'#e6d8b8',
  'gerincszerkezet':'#88c6c3','anyag':'#d9d9d9','díszítés':'#f0b36a','záródás':'#c4ca4e','tárolóelem':'#eecba4'
};
const iconBase='assets/icons/';
const iconVersion='?v=cat-decoration-1';
const categoryMeta={
  'formátum':{title:'Formátum',description:'A könyv térbeli, szerkezeti vagy hordozói formája.',icon:iconBase+'kategoria-formatum-v2.png'+iconVersion},
  'fűzésmód':{title:'Fűzésmód',description:'A lapok, ívek vagy könyvtestek összekapcsolásának technikai módja.',icon:iconBase+'kategoria-fuzes.png'+iconVersion},
  'kötésmód':{title:'Kötésmód',description:'A könyvtest vagy lapegyüttes kötészeti rögzítési módja.',icon:iconBase+'kategoria-kotes-2.png'+iconVersion},
  'borítószerkezet':{title:'Borítószerkezet',description:'A külső borítás, táblázás és fedélhez kapcsolódó konstrukció típusa.',icon:iconBase+'kategoria-kotes-2.png'+iconVersion},
  'gerincszerkezet':{title:'Gerincszerkezet',description:'A könyvgerinc kialakítása, láthatósága és működése.',icon:iconBase+'kategoria-gerinc.png'+iconVersion},
  'anyag':{title:'Anyag',description:'A könyvtárgy vagy borító anyaghasználatát leíró kontrollált fogalom.',icon:iconBase+'kategoria-tarolo.png'+iconVersion},
  'díszítés':{title:'Díszítés',description:'Felületképző, díszítő és vizuális hatást létrehozó eljárások.',icon:iconBase+'kategoria-zarodas-2.png'+iconVersion},
  'záródás':{title:'Záródás',description:'A könyv záródását vagy összefogását biztosító szerkezeti megoldás.',icon:iconBase+'kategoria-zarodas-2.png'+iconVersion},
  'tárolóelem':{title:'Tárolóelem',description:'A könyvhöz tartozó védő-, hordozó- vagy gyűjteményi elem.',icon:iconBase+'kategoria-tarolo.png'+iconVersion}
};
const state={terms:[],selectedCategory:'összes',selectedTerm:'',search:'',view:'cards',openCategories:new Set(['formátum'])};
const els={
  filters:document.querySelector('#filters'),categoryFolders:document.querySelector('#categoryFolders'),
  searchInput:document.querySelector('#searchInput'),quickSearchInput:document.querySelector('#quickSearchInput'),
  viewButtons:document.querySelectorAll('.view-button'),termList:document.querySelector('#termList'),
  termsTopline:document.querySelector('#termsTopline'),empty:document.querySelector('#empty'),count:document.querySelector('#count')
};
function escapeHtml(value){return String(value||'').replace(/&/g,'&amp;').replace(/\"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function formatInline(value){return escapeHtml(value).replace(/\[([^\]]+)\]/g,'<span class="bracket-note">[$1]</span>')}
function normalize(value){return String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function asArray(value){if(!value)return[];if(Array.isArray(value))return value.filter(Boolean);return String(value).split(';').map(item=>item.trim()).filter(Boolean)}
function displayCategory(category){return categoryKeyMap[String(category||'').toLowerCase()]||String(category||'').toLowerCase()}
function inferCategory(id){
  if(id.includes(':form-'))return'formátum';
  if(id.includes(':sewing-'))return'fűzésmód';
  if(id.includes(':binding-'))return'kötésmód';
  if(id.includes(':cover-'))return'borítószerkezet';
  if(id.includes(':spine-'))return'gerincszerkezet';
  if(id.includes(':mat-')||id.includes(':material-'))return'anyag';
  if(id.includes(':decoration-')||id.includes(':decor-')||id.includes(':img-'))return'díszítés';
  if(id.includes(':closure-'))return'záródás';
  if(id.includes(':storage-'))return'tárolóelem';
  return'formátum';
}
function inferClass(id){
  if(id.includes(':form-'))return'FormType';
  if(id.includes(':sewing-'))return'SewingType';
  if(id.includes(':binding-'))return'BindingType';
  if(id.includes(':cover-'))return'CoverType';
  if(id.includes(':spine-'))return'SpineType';
  if(id.includes(':mat-')||id.includes(':material-'))return'MaterialType';
  if(id.includes(':decoration-')||id.includes(':decor-')||id.includes(':img-'))return'DecorationType';
  if(id.includes(':closure-'))return'ClosureType';
  if(id.includes(':storage-'))return'StorageType';
  return'Type';
}
function inferProperty(id){
  if(id.includes(':form-'))return'mambo:has_form_type';
  if(id.includes(':sewing-'))return'mambo:has_sewing_type';
  if(id.includes(':binding-'))return'mambo:has_binding_type';
  if(id.includes(':cover-'))return'mambo:has_cover_type';
  if(id.includes(':spine-'))return'mambo:has_spine_type';
  if(id.includes(':mat-')||id.includes(':material-'))return'mambo:has_material';
  if(id.includes(':decoration-')||id.includes(':decor-')||id.includes(':img-'))return'mambo:has_decoration_type';
  if(id.includes(':closure-'))return'mambo:has_closure_type';
  if(id.includes(':storage-'))return'mambo:has_storage_type';
  return'';
}
function normalizeTerm(raw){
  const id=raw.ID||raw.id||'';
  const category=displayCategory(raw.category||raw.Category||inferCategory(id));
  return{
    id,
    prefLabelHu:raw['prefLabel (HU)']||raw.prefLabelHu||'',
    prefLabelEn:raw['prefLabel (EN)']||raw.prefLabelEn||'',
    category,
    tagColor:raw.tagColor||categoryColors[category]||'',
    class:raw.class||raw.Class||inferClass(id),
    property:raw.property||raw.relatedPropertyMambo||inferProperty(id),
    cidoc:raw.CIDOC||raw.cidoc||'',
    altLabelHu:asArray(raw.altLabel||raw.altLabels||raw.altLabelHu),
    altLabelEn:asArray(raw.altLabelEn),
    definition:raw['definition (HU)']||raw.definitionHu||raw.definition||'',
    usage:raw.usage||'',
    meaning:raw.meaning||'',
    relatedTerms:asArray(raw.relatedTerms),
    sources:asArray(raw.source||raw.sources),
    demoStatus:raw.demoStatus||'draft'
  };
}
function getAltLabels(term){return[...asArray(term.altLabelHu),...asArray(term.altLabelEn),...asArray(term.altLabels)]}
function getSearchText(term){return normalize([term.id,term.prefLabelHu,term.prefLabelEn,term.category,term.class,term.property,term.cidoc,term.definition,term.usage,term.meaning,term.demoStatus,...getAltLabels(term),...asArray(term.relatedTerms),...asArray(term.sources)].join(' '))}
function byCategoryThenLabel(a,b){const ai=categoryOrder.indexOf(displayCategory(a.category));const bi=categoryOrder.indexOf(displayCategory(b.category));const diff=(ai<0?999:ai)-(bi<0?999:bi);return diff||String(a.prefLabelHu).localeCompare(String(b.prefLabelHu),'hu')}
function getVisibleTerms(){const query=normalize(state.search.trim());return state.terms.filter(term=>!query||getSearchText(term).includes(query)).sort(byCategoryThenLabel)}
function getCategoryTerms(category){return getVisibleTerms().filter(term=>displayCategory(term.category)===category)}
function getFilteredTerms(){const visible=getVisibleTerms();return state.selectedCategory==='összes'?visible:visible.filter(term=>displayCategory(term.category)===state.selectedCategory)}
function tagStyle(category,term){const color=term.tagColor||categoryColors[category]||'';return color?` style="background:${escapeHtml(color)};border-color:${escapeHtml(color)}"`:''}
function renderCategoryBrowse(){
  els.filters.innerHTML=categoryOrder.map(category=>{const isOpen=state.openCategories.has(category);const terms=getCategoryTerms(category);const meta=categoryMeta[category];return`<section class="browse-group" data-category="${escapeHtml(category)}"><button class="browse-toggle ${isOpen?'open':''}" type="button" data-category="${escapeHtml(category)}" aria-expanded="${isOpen}"><span>${isOpen?'▾':'▸'} ${escapeHtml(meta.title)}</span><span class="count">${terms.length}</span></button><div class="browse-terms ${isOpen?'open':''}">${terms.map(term=>`<button class="browse-term ${term.id===state.selectedTerm?'active':''}" type="button" data-id="${escapeHtml(term.id)}">${formatInline(term.prefLabelHu)}</button>`).join('')}</div></section>`}).join('');
  els.filters.querySelectorAll('.browse-toggle').forEach(button=>button.addEventListener('click',()=>{const category=button.dataset.category;if(state.openCategories.has(category))state.openCategories.delete(category);else state.openCategories.add(category);renderCategoryBrowse()}));
  els.filters.querySelectorAll('.browse-term').forEach(button=>button.addEventListener('click',()=>{const term=state.terms.find(item=>item.id===button.dataset.id);if(!term)return;state.selectedCategory=displayCategory(term.category);state.selectedTerm=term.id;state.openCategories.add(state.selectedCategory);renderAll();requestAnimationFrame(()=>{const card=document.querySelector(`[data-term-id="${CSS.escape(term.id)}"]`);if(!card)return;const details=card.querySelector('details');if(details)details.open=true;card.classList.add('is-open');card.scrollIntoView({behavior:'smooth',block:'center'})})}));
}
function renderCategoryPanels(){
  if(!els.categoryFolders)return;
  els.categoryFolders.innerHTML=categoryOrder.map(category=>{const meta=categoryMeta[category];const count=getCategoryTerms(category).length;return`<button class="category-panel ${category===state.selectedCategory?'active':''}" type="button" data-category="${escapeHtml(category)}"><h3 class="category-panel-title">${escapeHtml(meta.title)}</h3><span class="category-panel-media"><img src="${escapeHtml(meta.icon)}" alt="" loading="lazy"></span><span class="category-panel-text"><p class="category-panel-description">${escapeHtml(meta.description)}</p></span><span class="category-panel-action"><span class="category-panel-count">${count}</span><span class="category-panel-label">szócikk →</span></span></button>`}).join('');
  els.categoryFolders.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{state.selectedCategory=button.dataset.category;state.openCategories.add(state.selectedCategory);renderAll();if(els.termsTopline)els.termsTopline.scrollIntoView({behavior:'smooth',block:'start'})}));
}
function renderTags(items){const values=asArray(items);if(!values.length)return'<span class="tag muted-tag">nincs megadva</span>';return values.map(item=>`<button class="tag" type="button" data-tag="${escapeHtml(item)}">${formatInline(item)}</button>`).join('')}
function renderSourceItems(items){const values=asArray(items);if(!values.length)return'<span class="source-item">—</span>';return values.map(item=>`<span class="source-item">${formatInline(item)}</span>`).join('')}
function field(label,value){return`<div class="field"><strong>${escapeHtml(label)}</strong>${formatInline(value||'—')}</div>`}
function tagField(label,values){return`<div class="field"><strong>${escapeHtml(label)}</strong><div class="tag-list">${renderTags(values)}</div></div>`}
function sourceField(label,values){return`<div class="field"><strong>${escapeHtml(label)}</strong><div class="source-list">${renderSourceItems(values)}</div></div>`}
function noteParagraph(value){return value?`<p class="detail-paragraph">${formatInline(value)}</p>`:''}
function statusField(label,value){return`<div class="field technical-field"><strong>${escapeHtml(label)}</strong><span class="status-badge">${formatInline(value||'pilot')}</span></div>`}
function detailSection(title,content){return`<section class="detail-section"><h4>${escapeHtml(title)}</h4>${content}</section>`}
function technicalGroup(title,content){return`<div class="technical-group"><div class="technical-subheading">${escapeHtml(title)}</div>${content}</div>`}
function getCardMarkup(term){const category=displayCategory(term.category),label=categoryLabelMap[category]||category;return`<article class="card" data-category="${escapeHtml(category)}" data-term-id="${escapeHtml(term.id)}"><div class="card-top"><span class="category" data-category="${escapeHtml(category)}"${tagStyle(category,term)}>${escapeHtml(label)}</span><h3>${formatInline(term.prefLabelHu)}</h3><div class="en">${formatInline(term.prefLabelEn)}</div></div><div class="card-body"><p class="definition">${formatInline(term.definition)}</p><details><summary><span>Részletes nézet</span><span class="summary-icon" aria-hidden="true">↓</span></summary><div class="detail-block">${detailSection('Használat és értelmezés',`${noteParagraph(term.usage)}${noteParagraph(term.meaning)}`)}${detailSection('Terminológiai kapcsolatok',`${tagField('Alternatív elnevezések',term.altLabelHu)}${tagField('Kapcsolódó fogalmak',term.relatedTerms)}`)}<section class="detail-section technical-data"><h4>Technikai adatok</h4>${technicalGroup('Rekord',`<div class="ontology-row">${field('Azonosító',term.id)}${statusField('Státusz',term.demoStatus)}</div>`)}${technicalGroup('Ontológiai kapcsolás',`<div class="ontology-row">${field('MAMBO-osztály',term.class)}${field('MAMBO-property',term.property)}</div>${field('CIDOC',term.cidoc)}`)}${technicalGroup('Leírás forrásai',sourceField('Források',term.sources))}</section></div></details></div></article>`}
function renderCards(){const terms=getFilteredTerms();els.count.textContent=`${terms.length} / ${state.terms.length} szócikk`;els.termList.classList.toggle('list-view',state.view==='list');els.empty.classList.toggle('show',terms.length===0);els.termList.innerHTML=terms.map(getCardMarkup).join('')}
function renderViewButtons(){els.viewButtons.forEach(button=>button.classList.toggle('active',button.dataset.view===state.view))}
function renderAll(){renderCategoryBrowse();renderCategoryPanels();renderViewButtons();renderCards()}
async function loadDefinitionOverrides(){try{const response=await fetch('data/definition-overrides.json?v=colors-4');if(!response.ok)return{};return await response.json()}catch(error){return{}}}
async function loadJson(url){const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(`Nem tölthető be: ${url}`);return await response.json()}
async function init(){try{
  const masterUrl='https://raw.githubusercontent.com/doddaersen/mambo-demo/draft-material-vocabulary/data/demo-master-draft.json?v=sandbox-preview-20260502';
  const [master,decorations,definitionOverrides]=await Promise.all([loadJson(masterUrl),loadJson('data/decorations.json?v=1'),loadDefinitionOverrides()]);
  const allTerms=[...(master.terms||[]),...(decorations.terms||[])];
  state.terms=allTerms.map(normalizeTerm).map(term=>({...term,definition:definitionOverrides[term.id]||term.definition}));
  renderAll();
}catch(error){els.empty.textContent='A szótáradat nem tölthető be.';els.empty.classList.add('show');console.error(error)}}
function setSearch(value){state.search=value;state.selectedTerm='';if(state.search.trim()){state.selectedCategory='összes';state.openCategories=new Set(categoryOrder)}if(els.searchInput)els.searchInput.value=value;if(els.quickSearchInput)els.quickSearchInput.value=value;renderAll()}
[els.searchInput,els.quickSearchInput].filter(Boolean).forEach(input=>input.addEventListener('input',event=>setSearch(event.target.value)));
els.viewButtons.forEach(button=>button.addEventListener('click',()=>{state.view=button.dataset.view;renderAll()}));
els.termList.addEventListener('click',event=>{const tag=event.target.closest('.tag');const summary=event.target.closest('summary');const card=event.target.closest('.card');if(tag){setSearch(tag.dataset.tag||'');if(els.searchInput)els.searchInput.focus();return}if(!card)return;const details=card.querySelector('details');if(!details)return;if(summary)event.preventDefault();const shouldOpen=!details.open;els.termList.querySelectorAll('.card.is-open').forEach(openCard=>{if(openCard!==card){const openDetails=openCard.querySelector('details');if(openDetails)openDetails.open=false;openCard.classList.remove('is-open')}});details.open=shouldOpen;card.classList.toggle('is-open',shouldOpen)});
init();
