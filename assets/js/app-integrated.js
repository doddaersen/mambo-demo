(() => {
  const list = document.querySelector('#termList');
  const status = document.querySelector('#status');
  const search = document.querySelector('#termSearch');
  let terms = [];
  let additions = new Map();

  const esc = v => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const norm = v => String(v ?? '').trim().toLowerCase();
  const arr = v => Array.isArray(v) ? v.filter(Boolean) : String(v || '').split(/;|\|/).map(x => x.trim()).filter(Boolean);
  const pick = (o, keys) => keys.map(k => o?.[k]).find(v => v !== undefined && v !== null && String(v).trim() !== '') || '';

  const hu = t => pick(t, ['prefLabel_HU','prefLabelHU','prefLabel','label_hu','title','name']);
  const en = t => pick(t, ['prefLabel_EN','prefLabelEN','label_en','english','en']);
  const def = t => pick(t, ['definition_HU','definitionHU','definition','description','leírás']);
  const usage = t => pick(t, ['usage','usage_HU','usageHU','használat','use']);
  const meaning = t => pick(t, ['meaning','meaning_HU','meaningHU','értelmezés']);
  const cat = t => pick(t, ['category','kategória','category_HU','type']);

  function chips(values){
    const items = arr(values);
    return items.length ? `<div class="tag-list">${items.map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>` : '';
  }
  function p(text){ return text ? `<p class="detail-paragraph">${esc(text)}</p>` : ''; }
  function sec(title, html){ return html ? `<section class="detail-section"><h4>${esc(title)}</h4>${html}</section>` : ''; }

  function merged(term){
    const add = additions.get(norm(hu(term)));
    return add ? {...term, terminology:add} : term;
  }

  function terminologySections(t){
    const tech = t.terminology || {};
    const rels = [...arr(tech.variantOf), ...arr(tech.broader), ...arr(tech.narrower), ...arr(tech.related)];
    return [
      sec('Alternatív elnevezések', chips(tech.altLabel)),
      sec('Kapcsolódó terminusok', chips(rels)),
      sec('Szerkezeti logika', chips(tech.structureLogic))
    ].join('');
  }

  function card(term){
    const t = merged(term);
    const body = [
      sec('Használat és értelmezés', p(usage(t)) + p(meaning(t))),
      terminologySections(t)
    ].join('');

    return `<article class="card" data-category="${esc(cat(t))}">
      <div class="term-summary" role="button" tabindex="0" aria-label="Szócikk részleteinek megnyitása">
        <div class="term-content">
          <div class="card-top">
            <span class="category-label">${esc(cat(t))}</span>
            <h2>${esc(hu(t))}</h2>
            ${en(t)?`<p class="term-en">${esc(en(t))}</p>`:''}
          </div>
          ${def(t)?`<p class="definition">${esc(def(t))}</p>`:''}
          <span class="open-hint">Részletek</span>
        </div>
      </div>
      <div class="card-body"><div class="detail-block">${body || '<p class="detail-paragraph">Nincs részletes adat.</p>'}</div></div>
    </article>`;
  }

  function matches(term, q){
    if(!q) return true;
    const t = merged(term);
    return [hu(t), en(t), def(t), usage(t), meaning(t), cat(t), JSON.stringify(t.terminology || {})]
      .join(' ').toLowerCase().includes(q);
  }

  function bindCards(){
    document.querySelectorAll('.term-summary').forEach(summary => {
      const toggle = () => {
        const card = summary.closest('.card');
        const open = !card.classList.contains('is-open');
        document.querySelectorAll('.card.is-open').forEach(x => x.classList.remove('is-open'));
        if(open) card.classList.add('is-open');
      };
      summary.addEventListener('click', toggle);
      summary.addEventListener('keydown', e => {
        if(e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        toggle();
      });
    });
  }

  function render(){
    const q = norm(search?.value || '');
    const out = terms.filter(t => matches(t, q));
    list.innerHTML = out.map(card).join('');
    status.textContent = `${out.length} szócikk`;
    bindCards();
  }

  async function json(path){
    const r = await fetch(path, {cache:'no-store'});
    if(!r.ok) throw new Error(path);
    return r.json();
  }

  Promise.all([json('data/terms.json'), json('data/terms-terminology-additions.json')]).then(([base, add]) => {
    terms = Array.isArray(base) ? base : (base.terms || base.data || []);
    additions = new Map((add.terms || []).map(x => [norm(x.prefLabel_HU), x]));
    render();
  }).catch(error => {
    console.error(error);
    status.textContent = 'Nem sikerült betölteni az integrált adatokat.';
  });

  search?.addEventListener('input', render);
})();
