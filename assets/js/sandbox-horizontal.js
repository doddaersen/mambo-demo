(()=>{
const iconBase='assets/icons/';
const categoryIcons={
  'formátum':iconBase+'kategoria-formatum-v2.png','könyvforma':iconBase+'kategoria-formatum-v2.png',
  'fűzésmód':iconBase+'kategoria-fuzes.png','kötésmód':iconBase+'kategoria-kotes-2.png',
  'gerincszerkezet':iconBase+'kategoria-gerinc.png','záródás':iconBase+'kategoria-zarodas-2.png','tárolóelem':iconBase+'kategoria-tarolo.png'
};
const fixedIcons={
  'mambo:form-001':['formatum-leporello','leporello','concertina-leporello','accordion'],
  'mambo:form-002':['formatum-dosados','dos-a-dos','dosados'],
  'mambo:form-003':['formatum-tetebeche','tete-beche','tetebeche'],
  'mambo:form-004':['forma-flag','formatum-zaszlokonyv','zaszlokonyv','flag-book'],
  'mambo:form-005':['tunnelv2','formatum-alagutkonyv','alagutkonyv','tunnel-book','tunnel'],
  'mambo:form-006':['popupv2','formatum-popup','pop-up-konyv','popup-konyv','popup'],
  'mambo:form-007':['formatum-fuzet','fuzet','booklet'],
  'mambo:form-035':['forma-flag','formatum-zaszlokonyv','zaszlokonyv','flag-book'],
  'mambo:form-037':['popupv2','formatum-popup','pop-up-konyv','popup-konyv','popup'],
  'mambo:form-038':['tunnelv2','formatum-alagutkonyv','alagutkonyv','tunnel-book','tunnel'],
  'mambo:form-042':['formatum-dosados','dos-a-dos','dosados'],
  'mambo:form-043':['formatum-tetebeche','tete-beche','tetebeche'],
  'mambo:sewing-001':['fuzes-cerna','cernafuzes','sewn-binding'],
  'mambo:sewing-002':['fuzes-irka','irkafuzes','irka-fuzes','saddle-stitch'],
  'mambo:sewing-003':['fuzes-japan','japan-fuzes','japanese-stab-binding'],
  'mambo:binding-001':['kotes-csavaros','csavaros-kotes','csavaros-album','screw-post-binding'],
  'mambo:binding-002':['kotes-belga','titkos-belga-kotes','secret-belgian-binding'],
  'mambo:binding-003':['kotes-kopt','kopt-kotes','coptic-binding'],
  'mambo:binding-004':['kotes-gyurus','gyurus-dosszie','ring-binder'],
  'mambo:binding-005':['fuzes-longstich','kotes-hosszoltes','hosszolteses-kotes','long-stitch-binding','longstitch'],
  'mambo:binding-006':['kotes-szalag','szalaggal-kotott','ribbon-tied-binding','ribbon-binding'],
  'mambo:binding-007':['kotes-ragaszto','kotes-ragasztokotes','ragasztokotes','ragasztott-kotes','perfect-binding'],
  'mambo:bind-002':['fuzes-japan','japan-fuzes','japanese-stab-binding'],
  'mambo:bind-003':['fuzes-cerna','cernafuzes','sewn-binding'],
  'mambo:bind-004':['fuzes-irka','irkafuzes','saddle-stitch'],
  'mambo:bind-005':['kotes-ragaszto','kotes-ragasztokotes','ragasztokotes','ragasztott-kotes','perfect-binding'],
  'mambo:bind-009':['kotes-spiral','spiral-kotes','spiral'],
  'mambo:bind-026':['kotes-kopt','kopt-kotes','coptic-binding'],
  'mambo:bind-028':['kotes-belga','titkos-belga-kotes','secret-belgian-binding'],
  'mambo:bind-029':['kotes-csavaros','csavaros-album','csavaros-kotes','screw-post-binding'],
  'mambo:bind-030':['kotes-gyurus','gyurus-dosszie','ring-binder'],
  'mambo:bind-031':['fuzes-longstich','kotes-hosszoltes','hosszolteses-kotes','long-stitch-binding','longstitch'],
  'mambo:bind-032':['kotes-szalag','szalaggal-kotott','ribbon-tied-binding','ribbon-binding'],
  'mambo:spine-001':['gerinc-nyitott','nyitott-gerinc','open-spine'],
  'mambo:spine-002':['gerinc-fedett','fedett-gerinc','covered-spine'],
  'mambo:spine-003':['gerinc-ureges','hollow-back','ureges-gerinc'],
  'mambo:spine-004':['gerinc-feszes','tight-back','feszes-gerinc'],
  'mambo:spine-005':['gerinc-zsinoros','zsinoros-fuzes','sewing-on-cords'],
  'mambo:spine-006':['gerinc-textilpantos','textilpantos','tape-supported'],
  'mambo:storage-001':['tarolo-tok','tok','slipcase'],
  'mambo:storage-002':['tarolo-doboz','doboz','box'],
  'mambo:storage-003':['tarolo-mappa','mappa','folder','portfolio'],
  'mambo:storage-004':['tarolo-archivalis-doboz','tarolo-archivalo-doboz','archival-box','archivalis-doboz'],
  'mambo:storage-005':['tarolo-talcas-tok','talcas-tok','clamshell-box'],
  'mambo:storage-006':['tarolo-disztok','disztok','presentation-box']
};
const aliases={
  'alagútkönyv':['formatum-alagutkonyv','tunnelv2','tunnel','alagutkonyv','tunnel-book'],
  'kódex-formátum':['formatum-kodex','kodexv2','kodex-formatum','kodex','codex-formatum','codex'],
  'pop-up könyv':['formatum-popup','popupv2','popup','pop-up-konyv','popup-konyv','pop-up-book'],
  'concertina / leporelló':['formatum-leporello','leporello','accordion','concertina-leporello','concertina','accordion-fold'],
  'dos-à-dos':['formatum-dosados','dos-a-dos','dosados'],
  'tekercs':['formatum-scroll','formatum-tekercs','tekercs','scroll'],
  'tête-bêche':['formatum-tetebeche','tete-beche','tetebeche'],
  'zászlókönyv':['forma-flag','formatum-zaszlokonyv','zaszlokonyv','flag-book'],
  'füzet':['formatum-fuzet','fuzet','booklet'],
  'cérnafűzés':['fuzes-cerna','cernafuzes'],
  'irkafűzés':['fuzes-irka','irkafuzes','irka-fuzes'],
  'irka-fűzés':['fuzes-irka','irkafuzes','irka-fuzes'],
  'japán fűzés':['fuzes-japan','japan-fuzes','japanese-stab-binding'],
  'kopt kötés':['kotes-kopt','kopt-kotes','coptic-binding'],
  'ragasztókötés':['kotes-ragaszto','kotes-ragasztokotes','ragasztokotes','ragasztott-kotes','perfect-binding'],
  'gyűrűs mappa':['kotes-gyurus','gyurus-dosszie','ring-binder'],
  'gyűrűs dosszié':['kotes-gyurus','gyurus-dosszie','ring-binder'],
  'csavaros kötés':['kotes-csavaros','csavaros-kotes'],
  'titkos belga kötés':['kotes-belga','titkos-belga-kotes','secret-belgian-binding'],
  'hosszöltéses kötés':['fuzes-longstich','kotes-hosszoltes','hosszolteses-kotes','long-stitch-binding'],
  'szalaggal kötött kötés':['kotes-szalag','szalaggal-kotott','ribbon-binding'],
  'nyitott gerinc':['gerinc-nyitott','nyitott-gerinc','open-spine'],
  'fedett gerinc':['gerinc-fedett','fedett-gerinc','covered-spine'],
  'hollow back [üreges gerinc]':['gerinc-ureges','hollow-back','ureges-gerinc'],
  'tight back [feszes gerinc]':['gerinc-feszes','tight-back','feszes-gerinc'],
  'zsinóros fűzés':['gerinc-zsinoros','zsinoros-fuzes','sewing-on-cords'],
  'textilpántos':['gerinc-textilpantos','textilpantos','tape-supported']
};
function slug(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/à/g,'a').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function uniq(a){return[...new Set(a.flat().filter(Boolean))]}
function pathVariants(name){return[`${iconBase}${name}.png`,`${iconBase}${name}v2.png`,`${iconBase}${name}-v2.png`,`${iconBase}${name}_v2.png`]}
function makeCandidates(names,zoomable){return uniq(names).flatMap(n=>pathVariants(n).map(src=>({src,zoomable})))}
function getIconCandidates(c){
  const id=c.dataset.termId||'',top=c.querySelector('.card-top'),hu=top?.querySelector('h3')?.textContent||'',en=top?.querySelector('.en')?.textContent||'',idSlug=id.replace(/^mambo:/,'').replace(/[:_]/g,'-'),huKey=hu.toLowerCase();
  const realNames=uniq([fixedIcons[id]||[],aliases[huKey]||[],slug(hu),slug(en),idSlug]);
  const real=makeCandidates(realNames,true);
  const placeholder=[{src:iconBase+'kephamarosan.png',zoomable:false}];
  return uniq([...real,...placeholder].map(item=>`${item.src}@@${item.zoomable?'1':'0'}`)).map(item=>{const [src,zoomable]=item.split('@@');return{src,zoomable:zoomable==='1'}});
}
function syncIconState(img){const list=(img.dataset.zoomableCandidates||'').split('|');const i=Number(img.dataset.index||0);img.dataset.iconReal=list[i]==='1'?'1':'0'}
function fallback(img){const list=(img.dataset.candidates||'').split('|');let i=Number(img.dataset.index||0)+1;if(i<list.length){img.dataset.index=i;syncIconState(img);img.src=list[i];}}
function setOpen(c,o){const d=c.querySelector('details'),h=c.querySelector('.open-hint');c.classList.toggle('is-open',o);if(d)d.open=o;if(h)h.textContent=o?'Bezárás':'Részletek'}
function closeOthers(a){document.querySelectorAll('#termList .card.is-open').forEach(c=>{if(c!==a)setOpen(c,false)})}
function toggle(c){const o=!c.classList.contains('is-open');closeOthers(c);setOpen(c,o)}
function normalize(c){const t=c.querySelector('.technical-data');if(!t||c.dataset.detailsNormalized==='1')return;c.dataset.detailsNormalized='1';const lab=document.createElement('div');lab.className='technical-label';lab.textContent='Technikai adatok';t.insertBefore(lab,t.firstChild)}
function build(c){if(c.dataset.horizontalEnhanced==='1')return;const top=c.querySelector('.card-top'),body=c.querySelector('.card-body'),def=c.querySelector('.definition'),det=c.querySelector('details');if(!top||!body||!def||!det)return;c.dataset.horizontalEnhanced='1';normalize(c);const candidates=getIconCandidates(c),srcs=candidates.map(x=>x.src),zoomables=candidates.map(x=>x.zoomable?'1':'0'),sum=document.createElement('div');sum.className='term-summary';sum.tabIndex=0;sum.innerHTML=`<div class="term-icon"><img src="${srcs[0]}" data-candidates="${srcs.join('|')}" data-zoomable-candidates="${zoomables.join('|')}" data-index="0" data-icon-real="${zoomables[0]}" alt=""></div><div class="term-content"></div><span class="open-hint">Részletek</span>`;const img=sum.querySelector('img');img.addEventListener('error',()=>fallback(img));img.addEventListener('load',()=>syncIconState(img));const cont=sum.querySelector('.term-content');cont.appendChild(top);sum.insertBefore(def,sum.querySelector('.open-hint'));c.insertBefore(sum,body);sum.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle(c)});sum.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;e.preventDefault();toggle(c)});setOpen(c,false)}
function enhance(){document.querySelectorAll('#termList .card').forEach(build)}
window.addEventListener('DOMContentLoaded',()=>{const list=document.querySelector('#termList');if(list)new MutationObserver(enhance).observe(list,{childList:true});enhance();setTimeout(enhance,300);setTimeout(enhance,900)})
})();